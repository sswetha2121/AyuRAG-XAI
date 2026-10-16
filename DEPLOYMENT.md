# AyuRAG-XAI Production Deployment & Operations Guide

## 1. System Overview

AyuRAG-XAI is an Explainable AI and Clinical Decision Support System consisting of:
- **Frontend SPA**: React 18, Vite 6, React Router 7.
- **Backend API**: Django 6.0+, Django REST Framework, Gunicorn WSGI.
- **Database**: PostgreSQL 16+ (Production) / SQLite (Local development & testing).
- **Reverse Proxy**: Nginx (handling SSL termination, static assets, and API routing).

---

## 2. Environment Configuration

### Required Environment Variables

All production deployments **must** configure the following environment variables (via container environment or `.env` file):

| Variable | Description | Example / Default | Required in Production |
| :--- | :--- | :--- | :--- |
| `DJANGO_ENV` | Runtime environment tier | `production` | **Yes** |
| `DJANGO_DEBUG` | Django debug flag | `False` | **Yes (must be False)** |
| `DJANGO_SECRET_KEY` | Cryptographic secret (50+ chars) | `openssl rand -base64 48` | **Yes** |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated allowed hostnames | `ayurag.example.com` | **Yes** |
| `CORS_ALLOWED_ORIGINS` | Permitted frontend origins | `https://ayurag.example.com` | **Yes** |
| `CSRF_TRUSTED_ORIGINS` | Trusted origins for CSRF protection | `https://ayurag.example.com` | **Yes** |
| `SESSION_COOKIE_SECURE` | Strict HTTPS session cookies | `True` | **Yes** |
| `CSRF_COOKIE_SECURE` | Strict HTTPS CSRF cookies | `True` | **Yes** |
| `DJANGO_SECURE_SSL_REDIRECT`| Redirect HTTP to HTTPS | `False` (if proxy terminates SSL) | Optional |
| `DJANGO_SECURE_HSTS_SECONDS`| HSTS duration in seconds | `31536000` (1 year) | Optional |
| `DEMO_MODE` | Development persona switching | `False` | **Yes (must be False)** |
| `DB_ENGINE` | Database backend engine | `django.db.backends.postgresql` | **Yes (Postgres)** |
| `DB_NAME` | Database name | `ayurag_production` | **Yes** |
| `DB_USER` | Database username | `ayurag_app_user` | **Yes** |
| `DB_PASSWORD` | Strong database password | `...` | **Yes** |
| `DB_HOST` | Database host | `db` or `127.0.0.1` | **Yes** |
| `DB_PORT` | Database port | `5432` | **Yes** |
| `VITE_API_BASE_URL` | Frontend API endpoint path | `/api` | **Yes** |

### Startup Fail-Fast Validation

The backend performs strict startup validation:
- If `DJANGO_ENV=production` and `DJANGO_DEBUG=True`, startup will fail immediately.
- If `DEBUG=False` and `DJANGO_SECRET_KEY` is missing or insecure, startup will fail immediately.
- If `DEBUG=False` and `DJANGO_ALLOWED_HOSTS` is empty, startup will fail immediately.

---

## 3. Containerized Deployment (Recommended)

### Prerequisites
- Docker Engine 24+
- Docker Compose v2+

### Step-by-Step Deployment

1. **Clone repository and configure environment:**
   ```bash
   git clone https://github.com/sswetha2121/AyuRAG-XAI.git
   cd AyuRAG-XAI
   cp .env.example .env
   # Edit .env with your production credentials
   ```

2. **Build frontend assets:**
   ```bash
   npm ci
   npm run build
   ```

3. **Launch orchestrated services:**
   ```bash
   docker compose up -d --build
   ```

4. **Execute database migrations:**
   ```bash
   docker compose exec web python manage.py migrate
   ```

5. **Collect backend static files:**
   ```bash
   docker compose exec web python manage.py collectstatic --noinput
   ```

6. **Verify health:**
   ```bash
   curl -f http://localhost/api/health/live/
   curl -f http://localhost/api/health/ready/
   ```

---

## 4. Manual / Virtual Machine Deployment

### Step 1: Install Dependencies
```bash
# Python backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ..
npm ci
npm run build
```

### Step 2: Database Preparation
```bash
# In PostgreSQL:
CREATE DATABASE ayurag_production;
CREATE USER ayurag_app_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE ayurag_production TO ayurag_app_user;

# Run migrations
cd backend
python manage.py migrate
python manage.py collectstatic --noinput
```

### Step 3: Run WSGI Service with Gunicorn
```bash
gunicorn backend.wsgi:application \
  --bind 127.0.0.1:8000 \
  --workers 3 \
  --threads 2 \
  --timeout 90 \
  --access-logfile /var/log/ayurag/access.log \
  --error-logfile /var/log/ayurag/error.log
```

### Step 4: Configure Nginx
Copy `nginx/nginx.conf` into `/etc/nginx/nginx.conf`, adjusting paths to your `dist` folder and SSL certificates, then reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. Health Monitoring & Verification

The application exposes two unauthenticated, non-leaking health endpoints:

1. **Liveness Probe**: `GET /api/health/live/`
   - Returns `200 OK` with `{"status": "live"}`.
   - Verifies the application process is running and accepting HTTP requests.

2. **Readiness Probe**: `GET /api/health/ready/`
   - Returns `200 OK` with `{"status": "ready", "database": "connected"}`.
   - Executes an isolated query (`SELECT 1;`) to verify database connectivity.
   - Returns `503 Service Unavailable` if database connection fails.
   - Never exposes database names, tables, credentials, or internal stack traces.

---

## 6. Backup, Recovery, and Disaster Rollback

### Automated Backup Procedure
Run the integrated backup utility:
```bash
cd backend
python scripts/db_backup_restore.py backup --output-dir /var/backups/ayurag
```
This produces:
- A timestamped, portable JSON fixture (`ayurag_data_TIMESTAMP.json`).
- A verified binary snapshot (if SQLite).
- A integrity verification report (`MANIFEST.txt`).

### Integrity Check
Verify data relationships and check for orphaned records:
```bash
python scripts/db_backup_restore.py verify
```

### Disaster Recovery / Restoration
To restore data from an existing verified backup fixture:
```bash
python scripts/db_backup_restore.py restore --file /var/backups/ayurag/backup_TIMESTAMP/ayurag_data_TIMESTAMP.json --force
```

### Emergency Rollback Procedure
If a deployment fails:
1. Revert Nginx or DNS traffic to the previous stable release.
2. If schema migrations were run:
   ```bash
   python manage.py showmigrations
   python manage.py migrate <app_name> <previous_migration_name>
   ```
3. If database state is corrupted, restore from the pre-deployment backup fixture:
   ```bash
   python scripts/db_backup_restore.py restore --file /path/to/pre_deployment_backup.json --force
   ```
4. Restart application workers:
   ```bash
   docker compose restart web
   # or systemctl restart gunicorn
   ```
