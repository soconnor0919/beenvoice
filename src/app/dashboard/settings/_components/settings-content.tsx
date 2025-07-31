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
  FileText,
  Users,
  Building,
  Key,
  Eye,
  EyeOff,
  FileUp,
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
  const [importMethod, setImportMethod] = useState<"file" | "paste">("file");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const changePasswordMutation = api.settings.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: { message: string }) => {
      toast.error(`Failed to change password: ${error.message}`);
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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  const handleExportData = () => {
    void exportDataQuery.refetch();
  };

  // Type guard for backup data
  const isValidBackupData = (data: unknown): boolean => {
    if (typeof data !== "object" || data === null) return false;

    const obj = data as Record<string, unknown>;
    return !!(
      obj.exportDate &&
      obj.version &&
      obj.user &&
      obj.clients &&
      obj.businesses &&
      obj.invoices &&
      Array.isArray(obj.clients) &&
      Array.isArray(obj.businesses) &&
      Array.isArray(obj.invoices)
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Please select a JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData: unknown = JSON.parse(content);

        if (isValidBackupData(parsedData)) {
          // @ts-expect-error Server handles validation of backup data format
          importDataMutation.mutate(parsedData);
        } else {
          toast.error("Invalid backup file format");
        }
      } catch {
        toast.error("Invalid JSON format. Please check your backup file.");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleImportData = () => {
    try {
      const parsedData: unknown = JSON.parse(importData);

      if (isValidBackupData(parsedData)) {
        // @ts-expect-error Server handles validation of backup data format
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
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Businesses",
      value: dataStats?.businesses ?? 0,
      icon: Building,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      label: "Invoices",
      value: dataStats?.invoices ?? 0,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-accent",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile & Account Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Section */}
        <Card className="bg-card border-border border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <User className="text-primary h-5 w-5" />
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={session?.user?.email ?? ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-muted-foreground text-sm">
                  Email address cannot be changed
                </p>
              </div>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                variant="default"
              >
                {updateProfileMutation.isPending
                  ? "Updating..."
                  : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Data Overview */}
        <Card className="bg-card border-border border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Database className="text-primary h-5 w-5" />
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
                  <div
                    key={item.label}
                    className="bg-card flex items-center justify-between  border p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={` p-2 ${item.bgColor}`}>
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
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="bg-card border-border border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Key className="text-primary h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Change your password and manage account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              variant="default"
            >
              {changePasswordMutation.isPending
                ? "Changing Password..."
                : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-card border-border border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="text-icon-indigo h-5 w-5" />
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
                      Upload your backup JSON file or paste the contents below.
                      This will add the data to your existing account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Import Method Selector */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          importMethod === "file" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setImportMethod("file")}
                        className="flex-1"
                      >
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload File
                      </Button>
                      <Button
                        type="button"
                        variant={
                          importMethod === "paste" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setImportMethod("paste")}
                        className="flex-1"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Paste Content
                      </Button>
                    </div>

                    {/* File Upload Method */}
                    {importMethod === "file" && (
                      <div className="space-y-2">
                        <Label htmlFor="backup-file">Select Backup File</Label>
                        <Input
                          id="backup-file"
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          disabled={importDataMutation.isPending}
                        />
                        <p className="text-muted-foreground text-sm">
                          Select the JSON backup file you previously exported.
                        </p>
                      </div>
                    )}

                    {/* Manual Paste Method */}
                    {importMethod === "paste" && (
                      <div className="space-y-2">
                        <Label htmlFor="backup-content">Backup Content</Label>
                        <Textarea
                          id="backup-content"
                          placeholder="Paste your backup JSON data here..."
                          value={importData}
                          onChange={(e) => setImportData(e.target.value)}
                          rows={12}
                          className="font-mono text-sm"
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsImportDialogOpen(false);
                        setImportData("");
                        setImportMethod("file");
                      }}
                    >
                      Cancel
                    </Button>
                    {importMethod === "paste" && (
                      <Button
                        onClick={handleImportData}
                        disabled={
                          !importData.trim() || importDataMutation.isPending
                        }
                        variant="default"
                      >
                        {importDataMutation.isPending
                          ? "Importing..."
                          : "Import Data"}
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Backup Information */}
            <div className="border-border bg-muted/20  border p-4">
              <h4 className="font-medium">Backup Information</h4>
              <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                <li>• Regular backups protect your important business data</li>
                <li>• Backup files contain all data in secure JSON format</li>
                <li>
                  • Import adds to existing data without replacing anything
                </li>
                <li>• Upload JSON files directly or paste content manually</li>
                <li>• Store backup files in a secure, accessible location</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-border border border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="text-icon-red h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that permanently affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-destructive/10 border-destructive/20  border p-4">
              <h4 className="text-destructive font-medium">
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
                <Button variant="destructive" className="w-full">
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
                    <ul className="border-border bg-muted/50 list-inside list-disc space-y-1  border p-3 text-sm">
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
                    className="bg-destructive hover:bg-destructive/90"
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
