import os
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment configuration from .env if present
load_dotenv(BASE_DIR.parent / '.env')
load_dotenv(BASE_DIR / '.env')

# Environment Determination (development / production / test)
ENVIRONMENT = os.environ.get('DJANGO_ENV', 'development').lower()
if ENVIRONMENT not in ('development', 'production', 'test', 'testing'):
    ENVIRONMENT = 'development'

IS_PRODUCTION = ENVIRONMENT == 'production'
IS_TESTING = ENVIRONMENT in ('test', 'testing')

# Debug mode: must be explicitly disabled in production
DEBUG = os.environ.get('DJANGO_DEBUG', str(not IS_PRODUCTION)).lower() in ('true', '1', 'yes')

if IS_PRODUCTION and DEBUG:
    raise ImproperlyConfigured('DJANGO_DEBUG cannot be True in production environment (DJANGO_ENV=production).')

# Secret Key configuration
_DEFAULT_DEV_SECRET = 'django-insecure-ayurag-xai-clinical-decision-support-key-2026'
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

if not SECRET_KEY:
    if not DEBUG:
        raise ImproperlyConfigured('DJANGO_SECRET_KEY environment variable must be set in production mode.')
    SECRET_KEY = _DEFAULT_DEV_SECRET
elif not DEBUG and (len(SECRET_KEY) < 50 or SECRET_KEY.startswith('django-insecure-')):
    raise ImproperlyConfigured('DJANGO_SECRET_KEY must be at least 50 characters and not start with django-insecure- in production.')

# Host Configuration
_allowed_hosts_env = os.environ.get('DJANGO_ALLOWED_HOSTS')
if _allowed_hosts_env:
    ALLOWED_HOSTS = [h.strip() for h in _allowed_hosts_env.split(',') if h.strip()]
elif DEBUG:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]', 'testserver']
else:
    raise ImproperlyConfigured('DJANGO_ALLOWED_HOSTS environment variable must be set when DEBUG is False.')

# Demo Mode toggle: explicitly disabled in production configuration
DEMO_MODE = os.environ.get('DEMO_MODE', str(DEBUG and not IS_PRODUCTION)).lower() in ('true', '1', 'yes')
if not DEBUG and DEMO_MODE:
    DEMO_MODE = False

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'corsheaders',
    
    # AyuRAG Apps
    'accounts',
    'clinical',
]

AUTH_USER_MODEL = 'accounts.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database Configuration with Environment Support (SQLite / PostgreSQL)
_db_engine = os.environ.get('DB_ENGINE')

if IS_PRODUCTION:
    if not _db_engine:
        raise ImproperlyConfigured(
            'Production environment (DJANGO_ENV=production) requires DB_ENGINE to be explicitly configured '
            '(e.g. django.db.backends.postgresql). Silent fallback to SQLite is strictly forbidden in production.'
        )
    if 'sqlite' in _db_engine.lower() and os.environ.get('ALLOW_SQLITE_IN_PRODUCTION', 'False').lower() not in ('true', '1'):
        raise ImproperlyConfigured(
            f'SQLite database engine ({_db_engine}) is not permitted in production release. '
            'Please configure PostgreSQL (django.db.backends.postgresql) with dedicated credentials.'
        )

if _db_engine:
    DATABASES = {
        'default': {
            'ENGINE': _db_engine,
            'NAME': os.environ.get('DB_NAME', BASE_DIR / 'db.sqlite3'),
            'USER': os.environ.get('DB_USER', ''),
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),
            'HOST': os.environ.get('DB_HOST', ''),
            'PORT': os.environ.get('DB_PORT', ''),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Strengthened Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static & Media Asset Configuration
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Upload Size Limits
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5 MB

# REST Framework Configuration with Rate Limiting Throttles
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.authentication.CsrfExemptSessionAuthentication' if DEBUG else 'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '120/minute',
        'user': '600/minute',
    },
}

# CORS & CSRF Configuration
CORS_ALLOW_CREDENTIALS = True

_cors_env = os.environ.get('CORS_ALLOWED_ORIGINS')
if _cors_env:
    CORS_ALLOWED_ORIGINS = [orig.strip() for orig in _cors_env.split(',') if orig.strip()]
else:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5175',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]

if DEBUG:
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^http://(localhost|127\.0\.0\.1):[0-9]+$",
    ]
else:
    CORS_ALLOWED_ORIGIN_REGEXES = []

_csrf_env = os.environ.get('CSRF_TRUSTED_ORIGINS')
if _csrf_env:
    CSRF_TRUSTED_ORIGINS = [orig.strip() for orig in _csrf_env.split(',') if orig.strip()]
else:
    CSRF_TRUSTED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5175',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]

# Session and Cookie Behavior
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

# Production Security Headers & SSL Hardening
if not DEBUG:
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'True').lower() in ('true', '1')
    CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'True').lower() in ('true', '1')
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

    # Reverse proxy HTTPS awareness
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = os.environ.get('DJANGO_SECURE_SSL_REDIRECT', 'False').lower() in ('true', '1')

    # HTTP Strict Transport Security (HSTS)
    _hsts_seconds = int(os.environ.get('DJANGO_SECURE_HSTS_SECONDS', '31536000'))
    if _hsts_seconds > 0:
        SECURE_HSTS_SECONDS = _hsts_seconds
        SECURE_HSTS_INCLUDE_SUBDOMAINS = True
        SECURE_HSTS_PRELOAD = True

# Structured Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{asctime}] {levelname} {name} {module}:{lineno} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose' if not DEBUG else 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING' if not DEBUG else 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'clinical': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'accounts': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
