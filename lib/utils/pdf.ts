import { jsPDF } from "jspdf";
import { Bill, Purchase, ShopSettings } from "@/lib/types/database";

function formatPdfAmount(amount: number): string {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generates and downloads a real PDF file for a supplier purchase invoice.
 */
export function downloadPurchasePdf(p: Purchase) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 48;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(11, 17, 32);
  doc.text("Safary Bags and Footwear", 40, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Supplier Purchase Invoice", 40, y + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Invoice #: ${p.invoice_number}`, pageWidth - 40, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${p.purchase_date}`, pageWidth - 40, y + 15, { align: "right" });
  doc.text(`Status: ${p.status.toUpperCase()}`, pageWidth - 40, y + 30, { align: "right" });

  y += 44;
  doc.setDrawColor(31, 95, 255);
  doc.setLineWidth(1.5);
  doc.line(40, y, pageWidth - 40, y);

  y += 22;
  doc.setFillColor(248, 250, 252);
  doc.rect(40, y, pageWidth - 80, 42, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Supplier: ${p.supplier?.name || "Direct Vendor"}`, 52, y + 17);
  doc.setFont("helvetica", "normal");
  doc.text(`Phone: ${p.supplier?.phone || "N/A"}`, 52, y + 32);

  y += 64;
  doc.setFillColor(241, 245, 249);
  doc.rect(40, y, pageWidth - 80, 24, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Purchased Item", 50, y + 15);
  doc.text("Qty", 330, y + 15, { align: "right" });
  doc.text("Unit Cost", 430, y + 15, { align: "right" });
  doc.text("Subtotal", pageWidth - 50, y + 15, { align: "right" });

  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);

  const items = (p.items || []) as any[];
  if (items.length === 0) {
    doc.text("No line items recorded", 50, y + 10);
    y += 24;
  } else {
    items.forEach((it, idx) => {
      if (y > 740) {
        doc.addPage();
        y = 48;
      }
      const name = `${idx + 1}. ${it.item_name || "Purchased Item"}`;
      doc.text(name.slice(0, 46), 50, y + 10);
      doc.text(String(it.quantity || 0), 330, y + 10, { align: "right" });
      doc.text(formatPdfAmount(it.unit_cost || 0), 430, y + 10, { align: "right" });
      doc.text(formatPdfAmount(it.subtotal || 0), pageWidth - 50, y + 10, { align: "right" });
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(40, y + 18, pageWidth - 40, y + 18);
      y += 24;
    });
  }

  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(31, 95, 255);
  doc.text(`Total Purchase Cost: ${formatPdfAmount(p.total_amount)}`, pageWidth - 40, y, {
    align: "right",
  });

  doc.save(`Purchase_Invoice_${p.invoice_number}.pdf`);
}

/**
 * Generates and downloads a real PDF file for a POS customer receipt.
 */
export function downloadBillPdf(bill: Bill, settings: ShopSettings) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 48;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(11, 17, 32);
  doc.text(settings.shop_name || "Safary Bags and Footwear", pageWidth / 2, y, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(
    settings.address || (settings.phone ? `Tel: ${settings.phone}` : "Retail Store Receipt"),
    pageWidth / 2,
    y + 16,
    {
      align: "center",
    }
  );

  y += 38;
  doc.setDrawColor(31, 95, 255);
  doc.setLineWidth(1.2);
  doc.line(40, y, pageWidth - 40, y);

  y += 20;
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Bill #: ${bill.bill_number}`, 40, y);
  doc.text(`Date: ${String(bill.created_at).slice(0, 10)}`, pageWidth - 40, y, {
    align: "right",
  });

  y += 24;
  doc.setFillColor(241, 245, 249);
  doc.rect(40, y, pageWidth - 80, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Item", 50, y + 15);
  doc.text("Qty", 330, y + 15, { align: "right" });
  doc.text("Rate", 430, y + 15, { align: "right" });
  doc.text("Amount", pageWidth - 50, y + 15, { align: "right" });

  y += 28;
  doc.setFont("helvetica", "normal");
  (bill.items || []).forEach((it) => {
    const label = `${it.product_name_snapshot} (${it.colour_snapshot}, Size ${it.size_snapshot})`;
    doc.text(label.slice(0, 46), 50, y + 10);
    doc.text(String(it.quantity), 330, y + 10, { align: "right" });
    doc.text(formatPdfAmount(it.unit_price), 430, y + 10, { align: "right" });
    doc.text(formatPdfAmount(it.subtotal), pageWidth - 50, y + 10, { align: "right" });
    y += 22;
  });

  y += 14;
  doc.setDrawColor(203, 213, 225);
  doc.line(40, y, pageWidth - 40, y);
  y += 20;
  doc.text(`Subtotal: ${formatPdfAmount(bill.subtotal)}`, pageWidth - 40, y, { align: "right" });
  if (bill.discount > 0) {
    y += 16;
    doc.text(`Discount: -${formatPdfAmount(bill.discount)}`, pageWidth - 40, y, {
      align: "right",
    });
  }
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(31, 95, 255);
  doc.text(`Net Total: ${formatPdfAmount(bill.total_amount)}`, pageWidth - 40, y, {
    align: "right",
  });

  doc.save(`Receipt_${bill.bill_number}.pdf`);
}

/**
 * Generates and downloads a real PDF file for the Financial & Sales Report.
 */
export function downloadReportPdf(data: {
  totalGrossSales: number;
  totalDiscounts?: number;
  totalCostOfGoodsSold: number | null;
  grossProfit: number | null;
  totalExpensesAmount: number;
  netOperatingProfit: number | null;
  billCount?: number;
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toISOString().slice(0, 10);
  let y = 48;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(11, 17, 32);
  doc.text("Safary Bags and Footwear", 40, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Financial & Sales Report • Generated ${today}`, 40, y + 16);

  y += 32;
  doc.setDrawColor(31, 95, 255);
  doc.setLineWidth(1.5);
  doc.line(40, y, pageWidth - 40, y);

  y += 28;
  const rows: [string, string][] = [
    ["Total Net Sales", formatPdfAmount(data.totalGrossSales)],
    ["Total Completed Bills", String(data.billCount ?? 0)],
    ["Total Discounts Given", formatPdfAmount(data.totalDiscounts ?? 0)],
    ...(data.totalCostOfGoodsSold !== null
      ? [["Estimated Cost of Goods (COGS)", formatPdfAmount(data.totalCostOfGoodsSold)] as [string, string]]
      : []),
    ...(data.grossProfit !== null
      ? [["Gross Profit", formatPdfAmount(data.grossProfit)] as [string, string]]
      : []),
    ["Total Shop Expenses", formatPdfAmount(data.totalExpensesAmount)],
    ...(data.netOperatingProfit !== null
      ? [["Net Operating Profit", formatPdfAmount(data.netOperatingProfit)] as [string, string]]
      : []),
  ];

  rows.forEach(([label, val]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text(label, 50, y);
    doc.setTextColor(15, 23, 42);
    doc.text(val, pageWidth - 50, y, { align: "right" });
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(40, y + 10, pageWidth - 40, y + 10);
    y += 28;
  });

  doc.save(`Safary_Sales_Report_${today}.pdf`);
}
