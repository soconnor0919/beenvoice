"use client";

import { useParams } from "next/navigation";
import { BusinessForm } from "~/components/forms/business-form";

export default function EditBusinessPage() {
  const params = useParams();
  const businessId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  if (!businessId) return null;

  return <BusinessForm businessId={businessId} mode="edit" />;
}
