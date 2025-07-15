"use client";

import { useState } from "react";
import * as React from "react";
import { useSession } from "next-auth/react";
import {
  Download,
  Upload,
  User,
  Database,
  AlertTriangle,
  Shield,
} from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { PageHeader } from "~/components/page-header";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [importData, setImportData] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Queries
  const { data: profile, refetch: refetchProfile } =
    api.settings.getProfile.useQuery();
  const { data: dataStats } = api.settings.getDataStats.useQuery();

  // Mutations
  const updateProfileMutation = api.settings.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Your profile has been successfully updated.");
      void refetchProfile();
    },
    onError: (error: { message: string }) => {
      toast.error(`Error updating profile: ${error.message}`);
    },
  });

  const exportDataQuery = api.settings.exportData.useQuery(undefined, {
    enabled: false,
  });

  // Handle export data success/error
  React.useEffect(() => {
    if (exportDataQuery.data && !exportDataQuery.isFetching) {
      // Create and download the backup file
      const blob = new Blob([JSON.stringify(exportDataQuery.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `beenvoice-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Your data backup has been downloaded.");
    }

    if (exportDataQuery.error) {
      toast.error(`Error exporting data: ${exportDataQuery.error.message}`);
    }
  }, [exportDataQuery.data, exportDataQuery.isFetching, exportDataQuery.error]);

  const importDataMutation = api.settings.importData.useMutation({
    onSuccess: (result) => {
      toast.success(
        `Data imported successfully! Imported ${result.imported.clients} clients, ${result.imported.businesses} businesses, and ${result.imported.invoices} invoices.`,
      );
      setImportData("");
      setIsImportDialogOpen(false);
      void refetchProfile();
    },
    onError: (error: { message: string }) => {
      toast.error(`Error importing data: ${error.message}`);
    },
  });

  const deleteDataMutation = api.settings.deleteAllData.useMutation({
    onSuccess: () => {
      toast.success("Your account data has been permanently deleted.");
      setDeleteConfirmText("");
    },
    onError: (error: { message: string }) => {
      toast.error(`Error deleting data: ${error.message}`);
    },
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    updateProfileMutation.mutate({ name: name.trim() });
  };

  const handleExportData = () => {
    void exportDataQuery.refetch();
  };

  // Type guard for backup data
  const isValidBackupData = (
    data: unknown,
  ): data is {
    exportDate: string;
    version: string;
    user: { name?: string; email: string };
    clients: Array<{
      name: string;
      email?: string;
      phone?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    }>;
    businesses: Array<{
      name: string;
      email?: string;
      phone?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      website?: string;
      taxId?: string;
      logoUrl?: string;
      isDefault?: boolean;
    }>;
    invoices: Array<{
      invoiceNumber: string;
      businessName?: string;
      clientName: string;
      issueDate: Date;
      dueDate: Date;
      status?: string;
      totalAmount?: number;
      taxRate?: number;
      notes?: string;
      items: Array<{
        date: Date;
        description: string;
        hours: number;
        rate: number;
        amount: number;
        position?: number;
      }>;
    }>;
  } => {
    return !!(
      data &&
      typeof data === "object" &&
      data !== null &&
      "exportDate" in data &&
      "version" in data &&
      "user" in data &&
      "clients" in data &&
      "businesses" in data &&
      "invoices" in data
    );
  };

  const handleImportData = () => {
    try {
      const parsedData: unknown = JSON.parse(importData);

      if (isValidBackupData(parsedData)) {
        importDataMutation.mutate(parsedData);
      } else {
        toast.error("Invalid backup file format.");
      }
    } catch {
      toast.error("Invalid JSON. Please check your backup file format.");
    }
  };

  const handleDeleteAllData = () => {
    if (deleteConfirmText !== "DELETE ALL DATA") {
      toast.error("Please type 'DELETE ALL DATA' to confirm.");
      return;
    }
    deleteDataMutation.mutate({ confirmText: deleteConfirmText });
  };

  // Set initial name value when profile loads
  if (profile && !name && profile.name) {
    setName(profile.name);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and data preferences"
        variant="large-gradient"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={session?.user?.email ?? ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-muted-foreground text-sm">
                  Email cannot be changed
                </p>
              </div>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {updateProfileMutation.isPending
                  ? "Updating..."
                  : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Data Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600" />
              Your Data
            </CardTitle>
            <CardDescription>Overview of your account data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {dataStats?.clients ?? 0}
                </div>
                <div className="text-muted-foreground text-sm">Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {dataStats?.businesses ?? 0}
                </div>
                <div className="text-muted-foreground text-sm">Businesses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {dataStats?.invoices ?? 0}
                </div>
                <div className="text-muted-foreground text-sm">Invoices</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup & Restore Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Backup & Restore
          </CardTitle>
          <CardDescription>
            Export your data for backup or import from a previous backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Export Data */}
            <div className="space-y-3">
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-muted-foreground text-sm">
                Download all your clients, businesses, and invoices as a JSON
                backup file.
              </p>
              <Button
                onClick={handleExportData}
                disabled={exportDataQuery.isFetching}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {exportDataQuery.isFetching ? "Exporting..." : "Export Data"}
              </Button>
            </div>

            {/* Import Data */}
            <div className="space-y-3">
              <h3 className="font-semibold">Import Data</h3>
              <p className="text-muted-foreground text-sm">
                Restore your data from a previous backup file.
              </p>
              <Dialog
                open={isImportDialogOpen}
                onOpenChange={setIsImportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Import Backup Data</DialogTitle>
                    <DialogDescription>
                      Paste the contents of your backup JSON file below. This
                      will add the data to your existing account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Paste your backup JSON data here..."
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsImportDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleImportData}
                      disabled={
                        !importData.trim() || importDataMutation.isPending
                      }
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {importDataMutation.isPending
                        ? "Importing..."
                        : "Import Data"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900">Backup Tips</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• Regular backups help protect your data</li>
              <li>
                • Backup files contain all your business data in JSON format
              </li>
              <li>
                • Import will add data to your existing account (not replace)
              </li>
              <li>• Keep your backup files in a secure location</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions for your account data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 className="font-medium text-red-900">Delete All Data</h4>
              <p className="mt-1 text-sm text-red-800">
                This will permanently delete all your clients, businesses,
                invoices, and related data. This action cannot be undone.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete All Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      This action cannot be undone. This will permanently delete
                      all your:
                    </p>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>Clients and their information</li>
                      <li>Business profiles</li>
                      <li>Invoices and invoice items</li>
                      <li>All related data</li>
                    </ul>
                    <p className="font-medium">
                      Type{" "}
                      <span className="bg-muted rounded px-1 font-mono">
                        DELETE ALL DATA
                      </span>{" "}
                      to confirm:
                    </p>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type: DELETE ALL DATA"
                      className="font-mono"
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllData}
                    disabled={
                      deleteConfirmText !== "DELETE ALL DATA" ||
                      deleteDataMutation.isPending
                    }
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleteDataMutation.isPending
                      ? "Deleting..."
                      : "Delete All Data"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
