"use client";

import { BusinessForm } from "~/components/business-form";
import { useParams } from "next/navigation";

export default function EditBusinessPage() {
  const params = useParams();
  const businessId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  if (!businessId) return null;
  return <BusinessForm businessId={businessId} mode="edit" />;
} 