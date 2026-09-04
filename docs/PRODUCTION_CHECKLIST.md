# 📋 Lioc B2B Platform — Production Readiness & Deployment Checklist

This document serves as the mandatory pre-launch operational checklist for the Lioc engineering and DevOps team prior to pointing live DNS records and driving commercial traffic.

---

## 1. 🗄️ Database & Persistence
- [x] **Alembic Migrations Configured**: `backend/alembic.ini` and `backend/alembic/env.py` configured with `Base.metadata` and dynamic `DATABASE_URL`.
- [x] **Initial Schema Revision Created**: `001_initial_schema.py` generated covering all 8 tables and performance indexes.
- [ ] **Production PostgreSQL Provisioned**: Managed PostgreSQL database instance created (e.g., Neon, Supabase, AWS RDS, or Render).
- [ ] **Production Migrations Applied**: Executed `alembic upgrade head` against the live PostgreSQL database.
- [ ] **Automated Backup Strategy Configured**: Daily automated WAL-level or snapshot backups scheduled with minimum 14-day retention.
- [x] **Connection Pooling Configured**: SQLAlchemy configured with `pool_size=10`, `max_overflow=20`, `pool_recycle=1800`, `pool_pre_ping=True`.

---

## 2. 🔐 Security & Access Control
- [x] **Environment Variable Isolation**: `.env` and `.env.local` added to `.gitignore` to prevent secret leakage.
- [ ] **Production Secrets Generated**: `JWT_SECRET_KEY` generated using a cryptographically secure 64-character random hex string (`python -c "import secrets; print(secrets.token_hex(32))"`).
- [ ] **CEO Admin Password Hardened**: `ADMIN_PASSWORD` updated in production environment to a high-entropy passphrase.
- [x] **JWT Authentication Tested**: Stateless HS256 tokens configured with 7-day expiration and protected bearer dependencies.
- [x] **Rate Limiting Active**: `slowapi` rate limiter active on `POST /api/v1/admin/login` (5/min) and public lead forms (5/10min).
- [x] **Anti-Spam Bot Protection Active**: Cloudflare Turnstile verification active on all 4 public form endpoints (`/quotes`, `/samples`, `/distributors`, `/contact`).
- [ ] **Live Turnstile Keys Configured**: Production `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` replaced in `.env` and `.env.local`.
- [x] **CORS Origins Restricted**: Wildcard `*` disabled; origins restricted via `BACKEND_CORS_ORIGINS` to trusted domains (`http://localhost:3000`, `https://lioc.in`, `https://www.lioc.in`).

---

## 3. ⚙️ Application & Server Configuration
- [x] **Debug Mode Disabled**: Set `DEBUG=False` in production environment to suppress OpenAPI docs and internal stack traces.
- [x] **Structured Logging Active**: Logging configured with timestamps, log levels, sanitized credential scrubbing, and `X-Request-ID` tracing.
- [x] **Global Error Handlers**: Consistent JSON error formatting returning standard HTTP error codes (`400`, `401`, `404`, `422`, `429`, `500`).
- [x] **Health Check Endpoint**: `/api/v1/health` operational for load balancer heartbeat probes.
- [x] **Docker Containerization Ready**: Backend `Dockerfile` configured with non-root runtime, `PYTHONPATH=/app`, health checks, and `uvicorn app.main:app`.
- [x] **Docker Compose Configured**: `docker-compose.yml` updated with PostgreSQL healthchecks and environment variable bindings.

---

## 4. ✉️ Communication & Lead Notification Channels
- [x] **Non-blocking Email Dispatch**: Lead submissions persist to database first; email notifications dispatch asynchronously in worker thread pool.
- [ ] **Production SMTP / Transactional Email Provider**: Configured SMTP credentials (or Resend/SendGrid API) with verified sender domain (`lioccalcutta@gmail.com` / `orders@lioc.in`).
- [x] **One-Click WhatsApp Integration**: Pre-filled contextual WhatsApp links active for instant sales escalation with unique tracking IDs (`LQ-`, `LS-`, `LD-`, `LC-`).
- [x] **Executive Lead Management**: CEO Executive Dashboard operational at `/admin` with live search, status management, Call/WhatsApp/Email triggers, and CSV export.

---

## 5. 🌐 Legal & Compliance Pages
- [x] **Privacy Policy Active**: Route `/privacy-policy` live with brand styling, data collection disclosures, and marked legal review placeholders.
- [x] **Commercial Terms Active**: Route `/terms` live with B2B quotation rules, sample evaluation conditions, and distribution policies.
- [ ] **Final Legal Review**: Qualified legal counsel reviewed Indian commercial law jurisdiction and limitation of liability clauses.

---

## 6. 🧪 Testing & Verification
- [x] **Automated Pytest Suite**: 17+ integration tests passing with 100% success rate.
- [x] **Frontend TypeScript Verification**: Zero TypeScript errors (`npx tsc --noEmit`).
- [x] **Next.js Production Build**: Production bundle build verified.
- [ ] **SSL / TLS Certificate**: HTTPS certificate provisioned via Cloudflare or Let's Encrypt with automated renewal.
- [ ] **Domain & DNS Propagation**: Apex domain (`lioc.in`) and `www` CNAME records pointed to production servers.
