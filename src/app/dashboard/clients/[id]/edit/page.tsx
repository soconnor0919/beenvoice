"use client";

import { useParams } from "next/navigation";
import { ClientForm } from "~/components/forms/client-form";

export default function EditClientPage() {
  const params = useParams();
  const clientId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  if (!clientId) return null;

  return <ClientForm clientId={clientId} mode="edit" />;
}
