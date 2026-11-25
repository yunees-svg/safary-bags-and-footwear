import { getStockMovementsAction } from "@/lib/actions/inventory";
import { StockMovementsClient } from "@/components/admin/stock-movements-client";

export const instant = false;

export default async function StockMovementsPage() {
  const movements = await getStockMovementsAction();
  return <StockMovementsClient movements={movements} />;
}
