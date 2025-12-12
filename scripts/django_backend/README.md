# 2D MatTech Global 2026 - Django Admin Backend

This Django backend connects to the same Supabase PostgreSQL database used by your Next.js frontend, allowing you to manage registration statuses through Django's powerful admin interface.

## Features

- **Admin Dashboard**: Beautiful Django admin interface for managing registrations
- **Status Management**: Update registration status (Under Process, Accepted, Rejected)
- **Admin Notes**: Add notes that participants can see in their dashboard
- **Bulk Actions**: Update multiple registrations at once
- **REST API**: Full API for custom integrations
- **Statistics**: Dashboard with registration analytics

## Setup Instructions

### 1. Create a virtual environment

\`\`\`bash
cd scripts/django_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

### 2. Install dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase database credentials:

\`\`\`bash
cp .env.example .env
\`\`\`

Get these values from your Supabase dashboard:
- Go to **Settings > Database**
- Use the **Connection string** (PostgreSQL) values
- The host looks like: `aws-0-region.pooler.supabase.com`

### 4. Create a Django superuser

\`\`\`bash
python manage.py createsuperuser
\`\`\`

### 5. Run the development server

\`\`\`bash
python manage.py runserver
\`\`\`

### 6. Access the admin panel

Open http://localhost:8000/admin and log in with your superuser credentials.

## Admin Interface Features

### Registration List
- View all registrations with color-coded status badges
- Filter by status, delegate type, and region
- Search by name, email, or institution
- Quick view of payment status

### Registration Detail
- View complete registration information (read-only)
- Update status: Under Process, Accepted, or Rejected
- Add admin notes that participants can see
- View metadata (timestamps, IDs)

### Bulk Actions
- Select multiple registrations
- Mark all as Accepted/Rejected/Under Process

## API Endpoints

The backend also provides REST API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/registrations/` | GET | List all registrations |
| `/api/registrations/{id}/` | GET | Get single registration |
| `/api/registrations/{id}/update_status/` | PATCH | Update status |
| `/api/registrations/statistics/` | GET | Get statistics |
| `/api/registrations/bulk_update_status/` | POST | Bulk update |

## Important Notes

1. **Database Sync**: This Django app connects to the same Supabase PostgreSQL database as your Next.js frontend. Changes made here will immediately reflect in the participant dashboard.

2. **RLS Bypass**: Django connects directly to PostgreSQL, bypassing Supabase RLS policies. This is intentional for admin access.

3. **Security**: In production, ensure you:
   - Change the `DJANGO_SECRET_KEY`
   - Set `DEBUG=False`
   - Configure proper `ALLOWED_HOSTS`
   - Use HTTPS
   - Restrict database access

4. **No Migrations Needed**: The `registrations` table already exists in Supabase. The model uses `managed = False` to prevent Django from modifying the table structure.
\`\`\`
