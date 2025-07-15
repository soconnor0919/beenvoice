# Data Table Responsive Design Guide

## Overview

The data table component has been updated to provide better responsive behavior, consistent padding, and proper scaling across different screen sizes.

## Key Improvements

### 1. Consistent Padding
- Uniform padding across all table elements
- Responsive padding that scales with screen size
- Cards now have consistent spacing (p-3 on mobile, p-4 on desktop)

### 2. Proper Responsive Column Hiding
- Columns now properly hide both headers and cells on smaller screens
- Uses `meta` properties for clean column visibility control
- No more orphaned headers on mobile devices

### 3. Better Scaling
- Font sizes adapt to screen size (text-xs on mobile, text-sm on desktop)
- Button sizes and spacing adjust appropriately
- Pagination controls are optimized for touch devices

## Using Responsive Columns

### Basic Column Definition

```tsx
const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => row.original.name,
    // Always visible on all screen sizes
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => row.original.phone || "—",
    meta: {
      // Hidden on mobile, visible on md screens and up
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => formatAddress(row.original),
    meta: {
      // Hidden on mobile and tablet, visible on lg screens and up
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
    meta: {
      // Only visible on xl screens and up
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
    },
  },
];
```

### Responsive Breakpoints

- **Always visible**: No meta properties needed
- **md and up** (768px+): `hidden md:table-cell`
- **lg and up** (1024px+): `hidden lg:table-cell`
- **xl and up** (1280px+): `hidden xl:table-cell`

## Complex Cell Content

For cells with complex content that should partially hide on mobile:

```tsx
{
  accessorKey: "client",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Client" />
  ),
  cell: ({ row }) => {
    const client = row.original;
    return (
      <div className="flex items-center gap-3">
        {/* Icon hidden on mobile, shown on sm screens */}
        <div className="bg-status-info-muted hidden rounded-lg p-2 sm:flex">
          <UserIcon className="text-status-info h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{client.name}</p>
          {/* Secondary info can be hidden on very small screens if needed */}
          <p className="text-muted-foreground truncate text-sm">
            {client.email || "—"}
          </p>
        </div>
      </div>
    );
  },
}
```

## Best Practices

### 1. Priority-Based Column Hiding
- Always show the most important columns (e.g., name, status, primary action)
- Hide supplementary information first (e.g., dates, secondary details)
- Consider hiding decorative elements (icons) on mobile while keeping text

### 2. Mobile-First Design
- Ensure at least 2-3 columns are visible on mobile
- Test on actual devices, not just browser dev tools
- Consider the minimum viable information for each row

### 3. Touch-Friendly Actions
- Action buttons should be at least 44x44px on mobile
- Use appropriate spacing between interactive elements
- Consider grouping actions in a dropdown on mobile

### 4. Performance
- The responsive system uses CSS classes, so there's no JavaScript overhead
- Column visibility is handled by Tailwind's responsive utilities
- No re-renders needed when resizing

## Migration Guide

If you have existing data tables, update them as follows:

### Before:
```tsx
{
  accessorKey: "phone",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Phone" />
  ),
  cell: ({ row }) => (
    <span className="hidden md:inline">{row.original.phone || "—"}</span>
  ),
}
```

### After:
```tsx
{
  accessorKey: "phone",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Phone" />
  ),
  cell: ({ row }) => row.original.phone || "—",
  meta: {
    headerClassName: "hidden md:table-cell",
    cellClassName: "hidden md:table-cell",
  },
}
```

## Common Patterns

### Status Columns
Always visible, use color and icons to convey information efficiently:

```tsx
{
  accessorKey: "status",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Status" />
  ),
  cell: ({ row }) => <StatusBadge status={row.original.status} />,
}
```

### Date Columns
Often hidden on mobile, show relative dates when space is limited:

```tsx
{
  accessorKey: "createdAt",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Created" />
  ),
  cell: ({ row }) => {
    const date = row.getValue("createdAt") as Date;
    return (
      <>
        {/* Full date on larger screens */}
        <span className="hidden sm:inline">{formatDate(date)}</span>
        {/* Relative date on mobile */}
        <span className="sm:hidden">{formatRelativeDate(date)}</span>
      </>
    );
  },
}
```

### Action Columns
Keep actions accessible but space-efficient:

```tsx
{
  id: "actions",
  cell: ({ row }) => {
    const item = row.original;
    return (
      <div className="flex items-center justify-end gap-1">
        {/* Show individual buttons on larger screens */}
        <div className="hidden sm:flex sm:gap-1">
          <EditButton item={item} />
          <DeleteButton item={item} />
        </div>
        {/* Dropdown menu on mobile */}
        <div className="sm:hidden">
          <ActionsDropdown item={item} />
        </div>
      </div>
    );
  },
}
```

## Testing Checklist

- [ ] Table is readable on 320px wide screens
- [ ] Headers and cells align properly at all breakpoints
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Horizontal scrolling works smoothly when needed
- [ ] Critical information is always visible
- [ ] Loading states work correctly
- [ ] Empty states are responsive
- [ ] Pagination controls are touch-friendly

## Accessibility Notes

- Hidden columns are properly hidden from screen readers
- Table remains navigable with keyboard at all screen sizes
- Sort controls are accessible on mobile
- Focus indicators are visible on all interactive elements