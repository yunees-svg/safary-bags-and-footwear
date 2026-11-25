import { getEnquiriesAction } from "@/lib/actions/enquiries";
import { getInventoryVariantsAction } from "@/lib/actions/inventory";
import { EnquiriesClient } from "@/components/admin/enquiries-client";

export const instant = false;

export default async function AdminEnquiriesPage() {
  const [enquiries, variants] = await Promise.all([
    getEnquiriesAction(),
    getInventoryVariantsAction(),
  ]);

  return <EnquiriesClient enquiries={enquiries} variants={variants} />;
}
