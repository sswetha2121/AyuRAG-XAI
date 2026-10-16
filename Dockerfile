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
    libpq-dev \
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
