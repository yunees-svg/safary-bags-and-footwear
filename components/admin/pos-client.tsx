"use client";

import { useState } from "react";
import { Product, Category, Customer, ShopSettings, ProductVariant, PaymentMethod, Bill } from "@/lib/types/database";
import { createPosBillAction } from "@/lib/actions/pos";
import { ReceiptModal } from "@/components/admin/receipt-modal";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  UserPlus,
  Banknote,
  QrCode,
  Tag,
  AlertCircle,
  Loader2,
  Check,
  CheckCircle2,
  X,
} from "lucide-react";

interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  category?: Category;
}

interface PosClientProps {
  products: ProductWithVariants[];
  categories: Category[];
  customers: Customer[];
  settings: ShopSettings;
}

interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  colour: string;
  size: string;
  unitPrice: number;
  availableStock: number;
  quantity: number;
}

export function PosClient({ products, categories, customers, settings }: PosClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Customer selection
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("walkin");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");

  // Payment controls
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [discount, setDiscount] = useState<number>(0);
  const [cashTendered, setCashTendered] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  // Variant selector popup state
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<ProductWithVariants | null>(null);

  // Bill result modal state
  const [confirmedBill, setConfirmedBill] = useState<Bill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category_id === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_code.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate cart totals
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount);
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - finalTotal);

  function handleProductClick(product: ProductWithVariants) {
    if (product.variants.length === 1) {
      // Direct add if only one variant
      addToCart(product, product.variants[0]);
    } else {
      setSelectedProductForVariant(product);
    }
  }

  function addToCart(product: Product, variant: ProductVariant) {
    if (variant.stock_quantity <= 0) {
      setError(`Sorry, ${product.name} (${variant.colour}, Size ${variant.size}) is out of stock.`);
      return;
    }

    setError(null);
    const existingIndex = cart.findIndex((item) => item.variantId === variant.id);

    if (existingIndex > -1) {
      const existing = cart[existingIndex];
      if (existing.quantity + 1 > variant.stock_quantity) {
        setError(`Cannot add more than ${variant.stock_quantity} available pairs for this variant.`);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          variantId: variant.id,
          productId: product.id,
          productName: product.name,
          colour: variant.colour,
          size: variant.size,
          unitPrice: product.selling_price,
          availableStock: variant.stock_quantity,
          quantity: 1,
        },
      ]);
    }

    setSelectedProductForVariant(null);
  }

  function updateQuantity(variantId: string, delta: number) {
    const index = cart.findIndex((item) => item.variantId === variantId);
    if (index === -1) return;

    const item = cart[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      setCart(cart.filter((i) => i.variantId !== variantId));
    } else if (newQty > item.availableStock) {
      setError(`Only ${item.availableStock} pairs in stock.`);
    } else {
      setError(null);
      const updated = [...cart];
      updated[index].quantity = newQty;
      setCart(updated);
    }
  }

  function removeFromCart(variantId: string) {
    setCart(cart.filter((i) => i.variantId !== variantId));
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      setError("Please select slippers into the cart first.");
      return;
    }

    setError(null);
    setLoading(true);

    const paidAmount = paymentMethod === "credit" ? 0 : finalTotal;

    const res = await createPosBillAction({
      customer_id: selectedCustomerId !== "walkin" && !isAddingCustomer ? selectedCustomerId : null,
      customer_name: isAddingCustomer ? newCustName : undefined,
      customer_phone: isAddingCustomer ? newCustPhone : undefined,
      items: cart.map((i) => ({
        variant_id: i.variantId,
        quantity: i.quantity,
      })),
      discount,
      payment_method: paymentMethod,
      paid_amount: paidAmount,
      reference_number: referenceNumber || undefined,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.bill) {
      setConfirmedBill(res.bill);
      // Reset cart
      setCart([]);
      setDiscount(0);
      setCashTendered("");
      setReferenceNumber("");
      setIsAddingCustomer(false);
      setNewCustName("");
      setNewCustPhone("");
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-4">
      {/* LEFT PANE: Product Catalog & Search */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col min-w-0 overflow-hidden">
        {/* Top Filter & Search */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                autoFocus
                placeholder="Search slipper name, code, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full font-medium transition shrink-0 ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Slippers
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-full font-medium transition shrink-0 ${
                  selectedCategory === c.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <Tag className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs font-semibold">No slippers found</p>
              <p className="text-[11px]">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((acc, v) => acc + v.stock_quantity, 0);
                const isOutOfStock = totalStock === 0;

                return (
                  <button
                    key={p.id}
                    disabled={isOutOfStock}
                    onClick={() => handleProductClick(p)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition group relative ${
                      isOutOfStock
                        ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                        : "bg-white border-slate-200 hover:border-blue-500 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono bg-slate-100 px-1 rounded">{p.product_code}</span>
                        <span
                          className={`font-semibold ${
                            isOutOfStock ? "text-red-500" : totalStock <= 5 ? "text-amber-500" : "text-emerald-600"
                          }`}
                        >
                          {totalStock} in stock
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.brand}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {formatCurrency(p.selling_price)}
                      </span>
                      <span className="text-[10px] font-medium text-blue-600 group-hover:underline">
                        {p.variants.length > 1 ? `${p.variants.length} Options` : "Quick Add"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Cart & POS Checkout */}
      <div className="w-full lg:w-96 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        {/* Customer Select Header */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" /> Customer:
            </span>
            <button
              onClick={() => setIsAddingCustomer(!isAddingCustomer)}
              className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              {isAddingCustomer ? "Cancel New" : "+ Add New Customer"}
            </button>
          </div>

          {isAddingCustomer ? (
            <div className="space-y-1.5 pt-1">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-900"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          ) : (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="walkin">Walk-in Customer (General Counter Sale)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) {c.outstanding_balance ? `[Due: ₹${c.outstanding_balance}]` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="p-2.5 bg-red-50 border-b border-red-200 text-red-700 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
              <ShoppingCart className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs font-semibold">Your bill is empty</p>
              <p className="text-[11px]">Click any slipper on the left to add it.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.variantId}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.productName}</p>
                  <p className="text-[11px] text-slate-500">
                    {item.colour} • Size {item.size}
                  </p>
                  <p className="text-xs font-black text-blue-600 mt-0.5">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.variantId, -1)}
                    className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, 1)}
                    className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="p-1 text-slate-400 hover:text-red-600 ml-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Payment Section */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-3">
          {/* Subtotal & Discount */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items):</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Discount (₹):</span>
              <input
                type="number"
                min="0"
                value={discount === 0 ? "" : discount}
                onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0.00"
                className="w-20 px-2 py-0.5 text-right font-semibold text-xs border border-slate-200 rounded bg-white"
              />
            </div>
            <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t border-slate-200">
              <span>Net Payable:</span>
              <span className="text-blue-700">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["cash", "upi", "card", "credit"] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition ${
                    paymentMethod === method
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Tendered Change calculator if Cash */}
          {paymentMethod === "cash" && (
            <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-600">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash Tendered:</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="₹ Amount"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  className="w-20 px-2 py-0.5 text-right font-semibold text-xs border border-slate-200 rounded"
                />
                {tenderedNum > finalTotal && (
                  <span className="text-[10px] font-bold text-emerald-600">
                    Change: {formatCurrency(changeDue)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* UPI reference number if UPI */}
          {paymentMethod === "upi" && (
            <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-600">
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                <span>UPI Ref / UTR:</span>
              </div>
              <input
                type="text"
                placeholder="Optional Ref No."
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-32 px-2 py-0.5 text-right font-mono text-xs border border-slate-200 rounded"
              />
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="button"
            disabled={cart.length === 0 || loading}
            onClick={handleCheckout}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Bill...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Confirm & Print Bill ({formatCurrency(finalTotal)})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Variant Selector Dialog */}
      {selectedProductForVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">{selectedProductForVariant.name}</h2>
              <button
                onClick={() => setSelectedProductForVariant(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Select available colour & size to add to cart:
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {selectedProductForVariant.variants.map((v) => (
                <button
                  key={v.id}
                  disabled={v.stock_quantity <= 0}
                  onClick={() => addToCart(selectedProductForVariant, v)}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center justify-between transition ${
                    v.stock_quantity <= 0
                      ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-slate-800"
                  }`}
                >
                  <div>
                    <span className="font-semibold text-slate-900">{v.colour}</span>
                    <span className="text-slate-500 ml-1.5">• Size {v.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold ${
                        v.stock_quantity <= 0
                          ? "text-red-500"
                          : v.stock_quantity <= 5
                          ? "text-amber-500"
                          : "text-emerald-600"
                      }`}
                    >
                      {v.stock_quantity > 0 ? `${v.stock_quantity} in stock` : "Out of stock"}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bill Receipt Dialog */}
      {confirmedBill && (
        <ReceiptModal
          bill={confirmedBill}
          settings={settings}
          onClose={() => setConfirmedBill(null)}
        />
      )}
    </div>
  );
}
