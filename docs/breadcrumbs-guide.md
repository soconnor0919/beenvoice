# Dynamic Breadcrumbs Guide

## Overview

The breadcrumb system in beenvoice automatically generates navigation trails based on the current URL path. It features intelligent pluralization, proper capitalization, and dynamic resource name fetching.

## Key Features

### 1. Automatic Pluralization

The breadcrumb system intelligently handles singular and plural forms:

- **List pages** (e.g., `/dashboard/businesses`) → "Businesses"
- **Detail pages** (e.g., `/dashboard/businesses/[id]`) → "Business"
- **New pages** (e.g., `/dashboard/businesses/new`) → "Business" (singular context)

### 2. Smart Capitalization

All route segments are automatically capitalized:
- `businesses` → "Businesses"
- `clients` → "Clients"
- `invoices` → "Invoices"

### 3. Dynamic Resource Names

Instead of showing UUIDs, breadcrumbs fetch and display actual resource names:
- `/dashboard/clients/123e4567-e89b-12d3-a456-426614174000` → "Dashboard / Clients / John Doe"
- `/dashboard/invoices/987fcdeb-51a2-43f1-b321-123456789abc` → "Dashboard / Invoices / INV-2024-001"

### 4. Context-Aware Labels

Special pages are handled intelligently:
- **Edit pages**: Show the resource name instead of "Edit" as the last breadcrumb
- **New pages**: Show "New" as the last breadcrumb
- **Import/Export pages**: Show appropriate action labels

## Implementation Details

### Pluralization Rules

The system uses a comprehensive pluralization utility (`src/lib/pluralize.ts`) that handles:

```typescript
// Common business terms
business → businesses
client → clients
invoice → invoices
category → categories
company → companies

// General rules
- Words ending in 's', 'ss', 'sh', 'ch', 'x', 'z' → add 'es'
- Words ending in consonant + 'y' → change to 'ies'
- Words ending in 'f' or 'fe' → change to 'ves'
- Default → add 's'
```

### Resource Fetching

The breadcrumbs automatically detect resource IDs and fetch the appropriate data:

```typescript
// Detects UUID patterns in the URL
const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

// Fetches data based on resource type
- Clients: Shows client name
- Invoices: Shows invoice number or formatted date
- Businesses: Shows business name
```

### Loading States

While fetching resource data, breadcrumbs show loading skeletons:
```tsx
<Skeleton className="inline-block h-5 w-24 align-middle" />
```

## Usage Examples

### Basic List Page
**URL**: `/dashboard/clients`
**Breadcrumbs**: Dashboard / Clients

### Resource Detail Page
**URL**: `/dashboard/clients/550e8400-e29b-41d4-a716-446655440000`
**Breadcrumbs**: Dashboard / Clients / Jane Smith

### Resource Edit Page
**URL**: `/dashboard/businesses/550e8400-e29b-41d4-a716-446655440000/edit`
**Breadcrumbs**: Dashboard / Businesses / Acme Corp
*(Note: "Edit" is hidden when showing the resource name)*

### New Resource Page
**URL**: `/dashboard/invoices/new`
**Breadcrumbs**: Dashboard / Invoices / New

### Nested Resources
**URL**: `/dashboard/clients/550e8400-e29b-41d4-a716-446655440000/invoices`
**Breadcrumbs**: Dashboard / Clients / John Doe / Invoices

## Customization

### Adding New Resource Types

To add a new resource type, update the pluralization rules:

```typescript
// In src/lib/pluralize.ts
const PLURALIZATION_RULES = {
  // ... existing rules
  product: { singular: "Product", plural: "Products" },
  service: { singular: "Service", plural: "Services" },
};
```

### Custom Resource Labels

For resources that need custom display logic, add to the breadcrumb component:

```typescript
// For invoices, show invoice number instead of ID
if (prevSegment === "invoices") {
  label = invoice.invoiceNumber || format(new Date(invoice.issueDate), "MMM dd, yyyy");
}
```

### Special Segments

Add new special segments to the `SPECIAL_SEGMENTS` object:

```typescript
const SPECIAL_SEGMENTS = {
  new: "New",
  edit: "Edit",
  import: "Import",
  export: "Export",
  duplicate: "Duplicate",
  archive: "Archive",
};
```

## Best Practices

1. **Consistent Naming**: Use consistent URL patterns across your app
   - List pages: `/dashboard/[resource]`
   - Detail pages: `/dashboard/[resource]/[id]`
   - Actions: `/dashboard/[resource]/[id]/[action]`

2. **Resource Fetching**: Only fetch data when needed
   - Check resource type before enabling queries
   - Use proper loading states

3. **Error Handling**: Handle cases where resources don't exist
   - Show fallback text or maintain UUID display
   - Don't break the breadcrumb trail

4. **Performance**: Breadcrumb queries are lightweight
   - Only fetch minimal data (id, name)
   - Use React Query caching effectively

## API Integration

The breadcrumb component integrates with tRPC routers:

```typescript
// Each resource router should have a getById method
getById: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    // Return resource with at least id and name/title
  })
```

## Accessibility

- Breadcrumbs use semantic HTML with proper ARIA labels
- Each segment is a link except the current page
- Proper keyboard navigation support
- Screen reader friendly with role="navigation"

## Responsive Design

- Breadcrumbs wrap on smaller screens
- Font sizes adjust: `text-sm sm:text-base`
- Separators scale appropriately
- Loading skeletons match text size

## Migration from Static Breadcrumbs

If migrating from hardcoded breadcrumbs:

1. Remove static breadcrumb definitions
2. Ensure URLs follow consistent patterns
3. Add getById methods to resource routers
4. Update imports to use `DashboardBreadcrumbs`

The dynamic system will automatically generate appropriate breadcrumbs based on the URL structure.