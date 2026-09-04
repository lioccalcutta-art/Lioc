import sys
import sqlite3
import csv
from datetime import datetime
from pathlib import Path

# Ensure utf-8 encoding on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

DB_PATH = Path(__file__).resolve().parent / "lioc.db"

def get_connection():
    if not DB_PATH.exists():
        print(f"[!] Database not found at: {DB_PATH}")
        sys.exit(1)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def show_summary():
    conn = get_connection()
    cur = conn.cursor()
    
    print("\n" + "=" * 80)
    print(">> LIOC B2B CUSTOMER INQUIRIES & LEADS SUMMARY")
    print("=" * 80)
    
    tables = [
        ("quote_requests", "[1] Quote Requests (RFQ)"),
        ("sample_requests", "[2] Evaluation Sample Requests"),
        ("distributor_applications", "[3] Distributor Applications"),
        ("contact_messages", "[4] General Contact Messages"),
    ]
    
    for table_name, title in tables:
        count = cur.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()[0]
        print(f"\n{title} (Total: {count})")
        print("-" * 80)
        
        rows = cur.execute(f"SELECT * FROM {table_name} ORDER BY created_at DESC LIMIT 5").fetchall()
        if not rows:
            print("  (No inquiries yet)")
            continue
            
        for r in rows:
            ref = r["reference_id"] if "reference_id" in r.keys() else "N/A"
            name = r["full_name"] if "full_name" in r.keys() else (r["applicant_name"] if "applicant_name" in r.keys() else "N/A")
            company = r["company_name"] if "company_name" in r.keys() else "N/A"
            phone = r["phone_number"] if "phone_number" in r.keys() else "N/A"
            city = r["city"] if "city" in r.keys() else "N/A"
            created = str(r["created_at"])[:16]
            status = r["status"] if "status" in r.keys() else "N/A"
            
            detail = ""
            if "product_interested_in" in r.keys() and r["product_interested_in"]:
                detail = f" | Product: {r['product_interested_in']}"
            elif "message" in r.keys() and r["message"]:
                msg = r["message"][:40] + "..." if len(r["message"]) > 40 else r["message"]
                detail = f" | Msg: {msg}"
                
            print(f"  [{ref}] {created} | {name} ({company}, {city}) | 📞 {phone} | Status: {status}{detail}")

    print("\n" + "=" * 80)
    print("💡 Tip: Run 'python view_leads.py --export' to export all leads into CSV files.")
    print("=" * 80 + "\n")
    conn.close()

def export_csv():
    conn = get_connection()
    cur = conn.cursor()
    
    export_dir = Path(__file__).resolve().parent / "leads_export"
    export_dir.mkdir(exist_ok=True)
    
    tables = ["quote_requests", "sample_requests", "distributor_applications", "contact_messages"]
    
    for table in tables:
        rows = cur.execute(f"SELECT * FROM {table} ORDER BY created_at DESC").fetchall()
        if not rows:
            continue
        
        file_path = export_dir / f"{table}.csv"
        with open(file_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(rows[0].keys())
            for row in rows:
                writer.writerow(list(row))
        print(f"✅ Exported {len(rows)} records to: {file_path}")
        
    print(f"\n🎉 All leads exported to folder: {export_dir.resolve()}\n")
    conn.close()

if __name__ == "__main__":
    if "--export" in sys.argv:
        export_csv()
    else:
        show_summary()
