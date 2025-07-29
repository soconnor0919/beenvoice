![beenvoice Logo](public/beenvoice-logo.png)

# beenvoice - Invoicing Made Simple

A modern, professional invoicing application built for freelancers and small businesses. beenvoice provides a clean, efficient way to manage clients and create professional invoices with ease.

![beenvoice Logo](https://img.shields.io/badge/beenvoice-Invoicing%20Made%20Simple-green?style=for-the-badge)

## ✨ Features

- **🔐 Secure Authentication** - Email/password registration and sign-in with NextAuth.js
- **👥 Client Management** - Create, edit, and manage client information
- **📄 Professional Invoices** - Generate detailed invoices with line items
- **💰 Flexible Pricing** - Set custom rates and calculate totals automatically
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI** - Clean, professional interface built with shadcn/ui
- **⚡ Type-Safe** - Full TypeScript support with tRPC for API calls
- **💾 Local Database** - SQLite database with Drizzle ORM

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Backend**: tRPC for type-safe API calls
- **Database**: Drizzle ORM with LibSQL (SQLite)
- **Authentication**: NextAuth.js with email/password
- **UI Components**: shadcn/ui with Tailwind CSS
- **Styling**: Geist font family
- **Package Manager**: Bun (with npm fallback)

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/beenvoice.git
   cd beenvoice
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your configuration:
   ```env
   DATABASE_URL="file:./db.sqlite"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   bun run db:push
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
beenvoice/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (NextAuth, tRPC)
│   │   ├── auth/              # Authentication pages
│   │   ├── clients/           # Client management pages
│   │   ├── invoices/          # Invoice management pages
│   │   └── _components/       # Page-specific components
│   ├── components/            # Shared UI components
│   ├── server/               # Server-side code
│   │   ├── api/              # tRPC routers
│   │   ├── auth/             # NextAuth configuration
│   │   └── db/               # Database schema and connection
│   ├── styles/               # Global styles
│   └── trpc/                 # tRPC client configuration
├── drizzle/                  # Database migrations
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🎯 Usage

### Getting Started

1. **Register an Account**
   - Visit the sign-up page
   - Enter your name, email, and password
   - Verify your email (if configured)

2. **Add Your First Client**
   - Navigate to the Clients page
   - Click "Add New Client"
   - Fill in client details (name, email, phone, address)

3. **Create an Invoice**
   - Go to the Invoices page
   - Click "Create New Invoice"
   - Select a client
   - Add line items with descriptions, dates, hours, and rates
   - Save and generate your invoice

### Features Overview

#### Client Management
- Create and edit client profiles
- Store contact information and addresses
- Search and filter client list
- View client history

#### Invoice Creation
- Select from existing clients
- Add multiple line items
- Set custom rates per item
- Automatic total calculations
- Professional invoice formatting

#### User Interface
- Clean, modern design
- Responsive layout
- Intuitive navigation
- Toast notifications for feedback
- Modal dialogs for forms

## 🔧 Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server

# Database
bun run db:push      # Push schema changes to database
bun run db:studio    # Open Drizzle Studio
bun run db:generate  # Generate new migration

# Code Quality
bun run lint         # Run ESLint
bun run format       # Format code with Prettier
bun run type-check   # Run TypeScript type checking
```

### Database Schema

The application uses four main tables:

- **users**: User accounts and authentication
- **clients**: Client information and contact details
- **invoices**: Invoice headers with client relationships
- **invoice_items**: Individual line items with pricing

### API Development

All API endpoints are built with tRPC for type safety:

- **Authentication**: NextAuth.js integration
- **Clients**: CRUD operations for client management
- **Invoices**: Invoice creation and management
- **Validation**: Zod schemas for input validation

## 🎨 Customization

### Styling

The app uses Tailwind CSS with a custom design system:

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

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Deploy with automatic scaling

### Environment Variables

Required for production:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

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
- Add tests for new features
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [T3 Stack](https://create.t3.gg/) for the excellent development stack
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) for database management

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/beenvoice/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/beenvoice/discussions)
- **Email**: support@beenvoice.com

---

Built for freelancers and small businesses who deserve better invoicing tools.
