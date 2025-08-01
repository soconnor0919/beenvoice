"use client";

import {
  AlertCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DatePicker } from "~/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FileUpload } from "~/components/forms/file-upload";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { api } from "~/trpc/react";

interface CSVRow {
  DATE: string;
  DESCRIPTION: string;
  HOURS: number;
  RATE: number;
  AMOUNT: number;
}

interface ParsedItem {
  date: Date;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

interface FileData {
  file: File;
  parsedItems: ParsedItem[];
  previewData: CSVRow[];
  invoiceNumber: string;
  clientId: string;
  issueDate: Date | null;
  dueDate: Date | null;
  status: "pending" | "ready" | "error";
  errors: string[];
  hasDateError: boolean;
}

export function CSVImportPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [globalClientId, setGlobalClientId] = useState("");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressCount, setProgressCount] = useState(0);

  // Fetch clients for dropdown
  const { data: clients, isLoading: loadingClients } =
    api.clients.getAll.useQuery();

  const createInvoice = api.invoices.create.useMutation({
    onSuccess: () => {
      toast.success("Invoice created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote inside quoted field
          current += '"';
          i += 2; // Skip both quotes
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === "," && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = "";
        i++;
      } else {
        // Regular character
        current += char;
        i++;
      }
    }

    // Add the last field
    result.push(current.trim());
    return result;
  };

  const parseCSV = (csvText: string): CSVRow[] => {
    const lines = csvText.split("\n");
    const headers = parseCSVLine(lines[0] ?? "");

    // Validate headers
    const requiredHeaders = ["DATE", "DESCRIPTION", "HOURS", "RATE", "AMOUNT"];
    const missingHeaders = requiredHeaders.filter((h) => !headers?.includes(h));

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
    }

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = parseCSVLine(line);
        return {
          DATE: values[0] ?? "",
          DESCRIPTION: values[1] ?? "",
          HOURS: parseFloat(values[2] ?? "0") || 0,
          RATE: parseFloat(values[3] ?? "0") || 0,
          AMOUNT: parseFloat(values[4] ?? "0") || 0,
        };
      })
      .filter((row) => row.DESCRIPTION && row.HOURS > 0 && row.RATE > 0);
  };

  const parseDate = (dateStr: string): Date => {
    // Handle m/dd/yy format
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0] ?? "1") - 1; // 0-based month
      const day = parseInt(parts[1] ?? "1");
      const year = parseInt(parts[2] ?? "2000") + 2000; // Assume 20xx
      return new Date(year, month, day);
    }
    // Fallback to standard date parsing
    return new Date(dateStr);
  };

  const handleFileSelect = async (selectedFiles: File[]) => {
    for (const file of selectedFiles) {
      const errors: string[] = [];
      let hasDateError = false;
      let issueDate: Date | null = null;
      let dueDate: Date | null = null;

      // Check filename format
      const filenameMatch = /^(\d{4}-\d{2}-\d{2})\.csv$/.exec(file.name);
      if (!filenameMatch) {
        errors.push("Filename must be in YYYY-MM-DD.csv format");
        hasDateError = true;
      } else {
        const filenameDate = filenameMatch[1] ?? "";
        issueDate = new Date(filenameDate);
        if (isNaN(issueDate.getTime())) {
          errors.push("Invalid date in filename");
          hasDateError = true;
        } else {
          dueDate = new Date(issueDate);
          dueDate.setDate(dueDate.getDate() + 30);
        }
      }

      try {
        const text = await file.text();
        const csvData = parseCSV(text);

        // Parse items for invoice creation
        const items = csvData.map((row) => ({
          date: parseDate(row.DATE),
          description: row.DESCRIPTION,
          hours: row.HOURS,
          rate: row.RATE,
          amount: row.HOURS * row.RATE, // Calculate amount ourselves
        }));

        const fileData: FileData = {
          file,
          parsedItems: items,
          previewData: csvData,
          invoiceNumber: issueDate
            ? `INV-${issueDate.toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString().slice(-6)}`
            : `INV-${Date.now()}`,
          clientId: globalClientId, // Use global client if set
          issueDate,
          dueDate,
          status: errors.length > 0 ? "error" : "pending",
          errors,
          hasDateError,
        };

        setFiles((prev) => [...prev, fileData]);

        if (errors.length > 0) {
          toast.error(
            `${file.name} has ${errors.length} error${errors.length > 1 ? "s" : ""}`,
          );
        } else {
          toast.success(`Parsed ${items.length} items from ${file.name}`);
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        const fileData: FileData = {
          file,
          parsedItems: [],
          previewData: [],
          invoiceNumber: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          clientId: globalClientId,
          issueDate: null,
          dueDate: null,
          status: "error",
          errors: [`Error parsing CSV: ${errorMessage}`],
          hasDateError: true,
        };
        setFiles((prev) => [...prev, fileData]);
        toast.error(`Error parsing ${file.name}: ${errorMessage}`);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Apply global client to all files that don't have a client selected
  const applyGlobalClient = (clientId: string) => {
    setFiles((prev) =>
      prev.map((file) => ({
        ...file,
        clientId: file.clientId || clientId, // Only apply if no client is already selected
      })),
    );
  };

  const updateFileData = (index: number, updates: Partial<FileData>) => {
    setFiles((prev) =>
      prev.map((file, i) => {
        if (i !== index) return file;

        const updatedFile = { ...file, ...updates };

        // Recalculate errors if issue date or due date was updated
        if (updates.issueDate !== undefined || updates.dueDate !== undefined) {
          const newErrors = [...updatedFile.errors];

          // Remove filename format error if a valid issue date is now set
          if (
            updatedFile.issueDate &&
            newErrors.includes("Filename must be in YYYY-MM-DD.csv format")
          ) {
            const errorIndex = newErrors.indexOf(
              "Filename must be in YYYY-MM-DD.csv format",
            );
            if (errorIndex > -1) {
              newErrors.splice(errorIndex, 1);
            }
          }

          // Remove invalid date error if a valid issue date is now set
          if (
            updatedFile.issueDate &&
            newErrors.includes("Invalid date in filename")
          ) {
            const errorIndex = newErrors.indexOf("Invalid date in filename");
            if (errorIndex > -1) {
              newErrors.splice(errorIndex, 1);
            }
          }

          updatedFile.errors = newErrors;
          updatedFile.status = newErrors.length > 0 ? "error" : "pending";
          updatedFile.hasDateError = newErrors.some(
            (error) =>
              error.includes("Filename") || error.includes("Invalid date"),
          );
        }

        return updatedFile;
      }),
    );
  };

  const openPreview = (index: number) => {
    setSelectedFileIndex(index);
    setPreviewModalOpen(true);
  };

  const validateFiles = () => {
    const errors: string[] = [];

    files.forEach((fileData) => {
      // Check for existing errors
      if (fileData.errors.length > 0) {
        errors.push(`${fileData.file.name}: ${fileData.errors.join(", ")}`);
      }

      if (!fileData.clientId && !globalClientId) {
        errors.push(`${fileData.file.name}: Client not selected`);
      }
      if (fileData.parsedItems.length === 0) {
        errors.push(`${fileData.file.name}: No valid items found`);
      }
      if (!fileData.issueDate) {
        errors.push(`${fileData.file.name}: Issue date required`);
      }
      if (!fileData.dueDate) {
        errors.push(`${fileData.file.name}: Due date required`);
      }
    });

    return errors;
  };

  const processBatch = async () => {
    const errors = validateFiles();
    if (errors.length > 0) {
      toast.error(`Please fix the following issues:\n${errors.join("\n")}`);
      return;
    }

    setIsProcessing(true);
    setProgressCount(0);
    let successCount = 0;
    let errorCount = 0;

    for (const fileData of files) {
      try {
        // Validate required fields before sending
        const clientId = fileData.clientId || globalClientId;
        if (!clientId) {
          throw new Error(`No client selected for ${fileData.file.name}`);
        }
        if (!fileData.issueDate) {
          throw new Error(`No issue date for ${fileData.file.name}`);
        }
        if (!fileData.dueDate) {
          throw new Error(`No due date for ${fileData.file.name}`);
        }
        if (!fileData.invoiceNumber) {
          throw new Error(`No invoice number for ${fileData.file.name}`);
        }
        if (!fileData.parsedItems || fileData.parsedItems.length === 0) {
          throw new Error(`No items found for ${fileData.file.name}`);
        }

        const invoiceData = {
          invoiceNumber: fileData.invoiceNumber,
          clientId: clientId,
          issueDate: fileData.issueDate,
          dueDate: fileData.dueDate,
          status: "draft" as const,
          notes: `Imported from CSV: ${fileData.file.name}`,
          items: fileData.parsedItems.map((item) => ({
            date: item.date,
            description: item.description,
            hours: item.hours,
            rate: item.rate,
            amount: item.amount,
          })),
        };

        console.log("Creating invoice with data:", invoiceData);
        await createInvoice.mutateAsync(invoiceData);
        console.log("Invoice created successfully");
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(
          `Failed to create invoice for ${fileData.file.name}:`,
          error,
        );
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(
          `Failed to create invoice for ${fileData.file.name}: ${errorMessage}`,
        );
      }
      setProgressCount((prev) => prev + 1);
    }

    setIsProcessing(false);

    if (successCount > 0) {
      toast.success(
        `Successfully created ${successCount} invoice${successCount > 1 ? "s" : ""}`,
      );
    }
    if (errorCount > 0) {
      toast.error(
        `Failed to create ${errorCount} invoice${errorCount > 1 ? "s" : ""}`,
      );
    }

    if (successCount > 0) {
      setFiles([]);
    }
  };

  const totalFiles = files.length;
  const readyFiles = files.filter(
    (f) =>
      f.errors.length === 0 &&
      (f.clientId || globalClientId) &&
      f.issueDate &&
      f.dueDate,
  ).length;
  const totalItems = files.reduce((sum, f) => sum + f.parsedItems.length, 0);
  const totalAmount = files.reduce(
    (sum, f) =>
      sum + f.parsedItems.reduce((itemSum, item) => itemSum + item.amount, 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Global Client Selection */}
      <Card className="bg-card border-border border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Users className="text-primary h-5 w-5" />
            Default Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="global-client" className="text-sm font-medium">
              Select Default Client (Optional)
            </Label>
            <select
              id="global-client"
              value={globalClientId}
              onChange={(e) => {
                const newClientId = e.target.value;
                setGlobalClientId(newClientId);
                if (newClientId) {
                  applyGlobalClient(newClientId);
                }
              }}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-12 w-full  border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loadingClients}
            >
              <option value="">No default client (select individually)</option>
              {clients?.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <p className="text-muted-foreground text-xs">
              This client will be automatically selected for all uploaded files.
              You can still change individual files below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card className="bg-card border-border border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Upload className="text-primary h-5 w-5" />
            Upload CSV Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            onFilesSelected={handleFileSelect}
            accept={{ "text/csv": [".csv"] }}
            maxFiles={50}
            maxSize={5 * 1024 * 1024} // 5MB
            placeholder="Drag & drop CSV files here, or click to select"
            description="Files must be named YYYY-MM-DD.csv (e.g., 2024-01-15.csv). Up to 50 files can be uploaded at once."
          />

          {/* Summary Card */}
          {totalFiles > 0 && (
            <Card className="bg-card border-border border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="text-primary h-5 w-5" />
                  Import Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 grid grid-cols-2 gap-4  p-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {totalFiles}
                    </div>
                    <div className="text-muted-foreground text-sm">Files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {totalItems}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Total Items
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {totalAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Total Amount
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {readyFiles}/{totalFiles}
                    </div>
                    <div className="text-muted-foreground text-sm">Ready</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="bg-card border-border border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              Uploaded Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((fileData, index) => (
                <div
                  key={index}
                  className="border-border bg-card  border p-4"
                >
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-primary h-5 w-5" />
                      <div>
                        <h3 className="text-foreground truncate font-medium">
                          {fileData.file.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {fileData.parsedItems.length} items •{" "}
                          {fileData.parsedItems
                            .reduce((sum, item) => sum + item.hours, 0)
                            .toFixed(1)}{" "}
                          hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPreview(index)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs font-medium">
                        Invoice Number
                      </Label>
                      <Input
                        value={fileData.invoiceNumber}
                        className="h-9 text-sm"
                        placeholder="Auto-generated"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs font-medium">
                        Client
                      </Label>
                      <select
                        value={fileData.clientId}
                        onChange={(e) =>
                          updateFileData(index, { clientId: e.target.value })
                        }
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full  border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loadingClients}
                      >
                        <option value="">Select Client</option>
                        {clients?.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs font-medium">
                        Issue Date
                      </Label>
                      <DatePicker
                        date={fileData.issueDate ?? undefined}
                        onDateChange={(date) =>
                          updateFileData(index, { issueDate: date ?? null })
                        }
                        placeholder="Select issue date"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs font-medium">
                        Due Date
                      </Label>
                      <DatePicker
                        date={fileData.dueDate ?? undefined}
                        onDateChange={(date) =>
                          updateFileData(index, { dueDate: date ?? null })
                        }
                        placeholder="Select due date"
                        className="h-9"
                      />
                    </div>
                  </div>

                  {/* Error Display */}
                  {fileData.errors.length > 0 && (
                    <div className="border-destructive/20 bg-destructive/10 mt-4  border p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <AlertCircle className="text-destructive h-4 w-4" />
                        <span className="text-destructive text-sm font-medium">
                          Issues Found
                        </span>
                      </div>
                      <ul className="text-destructive space-y-1 text-sm">
                        {fileData.errors.map((error, errorIndex) => (
                          <li
                            key={errorIndex}
                            className="flex items-start gap-2"
                          >
                            <span className="text-destructive">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">
                      Total:{" "}
                      {fileData.parsedItems
                        .reduce((sum, item) => sum + item.amount, 0)
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileData.errors.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {fileData.errors.length} Error
                          {fileData.errors.length !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          fileData.errors.length > 0
                            ? "destructive"
                            : (fileData.clientId || globalClientId) &&
                                fileData.issueDate &&
                                fileData.dueDate
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {fileData.errors.length > 0
                          ? "Has Errors"
                          : (fileData.clientId || globalClientId) &&
                              fileData.issueDate &&
                              fileData.dueDate
                            ? "Ready"
                            : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Actions */}
      {files.length > 0 && (
        <Card className="bg-card border-border border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <DollarSign className="text-primary h-5 w-5" />
              Create Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {isProcessing && (
                <div className="flex w-full flex-col gap-2">
                  <span className="text-muted-foreground text-sm">
                    Creating invoices... ({progressCount}/{totalFiles})
                  </span>
                  <Progress
                    value={Math.round((progressCount / totalFiles) * 100)}
                    className="h-2"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  {readyFiles} of {totalFiles} files ready for import
                </div>
                <Button
                  onClick={processBatch}
                  disabled={readyFiles === 0 || isProcessing}
                  variant="default"
                >
                  {isProcessing
                    ? "Processing..."
                    : `Import ${readyFiles} Invoice${readyFiles !== 1 ? "s" : ""}`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="bg-card border-border border flex max-h-[90vh] max-w-4xl flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-foreground flex items-center gap-2 text-xl font-bold">
              <FileText className="text-primary h-5 w-5" />
              {selectedFileIndex !== null &&
                files[selectedFileIndex]?.file.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Preview of parsed CSV data
            </DialogDescription>
          </DialogHeader>

          {selectedFileIndex !== null && files[selectedFileIndex] && (
            <div className="flex min-h-0 flex-1 flex-col space-y-4">
              <div className="grid flex-shrink-0 grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    {files[selectedFileIndex].parsedItems.length} items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    {files[selectedFileIndex].parsedItems
                      .reduce((sum, item) => sum + item.hours, 0)
                      .toFixed(1)}{" "}
                    total hours
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-primary h-4 w-4" />
                  <span className="text-muted-foreground text-sm font-medium">
                    {files[selectedFileIndex].parsedItems
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                  </span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                <div className="p-0">
                  <div className="max-h-96 overflow-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-muted-foreground p-2 text-left font-medium">
                            Date
                          </th>
                          <th className="text-muted-foreground p-2 text-left font-medium">
                            Description
                          </th>
                          <th className="text-muted-foreground p-2 text-right font-medium whitespace-nowrap">
                            Hours
                          </th>
                          <th className="text-muted-foreground p-2 text-right font-medium whitespace-nowrap">
                            Rate
                          </th>
                          <th className="text-muted-foreground p-2 text-right font-medium whitespace-nowrap">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {files[selectedFileIndex].parsedItems.map(
                          (item, index) => (
                            <tr key={index} className="border-border border-b">
                              <td className="text-foreground p-2 whitespace-nowrap">
                                {item.date.toLocaleDateString()}
                              </td>
                              <td className="text-foreground max-w-xs truncate p-2">
                                {item.description}
                              </td>
                              <td className="text-foreground p-2 text-right whitespace-nowrap">
                                {item.hours}
                              </td>
                              <td className="text-foreground p-2 text-right whitespace-nowrap">
                                {item.rate.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </td>
                              <td className="text-foreground p-2 text-right font-medium whitespace-nowrap">
                                {item.amount.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setPreviewModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
