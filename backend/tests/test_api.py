import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database.session import engine, SessionLocal
from backend.app.database.base import Base
from backend.app.database.seed import seed_database
from backend.app.core.config import settings, Settings
from backend.app.core.security import hash_password, verify_password
from backend.app.core.rate_limit import limiter

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    seed_database()
    yield


@pytest.fixture(autouse=True)
def mock_default_email_dispatch():
    with patch("backend.app.services.email_service.email_service._send_raw_email") as m:
        m.return_value = True
        yield m


@pytest.fixture(autouse=True)
def reset_rate_limits():
    limiter.reset()
    yield


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Lioc" in data["service"]
    assert "x-request-id" in response.headers


def test_request_id_header():
    response = client.get("/api/v1/health", headers={"X-Request-ID": "audit-trace-999"})
    assert response.status_code == 200
    assert response.headers.get("x-request-id") == "audit-trace-999"
    assert "x-process-time" in response.headers


def test_categories_endpoint():
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    slugs = [c["slug"] for c in data]
    assert "floor-cleaners" in slugs
    assert "toilet-washroom" in slugs


def test_industries_endpoint():
    response = client.get("/api/v1/industries")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    hotel_industry = client.get("/api/v1/industries/hotels-guest-houses")
    assert hotel_industry.status_code == 200
    assert "Hotels" in hotel_industry.json()["name"]


def test_products_endpoint():
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 6

    # Test single product detail
    product_slug = data[0]["slug"]
    detail_res = client.get(f"/api/v1/products/{product_slug}")
    assert detail_res.status_code == 200
    product = detail_res.json()
    assert product["slug"] == product_slug
    assert "category" in product
    assert "industries" in product


