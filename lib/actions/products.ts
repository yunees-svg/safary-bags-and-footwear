"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Product, ProductVariant } from "@/lib/types/database";
import { getCurrentUser } from "@/lib/actions/auth";
import { MAX_PHOTO_DATA_URL_LENGTH } from "@/lib/image";

export async function getProductsAction() {
  const user = await getCurrentUser();
  const isOwner = user?.role === "owner";
  const products = mockStore.getProducts();

  // If staff, mask cost_price to maintain financial confidentiality
  return products.map((p) => ({
    ...p,
    cost_price: isOwner ? p.cost_price : 0,
  }));
}

export async function getProductByIdAction(id: string) {
  const user = await getCurrentUser();
  const isOwner = user?.role === "owner";
  const product = mockStore.getProductById(id);
  if (!product) return null;

  return {
    ...product,
    cost_price: isOwner ? product.cost_price : 0,
  };
}

function isValidPhoto(photo: string) {
  return photo.startsWith("data:image/jpeg;base64,") && photo.length <= MAX_PHOTO_DATA_URL_LENGTH;
}

function setProductPhoto(productId: string, photo: string) {
  mockStore.updateProduct(productId, {
    images: [{ id: `img_${productId}`, product_id: productId, image_url: photo, display_order: 0 }],
  });
}

export interface CreateProductPayload {
  photo?: string;
  category_id: string;
  product_code: string;
  name: string;
  brand: string;
  description?: string;
  selling_price: number;
  cost_price: number;
  is_published: boolean;
  variants: {
    colour: string;
    size: string;
    sku: string;
    stock_quantity: number;
    low_stock_threshold: number;
  }[];
}

