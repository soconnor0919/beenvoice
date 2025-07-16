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
  Settings,
  FileText,
  Users,
  Building,
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
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
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

export function SettingsContent() {
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
      toast.success("Profile updated successfully");
      void refetchProfile();
    },
    onError: (error: { message: string }) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const exportDataQuery = api.settings.exportData.useQuery(undefined, {
    enabled: false,
  });

  // Handle export data success/error
  React.useEffect(() => {
    if (exportDataQuery.data && !exportDataQuery.isFetching) {
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

      toast.success("Data backup downloaded successfully");
    }

    if (exportDataQuery.error) {
      toast.error(`Export failed: ${exportDataQuery.error.message}`);
    }
  }, [exportDataQuery.data, exportDataQuery.isFetching, exportDataQuery.error]);

  const importDataMutation = api.settings.importData.useMutation({
    onSuccess: (result) => {
      toast.success(
        `Data imported successfully! Added ${result.imported.clients} clients, ${result.imported.businesses} businesses, and ${result.imported.invoices} invoices.`,
      );
      setImportData("");
      setIsImportDialogOpen(false);
      void refetchProfile();
    },
    onError: (error: { message: string }) => {
      toast.error(`Import failed: ${error.message}`);
    },
  });

  const deleteDataMutation = api.settings.deleteAllData.useMutation({
    onSuccess: () => {
      toast.success("All data has been permanently deleted");
      setDeleteConfirmText("");
    },
    onError: (error: { message: string }) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
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
        toast.error("Invalid backup file format");
      }
    } catch {
      toast.error("Invalid JSON format. Please check your backup file.");
    }
  };

  const handleDeleteAllData = () => {
    if (deleteConfirmText !== "delete all my data") {
      toast.error("Please type 'delete all my data' to confirm");
      return;
    }
    deleteDataMutation.mutate({ confirmText: deleteConfirmText });
  };

  // Set initial name value when profile loads
  React.useEffect(() => {
    if (profile?.name && !name) {
      setName(profile.name);
    }
  }, [profile?.name, name]);

  const dataStatItems = [
    {
      label: "Clients",
      value: dataStats?.clients ?? 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Businesses",
      value: dataStats?.businesses ?? 0,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Invoices",
      value: dataStats?.invoices ?? 0,
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile & Account Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Section */}
        <Card className="card-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="icon-bg-emerald">
                <User className="text-icon-emerald h-5 w-5" />
              </div>
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border-0 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={session?.user?.email ?? ""}
                  disabled
                  className="bg-muted border-0 shadow-sm"
                />
                <p className="text-muted-foreground text-sm">
                  Email address cannot be changed
                </p>
              </div>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="btn-brand-primary"
              >
                {updateProfileMutation.isPending
                  ? "Updating..."
                  : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Data Overview */}
        <Card className="card-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="icon-bg-info">
                <Database className="text-icon-blue h-5 w-5" />
              </div>
              Account Data
            </CardTitle>
            <CardDescription>
              Overview of your stored information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataStatItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="card-secondary">
                    <CardContent className="py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${item.bgColor}`}>
                            <Icon className={`h-4 w-4 ${item.color}`} />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-lg font-semibold"
                        >
                          {item.value}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card className="card-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-indigo-subtle rounded-lg p-2">
              <Shield className="text-icon-indigo h-5 w-5" />
            </div>
            Data Management
          </CardTitle>
          <CardDescription>
            Backup, restore, or manage your account data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button
                onClick={handleExportData}
                disabled={exportDataQuery.isFetching}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                {exportDataQuery.isFetching ? "Exporting..." : "Export Backup"}
              </Button>

              <Dialog
                open={isImportDialogOpen}
                onOpenChange={setIsImportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Backup
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
                      rows={12}
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
                      className="btn-brand-primary"
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

          {/* Backup Information */}
          <div className="mt-6 rounded-lg border p-4">
            <h4 className="font-medium">Backup Information</h4>
            <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
              <li>• Regular backups protect your important business data</li>
              <li>• Backup files contain all data in secure JSON format</li>
              <li>• Import adds to existing data without replacing anything</li>
              <li>• Store backup files in a secure, accessible location</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="card-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="icon-bg-error">
              <AlertTriangle className="text-icon-red h-5 w-5" />
            </div>
            Data Management
          </CardTitle>
          <CardDescription>
            Manage your account data with caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-red-600">
                Delete All Account Data
              </h4>
              <p className="text-muted-foreground mt-2 text-sm">
                This will permanently delete all your clients, businesses,
                invoices, and related data. This action cannot be undone and
                your data cannot be recovered.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-100">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4">
                    <div>
                      This action cannot be undone. This will permanently delete
                      all your:
                    </div>
                    <ul className="list-inside list-disc space-y-1 rounded-lg border p-3 text-sm">
                      <li>Client information and contact details</li>
                      <li>Business profiles and settings</li>
                      <li>Invoices and invoice line items</li>
                      <li>All related data and records</li>
                    </ul>
                    <div className="space-y-2">
                      <div className="font-medium">
                        Type{" "}
                        <span className="bg-muted rounded px-2 py-1 font-mono text-sm">
                          delete all my data
                        </span>{" "}
                        to confirm:
                      </div>
                      <Input
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type delete all my data"
                        className="font-mono"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllData}
                    disabled={
                      deleteConfirmText !== "delete all my data" ||
                      deleteDataMutation.isPending
                    }
                    className="btn-danger"
                  >
                    {deleteDataMutation.isPending
                      ? "Deleting..."
                      : "Delete Forever"}
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
