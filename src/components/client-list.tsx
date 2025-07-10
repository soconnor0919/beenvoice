"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Edit, Trash2, Eye, Plus, Search } from "lucide-react";

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

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        {[...Array(3)].map((_, i: number) => (
          <Card key={i} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            No Clients Yet
          </CardTitle>
          <CardDescription className="text-lg">
            Get started by adding your first client
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/dashboard/clients/new">
            <Button 
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 relative">
          <Label htmlFor="search" className="sr-only">Search clients</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>
        <Link href="/dashboard/clients/new">
          <Button 
            className="w-full sm:w-auto h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {client.name}
                </span>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/clients/${client.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-emerald-100">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/clients/${client.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-emerald-100">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-1.5 bg-emerald-100 rounded mr-3">
                    <Mail className="h-3 w-3 text-emerald-600" />
                  </div>
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-1.5 bg-blue-100 rounded mr-3">
                    <Phone className="h-3 w-3 text-blue-600" />
                  </div>
                  {client.phone}
                </div>
              )}
              {(client.addressLine1 ?? client.city ?? client.state) && (
                <div className="flex items-start text-sm text-gray-600">
                  <div className="p-1.5 bg-teal-100 rounded mr-3 mt-0.5 flex-shrink-0">
                    <MapPin className="h-3 w-3 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    {client.addressLine1 && <div>{client.addressLine1}</div>}
                    {client.addressLine2 && <div>{client.addressLine2}</div>}
                    {(client.city ?? client.state ?? client.postalCode) && (
                      <div>
                        {[client.city, client.state, client.postalCode].filter(Boolean).join(", ")}
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
        <DialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Delete Client</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
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