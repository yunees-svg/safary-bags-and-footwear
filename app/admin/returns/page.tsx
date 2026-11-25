import { getReturnsAction } from "@/lib/actions/returns";
import { ReturnsClient } from "@/components/admin/returns-client";

export const instant = false;

export default async function AdminReturnsPage() {
  const returns = await getReturnsAction();
  return <ReturnsClient returns={returns} />;
}
