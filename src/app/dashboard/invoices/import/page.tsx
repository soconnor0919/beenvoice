import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { CSVImportPage } from "~/components/csv-import-page";
import { PageHeader } from "~/components/layout/page-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HydrateClient } from "~/trpc/server";

// File Upload Instructions Component
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
              DATE,DESCRIPTION,HOURS,RATE,AMOUNT
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Required Columns:</h4>
            <div className="grid gap-2">
              {[
                { field: "DATE", desc: "Date of work (M/DD/YY format)" },
                { field: "DESCRIPTION", desc: "Description of work performed" },
                { field: "HOURS", desc: "Number of hours worked" },
                { field: "RATE", desc: "Hourly rate (decimal)" },
                {
                  field: "AMOUNT",
                  desc: "Total amount (calculated from hours × rate)",
                },
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
            <h4 className="mb-2 font-semibold">File Naming:</h4>
            <p className="text-muted-foreground text-sm">
              Name your CSV files in{" "}
              <code className="bg-muted rounded px-1 text-xs">
                YYYY-MM-DD.csv
              </code>{" "}
              format for automatic date detection.
            </p>
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
            for importing time entries.
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

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Sample Row:</h4>
            <div className="bg-muted-subtle rounded-lg p-3">
              <p className="text-muted font-mono text-xs break-all">
                1/15/24,&quot;Web development work&quot;,8,75.00,600.00
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Sample Filename:</h4>
            <div className="bg-muted-subtle rounded-lg p-3">
              <p className="text-muted font-mono text-xs">2024-01-15.csv</p>
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
              <li>• Use M/DD/YY format for dates (e.g., 1/15/24)</li>
              <li>• Ensure rates are in decimal format (e.g., 75.50)</li>
              <li>• File names should follow YYYY-MM-DD.csv format</li>
              <li>• Select a client before importing</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">What Happens:</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Each CSV file creates one invoice</li>
              <li>• Invoice dates are derived from filename</li>
              <li>• Invoices are created in &quot;draft&quot; status</li>
              <li>• You can review and edit before sending</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// File Format Help Section
function FileFormatHelp() {
  return (
    <Card className="card-primary">
      <CardHeader>
        <CardTitle className="card-title-info">
          <FileSpreadsheet className="text-icon-blue h-5 w-5" />
          Supported File Formats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 text-center">
            <div className="mx-auto w-fit rounded-full bg-blue-50 p-3 dark:bg-blue-900/20">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold">CSV Files</h4>
            <p className="text-muted-foreground text-sm">
              Comma-separated values from Excel, Google Sheets, or any CSV
              editor
            </p>
          </div>
          <div className="space-y-2 text-center">
            <div className="mx-auto w-fit rounded-full bg-green-50 p-3 dark:bg-green-900/20">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold">Max Size</h4>
            <p className="text-muted-foreground text-sm">
              Up to 10MB per file with no limit on number of rows
            </p>
          </div>
          <div className="space-y-2 text-center">
            <div className="mx-auto w-fit rounded-full bg-purple-50 p-3 dark:bg-purple-900/20">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold">Validation</h4>
            <p className="text-muted-foreground text-sm">
              Real-time validation with clear error messages and feedback
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ImportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Import Time Entries"
        description="Upload CSV files to create invoices from your time tracking data"
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
        {/* Main CSV Import Component */}
        <CSVImportPage />

        {/* File Format Help */}
        <FileFormatHelp />

        {/* Format Instructions */}
        <FormatInstructions />

        {/* Important Notes */}
        <ImportantNotes />
      </HydrateClient>
    </div>
  );
}
