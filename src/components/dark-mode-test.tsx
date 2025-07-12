"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import {
  Sun,
  Moon,
  Palette,
  Check,
  X,
  Info,
  AlertCircle,
  Settings,
  User,
  Mail
} from "lucide-react";

export function DarkModeTest() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Dark Mode Test Suite
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Testing media query-based dark mode implementation
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Moon className="h-4 w-4" />
            <span>Dark Mode (Auto)</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Color Test Card */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Text Colors:</p>
              <div className="text-gray-900 dark:text-white">Primary Text</div>
              <div className="text-gray-700 dark:text-gray-300">Secondary Text</div>
              <div className="text-gray-500 dark:text-gray-400">Muted Text</div>
              <div className="text-green-600 dark:text-green-400">Success Text</div>
              <div className="text-red-600 dark:text-red-400">Error Text</div>
            </div>
          </CardContent>
        </Card>

        {/* Button Test Card */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Default</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="destructive" size="sm">Destructive</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements Card */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-input">Test Input</Label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="test-input"
                  placeholder="Enter text here..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-select">Test Select</Label>
              <select
                id="test-select"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              >
                <option value="">Select an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Status Badges Card */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Success Status</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">Error Status</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Info Status</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">Warning Status</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Test Card */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Background Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">Light Background</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">Medium Background</p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">Card Background</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Icon Test Card */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Icon Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-1">
                <User className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Default</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Success</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Error</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Info</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode Method:</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Media Query (@media (prefers-color-scheme: dark))</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tailwind Config:</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">darkMode: "media"</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Variables:</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">oklch() color space</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-blue-200 dark:border-blue-800 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
          <p>• Change your system theme between light and dark to test automatic switching</p>
          <p>• All UI elements should adapt colors automatically</p>
          <p>• Text should remain readable in both modes</p>
          <p>• Icons and buttons should have appropriate contrast</p>
          <p>• Form elements should be clearly visible and functional</p>
        </CardContent>
      </Card>
    </div>
  );
}
