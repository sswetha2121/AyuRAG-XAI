# ==============================================================================
# AyuRAG-XAI Backend Production Container
# ==============================================================================

FROM python:3.12-slim as backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies for database drivers
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \Fix the GitHub Actions workflow failure in the AyuRAG-XAI repository.

The failing step is:

`python manage.py check --deploy`

The traceback shows that `backend/backend/settings.py` raises `ImproperlyConfigured` because `DJANGO_ENV=production` is set but `DB_ENGINE` is missing.

Inspect the actual Django settings and `.github/workflows` configuration before editing anything.

Requirements:

1. Identify all database environment variables expected by `backend/backend/settings.py`.
2. Configure the backend CI job to start an isolated PostgreSQL service with a test-only database, username and password.
3. Pass the correct `DB_ENGINE`, database name, database user, database password, database host and database port environment variables using the exact names expected by the existing settings.
4. Supply a valid CI-only Django secret and the minimum non-secret configuration required by production checks.
5. Wait for PostgreSQL to become healthy before executing Django commands.
6. Run `python manage.py check --deploy` using the production settings and the CI PostgreSQL service.
7. Run `python manage.py makemigrations --check --dry-run`, the existing migrations and the complete Django test suite.
8. Do not connect CI to a real production database or put real credentials in the workflow.
9. Do not weaken the production settings, remove the `DB_ENGINE` validation, enable an implicit SQLite fallback or suppress deployment-check warnings merely to make CI pass.
10. Preserve the existing frontend checks and other CI jobs.
11. Execute the relevant checks locally if possible, inspect the workflow changes, and report the actual results.

If production checks reveal additional genuine configuration issues, fix them appropriately or report them explicitly. Do not claim that tests passed unless they were executed.
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source
COPY backend /app/

# Create unprivileged application user
RUN groupadd -r ayurag && useradd -r -g ayurag -d /app -s /sbin/nologin ayurag && \
    mkdir -p /app/staticfiles /app/media /app/backups && \
    chown -R ayurag:ayurag /app

USER ayurag

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/live/ || exit 1

# Production WSGI startup via Gunicorn
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--threads", "2", "--timeout", "90", "--access-logfile", "-", "--error-logfile", "-"]
