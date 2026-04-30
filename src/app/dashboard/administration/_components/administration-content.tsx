"use client";

import { Shield } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

export function AdministrationContent() {
  const {
    data: accounts = [],
    refetch,
    error,
  } = api.settings.listAccounts.useQuery();
  const updateAccountRoleMutation = api.settings.updateAccountRole.useMutation({
    onSuccess: () => {
      toast.success("Account role updated");
      void refetch();
    },
    onError: (mutationError: { message: string }) => {
      toast.error(`Failed to update role: ${mutationError.message}`);
    },
  });

  if (error) {
    return (
      <Card className="bg-card border-border border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="text-primary h-5 w-5" />
            Administration
          </CardTitle>
          <CardDescription>
            Administrative access is required for this page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Shield className="text-primary h-5 w-5" />
          Accounts
        </CardTitle>
        <CardDescription>
          Manage account access and roles without opening customer data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="border-border flex flex-col gap-3 border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{account.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {account.email}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Created {new Date(account.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Select
              value={account.role}
              onValueChange={(role) =>
                updateAccountRoleMutation.mutate({
                  userId: account.id,
                  role: role as "user" | "admin",
                })
              }
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
