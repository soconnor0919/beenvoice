"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BusinessForm } from "~/components/forms/business-form";
import { PageHeader } from "~/components/layout/page-header";

export default function EditBusinessPage() {
  const params = useParams();
  const businessId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  if (!businessId) return null;

  return (
    <div>
      <PageHeader
        title="Edit Business"
        description="Update business information below."
        variant="gradient"
      />

      <BusinessForm businessId={businessId} mode="edit" />
    </div>
  );
}
