# Safary Bags and Footwear - Management System

A responsive retail web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL & Auth)**.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) for the Customer Website.
4. Open [http://localhost:3000/login](http://localhost:3000/login) for the Admin Management Portal. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `SESSION_SECRET` (32+ random characters) in `.env.local` first.

## Key Modules

- **Customer Website**: Home showcase, full search & filters (size, colour, category), live inventory availability checker, and dynamic prefilled WhatsApp ordering links.
- **Admin Dashboard**:
  - **Overview**: Real-time KPI cards (Today's Sales, Bill Count, Total Revenue, Est. Gross Profit, Low Stock items).
  - **Catalog**: Products, Categories, and dynamic Colour & Size Variant Matrix.
  - **Inventory**: Real-time stock counts by colour and size, audited stock movements ledger.
  - **Billing / POS**: Fast Point of Sale counter terminal, atomic stock reduction, Cash/UPI/Card/Credit split payments, printable 80mm thermal receipt & A4 invoice.
  - **Purchases**: Supplier invoices, purchase entries, automatic inventory increment upon confirmation.
  - **Returns & Exchanges**: Original bill lookup, restock condition validation (sellable vs damaged), refund issuance.
  - **Credit Management**: Customer credit tracking, balance settlements, and debit/credit ledger.
  - **Finance**: Daily expense logging and comprehensive P&L financial reports with CSV export.
  - **System**: Role-based access control (Owner vs Staff) and shop settings.
