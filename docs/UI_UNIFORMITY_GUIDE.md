# UI Uniformity Guide for beenvoice

## Overview

This guide documents the unified component system implemented across the beenvoice application to ensure consistent UI/UX patterns. The system follows a hierarchical approach where:

1. **CSS Variables** (in `globals.css`) define the design tokens
2. **UI Components** (in `components/ui`) consume these variables
3. **Pages** use components with minimal additional styling

## Design System Principles

### 1. Variable-Based Theming
All colors, spacing, and other design tokens are defined as CSS variables in `globals.css`:
- Brand colors: `--brand-primary`, `--brand-secondary`
- Status colors: `--status-success`, `--status-warning`, `--status-error`, `--status-info`
- Semantic colors: `--background`, `--foreground`, `--muted`, etc.

### 2. Component Composition
Complex UI patterns are built from smaller, reusable components rather than duplicating code.

### 3. Minimal Page-Level Styling
Pages should primarily compose pre-built components and avoid custom Tailwind classes where possible.

## Core Unified Components

### Page Layout Components

#### `PageContent`
Wraps page content with consistent spacing:
```tsx
<PageContent spacing="default">
  {/* Page sections */}
</PageContent>
```

#### `PageSection`
Groups related content with optional title and actions:
```tsx
<PageSection 
  title="Section Title" 
  description="Optional description"
  actions={<Button>Action</Button>}
>
  {/* Section content */}
</PageSection>
```

#### `PageGrid`
Responsive grid layout with preset column options:
```tsx
<PageGrid columns={3} gap="default">
  {/* Grid items */}
</PageGrid>
```

### Data Display Components

#### `DataTable`
Unified table component using @tanstack/react-table with floating card design:
```tsx
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "~/components/ui/data-table";
import { PageSection } from "~/components/ui/page-layout";

const columns: ColumnDef<DataType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="font-medium">{name}</div>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-3.5 w-3.5" />
        </Button>
      );
    }
  }
];

const filterableColumns = [
  {
    id: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" }
    ]
  }
];

// Wrap in PageSection for title/description
<PageSection 
  title="Table Title"
  description="Optional description"
>
  <DataTable
    columns={columns}
    data={data}
    searchPlaceholder="Search by name..."
    filterableColumns={filterableColumns}
  />
</PageSection>
```

Features:
- **Floating Card Design**: Three separate cards for filter bar, table content, and pagination
- **Filter Bar Card**: Minimal padding (p-3) with global search and column filters
- **Table Content Card**: Clean borders with overflow handling
- **Pagination Card**: Compact controls with page size selector
- **Responsive Design**: Mobile-optimized with hidden columns on smaller screens
- **Tight Appearance**: Compact spacing with smaller action buttons
- **Sorting**: Visual indicators with proper arrow directions
- **Column Visibility**: Toggle columns (hidden on mobile)
- **Dark Mode**: Consistent styling across light/dark themes
- **Loading States**: DataTableSkeleton component with matching card structure

#### `StatsCard`
Displays statistics with consistent styling:
```tsx
<StatsCard
  title="Total Revenue"
  value="$10,000"
  icon={DollarSign}
  description="From 50 invoices"
  variant="success"
/>
```

#### `QuickActionCard`
Interactive cards for navigation or actions:
```tsx
<QuickActionCard
  title="Create Invoice"
  description="Start a new invoice"
  icon={Plus}
  variant="success"
>
  <Link href="/invoices/new">
    <div className="h-full w-full" />
  </Link>
</QuickActionCard>
```

### Feedback Components

#### `EmptyState`
Consistent empty state displays:
```tsx
<EmptyState
  icon={<FileText className="h-8 w-8" />}
  title="No invoices yet"
  description="Create your first invoice to get started"
  action={<Button>Create Invoice</Button>}
/>
```

## Component Variants

### Color Variants
Most components support these variants:
- `default` - Uses default theme colors
- `success` - Green color scheme for positive states
- `warning` - Orange/amber for warnings
- `error` - Red for errors or destructive actions
- `info` - Blue for informational content

### Size Variants
- `sm` - Small size
- `default` - Normal size
- `lg` - Large size

## Usage Examples

