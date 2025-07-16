"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
} from "lucide-react";

export function ClientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const { data: clients, isLoading, refetch } = api.clients.getAll.useQuery();
  const deleteClient = api.clients.delete.useMutation({
    onSuccess: () => {
      toast.success("Client deleted successfully");
      void refetch();
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete client");
    },
  });

  const filteredClients =
    clients?.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) ?? [];

  const handleDelete = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient.mutate({ id: clientToDelete });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i: number) => (
          <Card key={i} className="card-primary">
            <CardHeader>
              <div className="h-4 animate-pulse rounded bg-gray-200" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <Card className="card-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-brand-gradient text-2xl font-bold">
            No Clients Yet
          </CardTitle>
          <CardDescription className="text-lg">
            Get started by adding your first client
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/dashboard/clients/new">
            <Button variant="brand" className="h-12 w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Client
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Label htmlFor="search" className="sr-only">
            Search clients
          </Label>
          <div className="relative">
            <Search className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-10"
            />
          </div>
        </div>
        <Link href="/dashboard/clients/new">
          <Button variant="brand" className="h-12 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card
            key={client.id}
            className="group card-primary transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="text-accent group-hover:text-icon-emerald font-semibold transition-colors">
                  {client.name}
                </span>
                <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link href={`/clients/${client.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/clients/${client.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                    className="hover:bg-error-subtle hover:text-icon-red h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.email && (
                <div className="text-secondary flex items-center text-sm">
                  <div className="bg-brand-muted mr-3 rounded p-1.5">
                    <Mail className="text-icon-emerald h-3 w-3" />
                  </div>
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="text-secondary flex items-center text-sm">
                  <div className="bg-brand-muted-blue mr-3 rounded p-1.5">
                    <Phone className="text-icon-blue h-3 w-3" />
                  </div>
                  {client.phone}
                </div>
              )}
              {(client.addressLine1 ?? client.city ?? client.state) && (
                <div className="text-secondary flex items-start text-sm">
                  <div className="bg-brand-muted-teal mt-0.5 mr-3 flex-shrink-0 rounded p-1.5">
                    <MapPin className="text-icon-teal h-3 w-3" />
                  </div>
                  <div className="min-w-0">
                    {client.addressLine1 && <div>{client.addressLine1}</div>}
                    {client.addressLine2 && <div>{client.addressLine2}</div>}
                    {(client.city ?? client.state ?? client.postalCode) && (
                      <div>
                        {[client.city, client.state, client.postalCode]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                    {client.country && <div>{client.country}</div>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="card-primary">
          <DialogHeader>
            <DialogTitle className="text-accent text-xl font-bold">
              Delete Client
            </DialogTitle>
            <DialogDescription className="text-secondary">
              Are you sure you want to delete this client? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-secondary"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