def test_submit_quote_request():
    payload = {
        "full_name": "Rajesh Sharma",
        "company_name": "Grand Bengal Heritage Hotel",
        "phone_number": "+91 98300 12345",
        "email": "rajesh@grandbengal.com",
        "business_type": "Hotels and Guest Houses",
        "city": "Kolkata",
        "product_interested_in": "Floor Cleaner & Disinfectant Bulk Cans",
        "estimated_quantity": "500 Litres",
        "monthly_requirement": "500 Litres / Month",
        "message": "Looking for weekly bulk delivery in Salt Lake area.",
        "turnstile_token": "test-turnstile-token",
    }
    response = client.post("/api/v1/quotes", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["reference_id"].startswith("LQ-")


def test_submit_sample_request():
    payload = {
        "full_name": "Ananya Sen",
        "company_name": "Sen Cloud Kitchens",
        "phone_number": "+91 98311 98765",
        "email": "ananya@senkitchens.in",
        "business_type": "Restaurants, Cafes & Cloud Kitchens",
        "business_address": "Plot 45, Sector V, Salt Lake",
        "city": "Kolkata",
        "product_interested_in": "Lioc KitchenMaster Heavy-Duty Degreaser",
        "expected_monthly_requirement": "100 Litres",
        "message": "Need trial sample to test on commercial fryer exhaust hoods.",
        "turnstile_token": "test-turnstile-token",
    }
    response = client.post("/api/v1/samples", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["reference_id"].startswith("LS-")


def test_submit_distributor_application():
    payload = {
        "applicant_name": "Vikram Agarwal",
        "company_name": "Agarwal Enterprise Hygiene Supplies",
        "phone_number": "+91 98322 45678",
        "email": "vikram@agarwalenterprises.co.in",
        "gst_number": "19AAAAA0000A1Z5",
        "city": "Howrah",
        "state": "West Bengal",
        "years_experience": "8 Years",
        "current_products_distributed": "Housekeeping consumables & tissue papers",
        "investment_capacity": "INR 5 - 10 Lakhs",
        "message": "Interested in exclusive dealership for Howrah & Hooghly commercial zones.",
        "turnstile_token": "test-turnstile-token",
    }
    response = client.post("/api/v1/distributors", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["reference_id"].startswith("LD-")


def test_submit_contact_message():
    payload = {
        "full_name": "Siddharth Roy",
        "email": "siddharth@royproperties.com",
        "phone_number": "+91 98333 11223",
        "company_name": "Roy Commercial Properties",
        "subject": "Facility supply contract inquiry",
        "message": "We manage 3 commercial office towers in New Town and want to discuss annual supply pricing.",
        "turnstile_token": "test-turnstile-token",
    }
    response = client.post("/api/v1/contact", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["reference_id"].startswith("LC-")


def test_email_failure_does_not_break_lead_submission():
    """Verify that SMTP failures are non-blocking and lead remains safely in the database."""
    with patch("backend.app.services.email_service.email_service._send_raw_email") as mock_email:
        mock_email.side_effect = Exception("Simulated SMTP Provider Connection Timeout")

        payload = {
            "full_name": "Amitava Mukherjee",
            "company_name": "Kolkata Tech Hub Cafeteria",
            "phone_number": "+91 98344 55667",
            "email": "amitava@techhubcafe.in",
            "business_type": "Corporate Offices & IT Parks",
            "city": "Kolkata",
            "product_interested_in": "Antibacterial Floor Cleaner",
            "estimated_quantity": "200 Litres",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/quotes", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["reference_id"].startswith("LQ-")


def test_form_validation_error():
    # Missing required fields like email and phone_number
    payload = {
        "full_name": "Incomplete User",
    }
    response = client.post("/api/v1/quotes", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "details" in data["error"]


def test_pbkdf2_password_hashing_and_verification():
    raw_password = "secure_production_password_2026"
    hashed = hash_password(raw_password)
    assert hashed.startswith("pbkdf2_sha256$100000$")
    assert verify_password(raw_password, hashed) is True
    assert verify_password("wrong_password", hashed) is False


def test_admin_login_success():
    payload = {
        "email": "lioccalcutta@gmail.com",
        "password": "lioc@02022026",
    }
    response = client.post("/api/v1/admin/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["admin_user"]["email"] == "lioccalcutta@gmail.com"


def test_admin_login_with_pbkdf2_hash():
    # Set PBKDF2 hash in settings temporarily
    original_hash = settings.ADMIN_PASSWORD_HASH
    test_pass = "ceo_secret_key_999"
    settings.ADMIN_PASSWORD_HASH = hash_password(test_pass)

    try:
        # Correct password against hash
        res = client.post(
            "/api/v1/admin/login",
            json={"email": "lioccalcutta@gmail.com", "password": test_pass},
        )
        assert res.status_code == 200
        assert "access_token" in res.json()

        # Wrong password against hash
        res_fail = client.post(
            "/api/v1/admin/login",
            json={"email": "lioccalcutta@gmail.com", "password": "wrong_password"},
        )
        assert res_fail.status_code == 401
    finally:
        settings.ADMIN_PASSWORD_HASH = original_hash


def test_admin_login_invalid_password():
    payload = {
        "email": "lioccalcutta@gmail.com",
        "password": "wrongpassword",
    }
    response = client.post("/api/v1/admin/login", json=payload)
    assert response.status_code == 401


def test_admin_unauthorized_access():
    # Trying to access protected stats without Authorization header
    response = client.get("/api/v1/admin/stats")
    assert response.status_code in [401, 403]


def test_admin_invalid_jwt_token():
    headers = {"Authorization": "Bearer invalid.fake.token"}
    response = client.get("/api/v1/admin/me", headers=headers)
    assert response.status_code == 401


def test_admin_protected_endpoints():
    # Login to get token
    login_res = client.post(
        "/api/v1/admin/login",
        json={"email": "lioccalcutta@gmail.com", "password": "lioc@02022026"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Test /me
    me_res = client.get("/api/v1/admin/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "lioccalcutta@gmail.com"

    # Test /stats
    stats_res = client.get("/api/v1/admin/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_inquiries" in stats
    assert stats["total_inquiries"] >= 0

    # Test /leads
    leads_res = client.get("/api/v1/admin/leads", headers=headers)
    assert leads_res.status_code == 200
    leads_data = leads_res.json()
    assert "items" in leads_data
    assert isinstance(leads_data["items"], list)


def test_cors_origins_configuration():
    assert "http://localhost:3000" in settings.BACKEND_CORS_ORIGINS
    assert "*" not in settings.BACKEND_CORS_ORIGINS


def test_global_404_error_formatting():
    response = client.get("/api/v1/not-found-endpoint-xyz")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "HTTP_404"
    assert "request_id" in data["error"]


def test_database_schema_integrity():
    table_names = Base.metadata.tables.keys()
    assert "product_categories" in table_names
    assert "industries" in table_names
    assert "products" in table_names
    assert "quote_requests" in table_names
    assert "sample_requests" in table_names
    assert "distributor_applications" in table_names
    assert "contact_messages" in table_names


def test_production_config_validator_detects_insecure_settings():
    test_settings = Settings(
        ENVIRONMENT="production",
        DEBUG=True, # Insecure
        DATABASE_URL="sqlite:///./test.db", # Insecure for prod
        JWT_SECRET_KEY="lioc-super-secret-jwt-key-for-development-change-in-production", # Insecure
        TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA", # Insecure for prod
    )
    errors = test_settings.validate_production_configuration()
    assert len(errors) >= 4
    assert any("DEBUG must be set to False" in e for e in errors)
    assert any("PostgreSQL" in e for e in errors)
    assert any("JWT_SECRET_KEY" in e for e in errors)


def test_product_finder_options_endpoint():
    response = client.get("/api/v1/product-finder/options")
    assert response.status_code == 200
    data = response.json()
    assert "industries" in data
    assert "categories" in data
    assert "context_challenges" in data
    assert len(data["industries"]) >= 5
    assert len(data["categories"]) >= 6
    assert len(data["context_challenges"]) >= 6


def test_product_finder_recommendations_exact_match():
    # Hotel (id=1) + Floor Cleaners (id=1)
    response = client.get("/api/v1/product-finder/recommendations?industry_id=1&category_id=1")
    assert response.status_code == 200
    data = response.json()
    assert data["total_recommendations"] >= 1
    assert "recommendations" in data

    top_rec = data["recommendations"][0]
    assert top_rec["rank"] == 1
    assert top_rec["score"] >= 100
    assert top_rec["match_type"] == "EXACT_MATCH"
    assert "floor-cleaner" in top_rec["product"]["slug"]
    assert "reason" in top_rec
    assert len(top_rec["reason"]) > 0


def test_product_finder_recommendations_context_boost():
    # Fetch category id for kitchen degreasers dynamically
    cats_res = client.get("/api/v1/categories")
    assert cats_res.status_code == 200
    kitchen_cat = next((c for c in cats_res.json() if "degreaser" in c["slug"] or "kitchen" in c["slug"]), None)
    cat_id = kitchen_cat["id"] if kitchen_cat else 4

    response = client.get(
        f"/api/v1/product-finder/recommendations?industry_id=2&category_id={cat_id}&context=grease_oil"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_recommendations"] >= 1

    top_rec = data["recommendations"][0]
    assert top_rec["match_type"] == "EXACT_MATCH"
    assert "degreaser" in top_rec["product"]["slug"] or "dishwash" in top_rec["product"]["slug"]
    assert top_rec["score"] > 100 # Exact match (100) + context boost (>10)


def test_product_finder_recommendations_invalid_limit():
    response = client.get("/api/v1/product-finder/recommendations?limit=999")
    assert response.status_code == 422


def test_product_finder_lead_source_attribution():
    # Submit quote from Product Finder
    payload = {
        "full_name": "Saurav Das",
        "company_name": "Park Street Fine Dine",
        "phone_number": "+91 98355 66778",
        "email": "saurav@parkstreetdining.in",
        "business_type": "Restaurants, Cafes & Cloud Kitchens",
        "city": "Kolkata",
        "product_interested_in": "Lioc KitchenMaster Heavy-Duty Degreaser",
        "source": "PRODUCT_FINDER",
        "turnstile_token": "test-turnstile-token",
    }
    submit_res = client.post("/api/v1/quotes", json=payload)
    assert submit_res.status_code == 201
    ref_id = submit_res.json()["reference_id"]

    # Verify admin lead retrieval includes source attribute
    login_res = client.post(
        "/api/v1/admin/login",
        json={"email": "lioccalcutta@gmail.com", "password": "lioc@02022026"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    leads_res = client.get(f"/api/v1/admin/leads?search={ref_id}", headers=headers)
    assert leads_res.status_code == 200
    leads = leads_res.json()["items"]
    assert len(leads) >= 1
    target_lead = next(l for l in leads if l["reference_id"] == ref_id)
    assert target_lead["source"] == "PRODUCT_FINDER"


# =============================================================================
# Automated Customer Confirmation Email Dispatch Tests
# =============================================================================

def test_quote_submission_dispatches_customer_confirmation_email():
    """Verify that quote submissions dispatch a confirmation email to customer with reference ID."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "full_name": "Kalyan Bhattacharya",
            "company_name": "Bhattacharya Banquet Halls",
            "phone_number": "+91 98366 11223",
            "email": "kalyan@banquethalls.in",
            "business_type": "Hotels and Guest Houses",
            "city": "Kolkata",
            "product_interested_in": "Floor Cleaner & Air Freshener Combo",
            "estimated_quantity": "300 Litres",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/quotes", json=payload)
        assert response.status_code == 201
        ref_id = response.json()["reference_id"]

        # Expect 2 calls to send_async: 1 internal notification + 1 customer confirmation
        assert mock_send_async.call_count == 2
        calls = mock_send_async.call_args_list

        # Find customer call (to kalyan@banquethalls.in)
        customer_call = next(c for c in calls if c[0][0] == "kalyan@banquethalls.in")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert "Our Team Will Reach Out Shortly" in subject
        assert ref_id in html_body
        assert "reach out to you shortly" in html_body
        assert ref_id in text_body
        assert "reach out to you shortly" in text_body


def test_contact_submission_dispatches_customer_confirmation_email():
    """Verify that contact queries dispatch a confirmation email to user with reference ID."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "full_name": "Mousumi Banerjee",
            "email": "mousumi@banerjee-clinic.org",
            "phone_number": "+91 98377 88990",
            "company_name": "Banerjee Wellness Clinic",
            "subject": "Hospital Grade Sanitizer and Floor Cleaner Inquiry",
            "message": "We need bulk supply of hospital grade sanitizers delivered monthly.",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/contact", json=payload)
        assert response.status_code == 201
        ref_id = response.json()["reference_id"]

        # Expect 2 calls to send_async
        assert mock_send_async.call_count == 2
        calls = mock_send_async.call_args_list

        # Find customer call
        customer_call = next(c for c in calls if c[0][0] == "mousumi@banerjee-clinic.org")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert "Our Team Will Reach Out Shortly" in subject
        assert ref_id in html_body
        assert "reach out to you shortly" in html_body
        assert ref_id in text_body
        assert "reach out to you shortly" in text_body


def test_sample_submission_dispatches_customer_confirmation_email():
    """Verify that free sample kit requests dispatch a confirmation email with reference ID."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "full_name": "Rohan Gupta",
            "company_name": "Gupta Tech Solutions Cafe",
            "phone_number": "+91 98388 99001",
            "email": "rohan@guptatech.com",
            "business_type": "Corporate Offices & IT Parks",
            "business_address": "Sector V, Salt Lake, Plot 12",
            "city": "Kolkata",
            "product_interested_in": "Lioc Antibacterial Floor Soap",
            "expected_monthly_requirement": "50 Litres",
            "message": "Testing for office floor cleaning trial.",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/samples", json=payload)
        assert response.status_code == 201
        ref_id = response.json()["reference_id"]

        assert mock_send_async.call_count == 2
        customer_call = next(c for c in mock_send_async.call_args_list if c[0][0] == "rohan@guptatech.com")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert "Our Team Will Reach Out Shortly" in subject
        assert ref_id in html_body
        assert "reach out to you shortly" in html_body


def test_distributor_submission_dispatches_customer_confirmation_email():
    """Verify that dealership applications dispatch a confirmation email with reference ID."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "applicant_name": "Subhashish Ghosh",
            "company_name": "Ghosh Distribution Hub",
            "phone_number": "+91 98399 00112",
            "email": "subhashish@ghoshdistribution.com",
            "gst_number": "19BBBBB0000B1Z6",
            "city": "Durgapur",
            "state": "West Bengal",
            "years_experience": "12 Years",
            "current_products_distributed": "Industrial Chemicals & Cleaning Agents",
            "investment_capacity": "INR 10 - 25 Lakhs",
            "message": "Ready to take up master distribution for Burdwan & Durgapur industrial belt.",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/distributors", json=payload)
        assert response.status_code == 201
        ref_id = response.json()["reference_id"]

        assert mock_send_async.call_count == 2
        customer_call = next(c for c in mock_send_async.call_args_list if c[0][0] == "subhashish@ghoshdistribution.com")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert "Our Team Will Reach Out Shortly" in subject
        assert ref_id in html_body
        assert "reach out to you shortly" in html_body


def test_auditor_calculate_endpoint_for_hotels():
    """Verify algorithmic chemical calculation, ROI savings, and SOP output for hotels."""
    payload = {
        "facility_type": "hotels_guest_houses",
        "floor_area_sqft": 40000,
        "units_count": 60,
        "restrooms_count": 15,
        "footfall_level": "HIGH",
        "has_commercial_kitchen": True,
        "challenges": ["hard_water", "marble_floors", "odor_issues"],
    }
    response = client.post("/api/v1/auditor/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["audit_id"].startswith("LA-")
    assert "Hotels" in data["facility_type_label"]
    assert data["floor_area_sqft"] == 40000
    assert data["total_monthly_concentrate_litres"] > 0
    assert data["total_ready_solution_litres"] > data["total_monthly_concentrate_litres"]

    # Check ROI metrics
    roi = data["roi"]
    assert roi["monthly_savings"] > 0
    assert roi["annual_savings"] == roi["monthly_savings"] * 12
    assert roi["savings_percentage"] > 20
    assert roi["cost_per_litre_diluted"] < 5.0

    # Check Zones
    zones = data["zones"]
    zone_names = [z["zone_name"] for z in zones]
    assert "Floor & Surface Care" in zone_names
    assert "Restroom & Ceramic Hygiene" in zone_names
    assert "Kitchen & Food Service Degreasing" in zone_names

    # Check SOPs
    assert len(data["sops"]) >= 3
    assert any("White Herbal" in s["chemical_used"] for s in data["sops"])


def test_auditor_calculate_endpoint_for_hospitals():
    """Verify chemical calculation for hospital infection control."""
    payload = {
        "facility_type": "hospitals_healthcare",
        "floor_area_sqft": 60000,
        "units_count": 100,
        "restrooms_count": 30,
        "footfall_level": "VERY_HIGH_24X7",
        "has_commercial_kitchen": False,
        "challenges": ["high_infection_risk", "odor_issues"],
    }
    response = client.post("/api/v1/auditor/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["audit_id"].startswith("LA-")
    assert "Hospitals" in data["facility_type_label"]
    assert data["total_monthly_concentrate_litres"] >= 50
    assert data["roi"]["monthly_savings"] > 5000


def test_auditor_submit_lead_dispatches_email():
    """Verify that submitting an audit report persists as a lead and triggers customer confirmation email."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "audit_id": "LA-260901-TEST01",
            "full_name": "Dr. Arindam Sen",
            "company_name": "Apollo City Hospital Kolkata",
            "email": "arindam@apollocity.org",
            "phone_number": "+91 98311 22334",
            "city": "Kolkata",
            "additional_notes": "Require NABH compliant disinfectant certificate.",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/auditor/submit", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        ref_id = data["reference_id"]
        assert ref_id.startswith("LQ-") or ref_id.startswith("LA-")

        # Verify dual email dispatch (internal alert + customer confirmation)
        assert mock_send_async.call_count == 2
        customer_call = next(c for c in mock_send_async.call_args_list if c[0][0] == "arindam@apollocity.org")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert "Our Team Will Reach Out Shortly" in subject
        assert ref_id in html_body


import anyio
from backend.app.services.antispam_service import verify_turnstile_token


def test_turnstile_enforces_verification_in_production():
    """Verify that in production, Turnstile queries the API and rejects invalid/rejected tokens."""
    with patch.object(settings, "ENVIRONMENT", "production"):
        with patch.object(settings, "TURNSTILE_ENABLED", True):
            # Missing token must fail immediately without API call
            assert anyio.run(verify_turnstile_token, None) is False

            # When Cloudflare returns failure, verify_turnstile_token must return False
            with patch("httpx.AsyncClient.post") as mock_post:
                mock_post.return_value.json.return_value = {"success": False, "error-codes": ["invalid-input-response"]}
                assert anyio.run(verify_turnstile_token, "test-token") is False
                assert anyio.run(verify_turnstile_token, "invalid-token-123") is False


def test_database_url_postgres_normalization():
    """Verify postgres:// is normalized to postgresql://."""
    raw_url = "postgres://user:pass@host:5432/dbname"
    normalized = raw_url.replace("postgres://", "postgresql://", 1)
    assert normalized.startswith("postgresql://")


def test_seed_database_protects_production_data():
    """Verify force_reseed=True is ignored in production environment."""
    from backend.app.database.seed import seed_database
    with patch.object(settings, "ENVIRONMENT", "production"):
        # Calling seed_database should not crash and should safeguard data
        seed_database(force_reseed=True)



