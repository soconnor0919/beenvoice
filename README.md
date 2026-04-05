![beenvoice Logo](public/beenvoice-logo.png)

# beenvoice - Invoicing Made Simple

A modern, professional invoicing application built for freelancers and small businesses. beenvoice provides a clean, efficient way to manage clients and create professional invoices with ease.

![beenvoice Logo](https://img.shields.io/badge/beenvoice-Invoicing%20Made%20Simple-green?style=for-the-badge)

## ✨ Features

- **🔐 Secure Authentication** - Email/password registration and sign-in with better-auth, plus SSO via Authentik OIDC
- **👥 Client Management** - Create, edit, and manage client information
- **🏢 Business Profiles** - Manage your business details, logo, and email settings
- **📄 Professional Invoices** - Generate detailed invoices with line items
- **📅 Timesheet View** - Calendar-based time entry with month and week views
- **📧 Email Delivery** - Send invoices via email using Resend
- **📥 PDF Export** - Download invoices as professional PDFs
- **📊 CSV Import** - Bulk import invoice data from CSV files
- **💰 Flexible Pricing** - Set custom rates and calculate totals automatically
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI** - Clean, professional interface built with shadcn/ui
- **⚡ Type-Safe** - Full TypeScript support with tRPC for API calls
- **💾 PostgreSQL Database** - Robust relational database with Drizzle ORM

## 🚀 Tech Stack

- **Frontend**: Next.js 16 with App Router
- **Backend**: tRPC for type-safe API calls
- **Database**: Drizzle ORM with PostgreSQL
- **Authentication**: better-auth with email/password and Authentik OIDC SSO
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Email**: Resend for transactional email delivery
- **PDF**: @react-pdf/renderer for invoice PDF generation
- **Package Manager**: Bun

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- Docker & Docker Compose (for local PostgreSQL)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/beenvoice.git
   cd beenvoice
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/beenvoice"
   DB_DISABLE_SSL="true"

   # Authentication
   AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"

   # Application
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NODE_ENV="development"

   # Email (optional for local dev)
   RESEND_API_KEY="your-resend-api-key"
   RESEND_DOMAIN="yourdomain.com"
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Push the database schema**
   ```bash
   bun run db:push
   ```

6. **Start the development server**
   ```bash
   bun run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
beenvoice/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (better-auth, tRPC)
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main app pages
│   │   │   ├── clients/       # Client management pages
│   │   │   ├── invoices/      # Invoice management pages
│   │   │   └── businesses/    # Business profile pages
│   │   └── _components/       # Page-specific components
│   ├── components/            # Shared UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── data/             # Data display components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── server/               # Server-side code
│   │   ├── api/              # tRPC routers
│   │   └── db/               # Database schema and connection
│   ├── lib/                  # Utilities (auth, pdf export, etc.)
│   ├── styles/               # Global styles
│   └── trpc/                 # tRPC client configuration
├── drizzle/                  # Database migrations
├── public/                   # Static assets
├── docs/                     # Documentation
└── docker-compose.yml        # Local PostgreSQL setup
```

## 🎯 Usage

### Getting Started

1. **Register an Account**
   - Visit the sign-up page
   - Enter your name, email, and password

2. **Set Up Your Business**
   - Navigate to Business Settings
   - Add your business name, contact info, and logo
   - Configure email settings for invoice delivery (Resend API key + domain)

3. **Add Your First Client**
   - Navigate to the Clients page
   - Click "Add New Client"
   - Fill in client details (name, email, phone, address)

4. **Create an Invoice**
   - Go to the Invoices page
   - Click "Create New Invoice"
   - Select a client and optionally a business profile
   - Add line items with descriptions, dates, hours, and rates
   - Use the Timesheet tab for calendar-based time entry
   - Save and send or download as PDF

### Features Overview

#### Client Management
- Create and edit client profiles
- Store contact information and addresses
- Set default hourly rates per client
- Search and filter client list

#### Invoice Creation
- Select from existing clients and business profiles
- Add multiple line items with drag-and-drop reordering
- Set custom rates per item
- Automatic total calculations with configurable tax rate
- Timesheet calendar view for date-based time tracking
- Professional invoice formatting

#### Invoice Delivery
- Send invoices via email directly from the app
- Rich text email composer with preview
- Resend and re-deliver sent invoices
- Track invoice status: Draft → Sent → Paid (+ Overdue)

#### User Interface
- Clean, modern design
- Fully responsive — desktop, tablet, and mobile
- Intuitive navigation with breadcrumbs
- Toast notifications for feedback
- Dark mode support

## 🔧 Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server (Turbo)
bun run build        # Build for production
bun run start        # Start production server

# Database
bun run db:push      # Push schema changes to database
bun run db:migrate   # Run migrations
bun run db:studio    # Open Drizzle Studio
bun run db:generate  # Generate new migration

# Docker
bun run docker:up    # Start local PostgreSQL via Docker
bun run docker:down  # Stop Docker services

# Code Quality
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
bun run format:write # Format code with Prettier
bun run typecheck    # Run TypeScript type checking
```

### Database Schema

The application uses the following core tables:

- **users** - User accounts and authentication
- **sessions** - Active user sessions
- **clients** - Client information and contact details
- **businesses** - Business profiles with email/logo settings
- **invoices** - Invoice headers with client and business relationships
- **invoice_items** - Individual line items with pricing and position ordering

### API Development

All API endpoints are built with tRPC for type safety:

- **Authentication**: better-auth integration (email/password + OIDC)
- **Clients**: CRUD operations for client management
- **Businesses**: Business profile management
- **Invoices**: Invoice creation, management, and status tracking
- **Validation**: Zod schemas for input validation

## 🎨 Customization

### Styling

The app uses Tailwind CSS v4 with a custom design system:

- **Primary Color**: Green (#16a34a)
- **Font**: Geist for professional typography
- **Components**: shadcn/ui component library
- **Spacing**: 4px grid system

### Branding

Update the logo and colors in:
- `src/components/logo.tsx` - Main logo component
- `src/styles/globals.css` - Color variables
- `src/app/layout.tsx` - Font configuration

## 🚀 Deployment

You can deploy this application to any platform that supports Next.js and PostgreSQL (Docker, Coolify, Railway, etc.).

1. **Build the application:**
   ```bash
   bun run build
   ```

2. **Set up production environment variables** (see `.env.local` example above, adjusting URLs and secrets for production)

3. **Run database migrations:**
   ```bash
   bun run db:push
   ```

4. **Start the server:**
   ```bash
   bun start
   ```

### Environment Variables

Required for production:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
AUTH_SECRET="your-long-random-secret"
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"

# Email (required for invoice sending)
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_DOMAIN="yourdomain.com"

# Optional: Authentik SSO
AUTHENTIK_ISSUER="https://your-authentik-instance/application/o/beenvoice/"
AUTHENTIK_CLIENT_ID="your-client-id"
AUTHENTIK_CLIENT_SECRET="your-client-secret"
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Coolify**: Deploy with Docker Compose support
- **Railway**: Connect your GitHub repository (includes managed PostgreSQL)
- **DigitalOcean App Platform**: Deploy with automatic scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use shadcn/ui components for consistency
- Implement proper error handling
- Follow the existing code style (Prettier + ESLint configs provided)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [T3 Stack](https://create.t3.gg/) for the excellent development stack
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [better-auth](https://www.better-auth.com/) for modern authentication
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Resend](https://resend.com/) for reliable email delivery

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/beenvoice/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/beenvoice/discussions)

---

Built for freelancers and small businesses who deserve better invoicing tools.