export async function createProductWithVariantsAction(payload: CreateProductPayload) {
  const user = await getCurrentUser();

  if (!payload.product_code || !payload.name || !payload.category_id) {
    return { error: "Product code, name, and category are required." };
  }

  if (payload.selling_price < 0 || payload.cost_price < 0) {
    return { error: "Prices must be positive numbers." };
  }

  if (!payload.variants || payload.variants.length === 0) {
    return { error: "Please configure at least one colour and size variant." };
  }

  if (payload.photo && !isValidPhoto(payload.photo)) {
    return { error: "Please upload a valid photo." };
  }

  // Check code uniqueness
  const existing = mockStore.getProducts().find(
    (p) => p.product_code.toUpperCase() === payload.product_code.toUpperCase()
  );
  if (existing) {
    return { error: `Product code '${payload.product_code}' is already in use.` };
  }

  const newProd = mockStore.addProduct(
    {
      category_id: payload.category_id,
      product_code: payload.product_code.trim().toUpperCase(),
      name: payload.name.trim(),
      brand: payload.brand?.trim() || "In-House",
      description: payload.description?.trim() || null,
      selling_price: Number(payload.selling_price),
      cost_price: Number(payload.cost_price),
      is_published: payload.is_published,
    },
    payload.variants.map((v) => ({
      colour: v.colour.trim(),
      size: v.size.trim(),
      sku: v.sku.trim() || `${payload.product_code}-${v.colour.slice(0, 3).toUpperCase()}-${v.size}`,
      stock_quantity: Number(v.stock_quantity) || 0,
      low_stock_threshold: Number(v.low_stock_threshold) || 5,
    }))
  );

  // If initial stock was provided, record initial stock movements
  payload.variants.forEach((v) => {
    if (v.stock_quantity > 0) {
      const addedVariant = mockStore.getSnapshot().variants.find(
        (vr) => vr.product_id === newProd.id && vr.colour === v.colour && vr.size === v.size
      );
      if (addedVariant) {
        mockStore.getSnapshot().stockMovements.unshift({
          id: `sm_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          variant_id: addedVariant.id,
          movement_type: "adjustment_in",
          quantity: v.stock_quantity,
          reference_type: "opening_stock",
          reason: "Initial product creation opening stock",
          created_by: user?.id || "admin",
          created_at: new Date().toISOString(),
        });
      }
    }
  });

  if (payload.photo) setProductPhoto(newProd.id, payload.photo);

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/pos");
  revalidatePath("/");
  return { success: true, product: newProd };
}

export async function quickAddSlipperAction(payload: {
  photo: string;
  name: string;
  sizes: string;
  price: number;
  entry_date: string;
  brand: string;
  colours: string;
  stock_per_size: number;
  category_id: string;
}) {
  if (!(await getCurrentUser())) {
    return { error: "Please sign in to add a slipper." };
  }

  const name = payload.name.trim();
  // Trim, drop blanks and remove repeated sizes
  const sizes = Array.from(
    new Set(payload.sizes.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean))
  );

  const brand = payload.brand.trim();
  // Drop blanks and colours repeated with different capitals
  const colours = Array.from(
    new Map(
      payload.colours.split(",").map((c) => c.trim()).filter(Boolean).map((c) => [c.toLowerCase(), c])
    ).values()
  );

  if (!brand) return { error: "Please enter the brand." };
  if (colours.length === 0) return { error: "Please enter at least one colour." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.entry_date)) {
    return { error: "Please choose a date." };
  }
  if (!name) return { error: "Please enter the slipper name." };
  if (sizes.length === 0) return { error: "Please enter at least one size." };
  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    return { error: "Price must be greater than zero." };
  }
  if (!Number.isInteger(payload.stock_per_size) || payload.stock_per_size < 0) {
    return { error: "Stock must be a whole number, 0 or more." };
  }
  if (!isValidPhoto(payload.photo)) {
    return { error: "Please upload a valid photo." };
  }
  if (!mockStore.getCategories().some((c) => c.id === payload.category_id)) {
    return { error: "Please choose a category." };
  }

  const productCode = `SL-${Date.now().toString(36).toUpperCase()}`;
  const result = await createProductWithVariantsAction({
    photo: payload.photo,
    category_id: payload.category_id,
    product_code: productCode,
    name,
    brand,
    selling_price: payload.price,
    cost_price: 0,
    is_published: true,
    variants: colours.flatMap((colour, colourIndex) =>
      sizes.map((size) => ({
        colour,
        size,
        sku: `${productCode}-${colourIndex + 1}-${size}`,
        stock_quantity: payload.stock_per_size,
        low_stock_threshold: mockStore.getSettings().low_stock_default,
      }))
    ),
  });

  if (!result.product) return { error: result.error };

  mockStore.updateProduct(result.product.id, { entry_date: payload.entry_date });

  return { success: true };
}

export async function updateProductAction(
  id: string,
  payload: Omit<Partial<Product>, "variants"> & {
    photo?: string;
    variants?: {
      id?: string;
      colour: string;
      size: string;
      sku: string;
      stock_quantity: number;
      low_stock_threshold: number;
    }[];
  }
) {
  const existing = mockStore.getProductById(id);
  if (!existing) {
    return { error: "Product not found." };
  }

  if (payload.photo) {
    if (!(await getCurrentUser())) return { error: "Please sign in to change the photo." };
    if (!isValidPhoto(payload.photo)) return { error: "Please upload a valid photo." };
    setProductPhoto(id, payload.photo);
  }

  const updated = mockStore.updateProduct(id, {
    category_id: payload.category_id,
    name: payload.name,
    brand: payload.brand,
    description: payload.description,
    selling_price: payload.selling_price !== undefined ? Number(payload.selling_price) : undefined,
    cost_price: payload.cost_price !== undefined ? Number(payload.cost_price) : undefined,
    is_published: payload.is_published,
  });

  // Update variants if provided
  if (payload.variants) {
    payload.variants.forEach((v) => {
      if (v.id) {
        const found = mockStore.getSnapshot().variants.find((vr) => vr.id === v.id);
        if (found) {
          found.colour = v.colour;
          found.size = v.size;
          found.sku = v.sku;
          found.low_stock_threshold = v.low_stock_threshold;
        }
      } else {
        // Add new variant
        mockStore.getSnapshot().variants.push({
          id: `var_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          product_id: id,
          colour: v.colour,
          size: v.size,
          sku: v.sku,
          stock_quantity: Number(v.stock_quantity) || 0,
          low_stock_threshold: Number(v.low_stock_threshold) || 5,
        });
      }
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/pos");
  revalidatePath("/");
  return { success: true, product: updated };
}

export async function toggleProductPublishAction(id: string, is_published: boolean) {
  const updated = mockStore.updateProduct(id, { is_published });
  if (!updated) return { error: "Product not found." };

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteOrArchiveProductAction(id: string) {
  const deleted = mockStore.deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/pos");
  revalidatePath("/");

  if (!deleted) {
    return {
      success: true,
      archived: true,
      message:
        "Product has historical sales transactions. To protect accounting records, it has been safely archived (unpublished) instead of permanently deleted.",
    };
  }

  return { success: true, archived: false, message: "Product deleted successfully." };
}
