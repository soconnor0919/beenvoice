# Responsive Table Examples

This document shows how tables adapt across different screen sizes in the beenvoice application.

## Mobile View (< 640px)

### Invoices Table
- **Visible**: Invoice number, client name, amount, status, actions
- **Hidden**: Issue date, due date (shown on detail view)
- **Features**: Compact spacing, smaller buttons, simplified pagination

### Clients Table
- **Visible**: Name with email, actions
- **Hidden**: Phone, address, created date
- **Icon**: Hidden on mobile to save space

### Businesses Table
- **Visible**: Name with email, actions
- **Hidden**: Phone, address, tax ID, website
- **Icon**: Hidden on mobile to save space

## Tablet View (640px - 1024px)

### Invoices Table
- **Added**: Issue date column
- **Still Hidden**: Due date (less critical than issue date)
- **Features**: Search bar expands, column visibility toggle appears

### Clients Table
- **Added**: Phone column, client icon
- **Still Hidden**: Address, created date
- **Features**: Better spacing, full search functionality

### Businesses Table
- **Added**: Phone column, business icon
- **Still Hidden**: Address, tax ID
- **Features**: Website links become visible

## Desktop View (> 1024px)

### All Tables
- **Full Features**: All columns visible
- **Enhanced**: 
  - Full pagination controls with page size selector
  - Column visibility toggle
  - Advanced filters
  - Comfortable spacing
  - All metadata visible

## Code Examples

### Responsive Column Definition
```tsx
// Hide on mobile, show on tablet and up
{
  accessorKey: "phone",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Phone" />
  ),
  cell: ({ row }) => (
    <span className="hidden md:inline">{row.original.phone || "—"}</span>
  ),
}

// Hide on mobile and tablet, show on desktop
{
  id: "address",
  header: "Address",
  cell: ({ row }) => (
    <span className="hidden lg:inline">{formatAddress(row.original)}</span>
  ),
}
```

### Responsive Cell Content
```tsx
// Icon hidden on mobile
<div className="flex items-center gap-3">
  <div className="hidden rounded-lg bg-status-info-muted p-2 sm:flex">
    <UserPlus className="h-4 w-4 text-status-info" />
  </div>
  <div className="min-w-0">
    <p className="truncate font-medium">{client.name}</p>
    <p className="truncate text-sm text-muted-foreground">
      {client.email || "—"}
    </p>
  </div>
</div>
```

### Responsive Actions
```tsx
// Compact action buttons that work on all screen sizes
<div className="flex items-center justify-end gap-1">
  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
    <Pencil className="h-3.5 w-3.5" />
  </Button>
  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
    <Trash2 className="h-3.5 w-3.5" />
  </Button>
</div>
```

## Filter Bar Behavior

### Mobile
- Search input takes full width
- Filter dropdowns stack vertically
- Column visibility hidden
- Clear filters button visible when filters active

### Tablet+
- Search input limited to max-width
- Filter dropdowns in horizontal row
- Column visibility toggle appears
- All controls in single row

## Pagination Behavior

### Mobile
- Simplified page indicator (1/5 format)
- Compact button spacing
- Page size selector with smaller text

### Desktop
- Full "Page 1 of 5" text
- Comfortable button spacing
- First/Last page buttons visible
- Entries count with detailed information

## Best Practices

1. **Priority Content**: Always show the most important data on mobile
2. **Progressive Enhancement**: Add columns as screen size increases
3. **Touch Targets**: Maintain 44px minimum touch targets on mobile
4. **Text Truncation**: Use `truncate` class for long text in narrow columns
5. **Icon Usage**: Hide decorative icons on mobile, keep functional ones
6. **Testing**: Always test at 375px (iPhone SE), 768px (iPad), and 1440px (Desktop)