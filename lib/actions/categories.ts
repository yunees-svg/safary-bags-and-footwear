"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Category } from "@/lib/types/database";

export async function getCategoriesAction(): Promise<Category[]> {
  return mockStore.getCategories();
}

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("image_url") as string;

  if (!name || name.trim().length === 0) {
    return { error: "Category name is required." };
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const existing = mockStore.getCategories().find((c) => c.slug === slug);
  if (existing) {
    return { error: "A category with this name or slug already exists." };
  }

  const newCat = mockStore.addCategory({
    name: name.trim(),
    slug,
    description: description?.trim() || null,
    image_url: imageUrl?.trim() || null,
    is_active: true,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, category: newCat };
}

export async function updateCategoryAction(
  id: string,
  updates: { name?: string; description?: string; image_url?: string; is_active?: boolean }
) {
  const cat = mockStore.updateCategory(id, updates);
  if (!cat) {
    return { error: "Category not found." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, category: cat };
}

export async function toggleCategoryStatusAction(id: string, is_active: boolean) {
  return updateCategoryAction(id, { is_active });
}

export async function deleteCategoryAction(id: string) {
  const success = mockStore.deleteCategory(id);
  if (!success) {
    return {
      error: "Cannot delete category: products are currently assigned to it. Please reassign or delete them first.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}
