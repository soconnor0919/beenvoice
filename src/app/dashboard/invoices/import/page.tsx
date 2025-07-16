import { Suspense } from "react";
import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { PageHeader } from "~/components/layout/page-header";
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  FileSpreadsheet,
  Eye,
  RefreshCw,
} from "lucide-react";

// Import Statistics Component
function ImportStats() {
  const stats = [
    {
      title: "Supported Formats",
      value: "CSV",
      icon: FileSpreadsheet,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      description: "Excel & Google Sheets exports",
    },
    {
      title: "Max File Size",
      value: "10MB",
      icon: Upload,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      description: "Up to 1000 invoices",
    },
    {
      title: "Processing Time",
      value: "< 1min",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      description: "Average processing speed",
    },
    {
      title: "Success Rate",
      value: "99.9%",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      description: "Import success rate",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="card-primary transition-shadow hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-xs">
                    {stat.description}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// File Upload Component
function FileUploadArea() {
  return (
    <Card className="card-primary">
      <CardHeader className="border-b">
        <CardTitle className="card-title-secondary">
          <Upload className="text-icon-emerald h-5 w-5" />
          Upload CSV File
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mx-auto max-w-xl">
          {/* Drop Zone */}
          <div className="bg-upload-zone">
            <div className="bg-brand-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Upload className="text-icon-emerald h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Drop your CSV file here
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse and select a file
            </p>
            <Button type="button" className="btn-brand-primary">
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
            <p className="text-muted-foreground mt-4 text-sm">
              Maximum file size: 10MB • Supported format: CSV
            </p>
          </div>

          {/* Upload Progress (hidden by default) */}
          <div className="mt-6 hidden">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-icon-emerald text-sm">75%</span>
            </div>
            <div className="bg-progress-track">
              <div
                className="bg-brand-gradient h-full transition-all duration-300"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// CSV Format Instructions
function FormatInstructions() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Required Format */}
      <Card className="card-primary">
        <CardHeader>
          <CardTitle className="card-title-info">
            <FileText className="text-icon-blue h-5 w-5" />
            Required CSV Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted-subtle rounded-lg p-4">
            <p className="text-secondary font-mono text-sm">
              client_name,client_email,invoice_number,issue_date,due_date,description,hours,rate,tax_rate
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Required Columns:</h4>
            <div className="grid gap-2">
              {[
                { field: "client_name", desc: "Full name of the client" },
                { field: "client_email", desc: "Client email address" },
                { field: "invoice_number", desc: "Unique invoice identifier" },
                { field: "issue_date", desc: "Date issued (YYYY-MM-DD)" },
                { field: "due_date", desc: "Payment due date (YYYY-MM-DD)" },
                { field: "description", desc: "Work description" },
                { field: "hours", desc: "Number of hours worked" },
                { field: "rate", desc: "Hourly rate (decimal)" },
              ].map((col) => (
                <div key={col.field} className="flex items-start gap-3">
                  <Badge className="badge-outline text-xs">{col.field}</Badge>
                  <span className="text-muted-foreground text-sm">
                    {col.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <h4 className="mb-2 font-semibold">Optional Columns:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="badge-secondary text-xs">tax_rate</Badge>
              <Badge className="badge-secondary text-xs">notes</Badge>
              <Badge className="badge-secondary text-xs">client_phone</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data & Download */}
      <Card className="card-primary">
        <CardHeader>
          <CardTitle className="card-title-secondary">
            <Download className="text-icon-green h-5 w-5" />
            Sample Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Download our sample CSV template to see the exact format required
            for importing invoices.
          </p>

          <div className="bg-green-subtle rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="text-icon-green mt-0.5 h-5 w-5" />
              <div>
                <p className="text-success text-sm font-medium">Pro Tip</p>
                <p className="text-success text-sm">
                  The template includes sample data and formatting examples to
                  help you get started quickly.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Download Sample CSV Template
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Eye className="mr-2 h-4 w-4" />
              View Template in Browser
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Sample Row:</h4>
            <div className="bg-muted-subtle rounded-lg p-3">
              <p className="text-muted font-mono text-xs break-all">
                &quot;Acme
                Corp&quot;,&quot;john@acme.com&quot;,&quot;INV-001&quot;,&quot;2024-01-15&quot;,&quot;2024-02-14&quot;,&quot;Web
                development
                work&quot;,&quot;40&quot;,&quot;75.00&quot;,&quot;8.5&quot;
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Important Notes Section
function ImportantNotes() {
  return (
    <Card className="card-primary border-l-4 border-l-amber-500">
      <CardHeader>
        <CardTitle className="card-title-warning">
          <AlertCircle className="text-icon-amber h-5 w-5" />
          Important Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold">Before Importing:</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Ensure all client emails are valid</li>
              <li>• Use YYYY-MM-DD format for dates</li>
              <li>• Invoice numbers must be unique</li>
              <li>• Rates should be in decimal format (e.g., 75.50)</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">What Happens:</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• New clients will be created automatically</li>
              <li>• Existing clients will be matched by email</li>
              <li>• Invoices will be created in &quot;draft&quot; status</li>
              <li>• You can review and edit before sending</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Import History Component
function ImportHistory() {
  const mockHistory = [
    {
      id: "1",
      filename: "january_invoices.csv",
      date: "2024-01-15",
      status: "completed",
      imported: 25,
      errors: 0,
    },
    {
      id: "2",
      filename: "december_invoices.csv",
      date: "2024-01-01",
      status: "completed",
      imported: 18,
      errors: 2,
    },
    {
      id: "3",
      filename: "november_invoices.csv",
      date: "2023-12-01",
      status: "completed",
      imported: 32,
      errors: 1,
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <Badge className="badge-success">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    }
    if (status === "processing") {
      return (
        <Badge className="badge-features">
          <RefreshCw className="mr-1 h-3 w-3" />
          Processing
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <AlertCircle className="mr-1 h-3 w-3" />
        Failed
      </Badge>
    );
  };

  return (
    <Card className="card-primary">
      <CardHeader>
        <CardTitle className="card-title-purple">
          <FileText className="text-icon-purple h-5 w-5" />
          Recent Imports
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="p-4 text-left text-sm font-medium">File</th>
                <th className="p-4 text-left text-sm font-medium">Date</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-right text-sm font-medium">Imported</th>
                <th className="p-4 text-right text-sm font-medium">Errors</th>
                <th className="p-4 text-center text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/20 border-b transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="icon-bg-purple-muted">
                        <FileSpreadsheet className="text-icon-purple h-4 w-4" />
                      </div>
                      <span className="font-medium">{item.filename}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">{getStatusBadge(item.status)}</td>
                  <td className="p-4 text-right font-medium">
                    {item.imported}
                  </td>
                  <td className="p-4 text-right">
                    {item.errors > 0 ? (
                      <span className="status-text-error">{item.errors}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mockHistory.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No import history yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function ImportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Import Invoices"
        description="Upload CSV files to create invoices in batch"
        variant="gradient"
      >
        <Link href="/dashboard/invoices">
          <Button variant="outline" size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Invoices
          </Button>
        </Link>
      </PageHeader>

      <HydrateClient>
        <Suspense
          fallback={
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Card key={i} className="card-primary">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="bg-muted mb-2 h-4 w-1/2 rounded"></div>
                      <div className="bg-muted mb-2 h-8 w-3/4 rounded"></div>
                      <div className="bg-muted h-3 w-1/3 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <ImportStats />
        </Suspense>

        <FileUploadArea />

        <FormatInstructions />

        <ImportantNotes />

        <ImportHistory />
      </HydrateClient>
    </div>
  );
}