### Standard Page Structure
```tsx
export default function ExamplePage() {
  return (
    <PageContent>
      <PageHeader
        title="Page Title"
        description="Page description"
        variant="gradient"
      >
        <Button variant="brand">
          Primary Action
        </Button>
      </PageHeader>

      <PageSection>
        <PageGrid columns={4}>
          <StatsCard {...statsProps} />
        </PageGrid>
      </PageSection>

      <PageSection
        title="Data Table Title"
        description="Table description"
      >
        <DataTable {...tableProps} />
      </PageSection>
    </PageContent>
  );
}
```

### Consistent Button Usage
```tsx
// Primary actions
<Button variant="brand">Create New</Button>

// Secondary actions
<Button variant="outline">Cancel</Button>

// Destructive actions
<Button variant="destructive">Delete</Button>

// Icon-only actions
<Button variant="ghost" size="icon">
  <Edit className="h-4 w-4" />
</Button>
```

## Styling Guidelines

### Do's
- ✅ Use predefined color variables from globals.css
- ✅ Compose existing UI components
- ✅ Use semantic variant names (success, error, etc.)
- ✅ Follow the established spacing patterns
- ✅ Use the PageLayout components for structure

### Don'ts
- ❌ Add custom colors directly in components
- ❌ Create one-off table or card implementations
- ❌ Override component styles with important flags
- ❌ Use arbitrary spacing values
- ❌ Mix different UI patterns on the same page

## Migration Checklist

When updating a page to use the unified system:

1. Replace custom tables with `DataTable` using @tanstack/react-table ColumnDef
2. Replace statistics displays with `StatsCard`
3. Replace action cards with `QuickActionCard`
4. Wrap content in `PageContent` and `PageSection`
5. Use `PageGrid` for responsive layouts
6. Replace custom empty states with `EmptyState`
7. Update buttons to use the `brand` variant for primary actions
8. Remove page-specific color classes
9. Use `DataTableColumnHeader` for sortable column headers
10. Use `DataTableSkeleton` for loading states

## Color System Reference

### Brand Colors
- Primary: Green (`#16a34a` / `oklch(0.646 0.222 164.25)`)
- Secondary: Teal/cyan shades
- Gradients: Use `bg-brand-gradient` class

### Status Colors
- Success: Green shades
- Warning: Amber/orange shades
- Error: Red shades
- Info: Blue shades

### Semantic Colors
- Background: White/dark gray
- Foreground: Black/white text
- Muted: Gray shades for secondary content
- Border: Light gray borders

## Component Documentation

For detailed component APIs and props, refer to:
- `/src/components/ui/data-table.tsx` - TanStack Table-based data table with sorting, filtering, and pagination
- `/src/components/ui/stats-card.tsx` - Statistics display cards
- `/src/components/ui/quick-action-card.tsx` - Interactive action cards
- `/src/components/ui/page-layout.tsx` - Page structure components

### DataTable Props
- `columns`: ColumnDef array from @tanstack/react-table
- `data`: Array of data to display
- `searchPlaceholder?`: Placeholder text for search input
- `showColumnVisibility?`: Show/hide column visibility toggle (default: true)
- `showPagination?`: Show/hide pagination controls (default: true)
- `showSearch?`: Show/hide search input (default: true)
- `pageSize?`: Number of items per page (default: 10)
- `filterableColumns?`: Array of column filters with options

Note: `title` and `description` should be provided via the wrapping `PageSection` component for consistent spacing and typography.

### Responsive Table Guidelines
- Use `hidden sm:flex` classes for icons in table cells
- Use `hidden md:inline` for less important columns on mobile
- Use `min-w-0` and `truncate` for text that might overflow
- Keep action buttons small with `h-8 w-8 p-0` sizing
- Test tables at all breakpoints (mobile, tablet, desktop)

## Future Considerations

1. **Form Components**: Create unified form field components
2. **Modal Patterns**: Standardize modal and dialog usage
3. **Loading States**: Create consistent skeleton loaders
4. **Animation**: Define standard transition patterns
5. **Icons**: Establish icon usage guidelines

## Maintenance

To maintain UI consistency:
1. Always check for existing components before creating new ones
2. Update this guide when adding new unified components
3. Review PRs for adherence to these patterns
4. Refactor pages that deviate from the system