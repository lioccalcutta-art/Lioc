# 🗄️ Lioc B2B Platform — Database Backup & Disaster Recovery Plan

**Target Database:** PostgreSQL 16  
**Primary Application Database:** `lioc_production_db` / `lioc_db`  
**Responsible Team:** Lioc DevOps & Senior Engineering  
**Version:** 1.0 (Production Hardened)

---

## 1. ⏱️ Backup Schedule & Retention Policy

| Backup Type | Frequency | Execution Window | Retention Period | Storage Target |
| :--- | :--- | :--- | :--- | :--- |
| **Full Logical Dump (`pg_dump`)** | Daily | 02:00 UTC (07:30 AM IST) | 30 Days | Encrypted S3 / Cloud Storage |
| **Weekly Archive** | Every Sunday | 03:00 UTC | 90 Days | Off-site Cold Storage / Glacier |
| **Pre-Deployment Snapshot** | Ad-hoc | Before executing `alembic upgrade head` | 14 Days | Local & Remote Staging Vault |
| **Write-Ahead Logs (WAL / PITR)** | Continuous | Real-time stream (if enabled on managed RDS/Neon) | 7 Days | Managed Provider Storage |

---

## 2. 💾 Automated Backup Command

To generate a compressed, timestamped custom-format PostgreSQL dump:

```bash
# Set timestamp and filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="/backups/lioc_backup_${TIMESTAMP}.dump"

# Execute pg_dump with custom compressed format
pg_dump \
  -h "${DB_HOST:-localhost}" \
  -p "${DB_PORT:-5432}" \
  -U "${DB_USER:-lioc_prod_user}" \
  -d "${DB_NAME:-lioc_production_db}" \
  -F c \
  -b \
  -v \
  -f "${BACKUP_FILE}"

# Encrypt backup file with GPG or AWS KMS before off-site upload
gpg --symmetric --cipher-algo AES256 "${BACKUP_FILE}"
```

---

## 3. 🔄 Disaster Recovery & Restore Procedure

### Step 1: Pre-Restore Verification
1. Ensure the target database service is active and accessible.
2. Confirm the backup file checksum (`sha256sum ${BACKUP_FILE}`).

### Step 2: Terminate Active Connections
```sql
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'lioc_production_db' AND pid <> pg_backend_pid();
```

### Step 3: Database Recreation (Clean Restore)
```bash
# Drop and recreate database
dropdb -h "${DB_HOST}" -U "${DB_USER}" --if-exists lioc_production_db
createdb -h "${DB_HOST}" -U "${DB_USER}" lioc_production_db
```

### Step 4: Execute Database Restore (`pg_restore`)
```bash
pg_restore \
  -h "${DB_HOST:-localhost}" \
  -p "${DB_PORT:-5432}" \
  -U "${DB_USER:-lioc_prod_user}" \
  -d "${DB_NAME:-lioc_production_db}" \
  -v \
  --clean \
  --if-exists \
  "${BACKUP_FILE}"
```

### Step 5: Post-Restore Verification & Migration Check
1. Verify table counts and row integrity:
   ```sql
   SELECT count(*) FROM quote_requests;
   SELECT count(*) FROM sample_requests;
   SELECT count(*) FROM distributor_applications;
   SELECT count(*) FROM contact_messages;
   SELECT count(*) FROM products;
   ```
2. Verify Alembic migration version table:
   ```bash
   alembic current
   ```
3. Run API health check:
   ```bash
   curl -f http://localhost:8000/api/v1/health
   ```

---

## 4. 🛡️ Verification & Routine Drill
* **Quarterly Restoration Drill**: Every 90 days, the DevOps engineer must restore the latest production backup dump onto a dedicated isolated staging database and run `backend/tests/test_api.py` to prove zero-data corruption.
* **Alerting**: Failure of daily backup jobs must immediately dispatch an urgent webhook alert to the DevOps Discord/Slack channel and `lioccalcutta@gmail.com`.
