import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional, Dict, Any
from concurrent.futures import ThreadPoolExecutor
from backend.app.core.config import settings
from backend.app.models.leads import (
    QuoteRequest,
    SampleRequest,
    DistributorApplication,
    ContactMessage,
)

logger = logging.getLogger("lioc.email_service")
executor = ThreadPoolExecutor(max_workers=4)


class EmailService:
    def __init__(self):
        self.recipient_email = settings.NOTIFICATION_EMAIL
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER.strip() if settings.SMTP_USER else ""
        self.smtp_password = settings.SMTP_PASSWORD.replace(" ", "").strip() if settings.SMTP_PASSWORD else ""
        self.smtp_tls = settings.SMTP_TLS
        self.enabled = settings.EMAILS_ENABLED
        self.company_name = settings.COMPANY_NAME
        self.company_email = settings.COMPANY_EMAIL
        self.whatsapp_number = settings.WHATSAPP_NUMBER
        self.primary_phone = settings.COMPANY_PHONE
        self.company_address = settings.COMPANY_ADDRESS

    def _send_raw_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: str,
        sender_name: Optional[str] = None,
        reply_to: Optional[str] = None,
    ) -> bool:
        """
        Internal synchronous email dispatcher with TLS support.
        Supports sending to admin or customer recipients with custom headers.
        """
        if not self.enabled:
            try:
                logger.info("[EMAIL DISABLED] To: %s | Subject: %s", to_email, subject)
            except Exception:
                pass
            return False

        if not self.smtp_password or not self.smtp_user:
            try:
                logger.info(
                    "[EMAIL DISPATCH SKIPPED - NO SMTP CREDENTIALS] Notification for '%s' to <%s> logged successfully. "
                    "To enable live SMTP dispatch, configure SMTP_PASSWORD in backend/.env.",
                    subject,
                    to_email,
                )
            except Exception:
                pass
            return False

        try:
            from_name = sender_name or f"{self.company_name} Commercial Team"
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{from_name} <{self.smtp_user}>"
            msg["To"] = to_email
            if reply_to:
                msg["Reply-To"] = reply_to
            else:
                msg["Reply-To"] = self.company_email

            # Attach plain text and HTML versions
            msg.attach(MIMEText(text_body, "plain", "utf-8"))
            msg.attach(MIMEText(html_body, "html", "utf-8"))

            server = smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=15)
            if self.smtp_tls:
                server.starttls()

            server.login(self.smtp_user, self.smtp_password)
            server.sendmail(self.smtp_user, [to_email], msg.as_string())
            server.quit()

            try:
                safe_subj = subject.encode("ascii", "replace").decode("ascii")
                logger.info("Email delivered to %s (Subject: %s)", to_email, safe_subj)
            except Exception:
                pass
            return True
        except Exception as e:
            try:
                safe_err = str(e).encode("ascii", "replace").decode("ascii")
                logger.error("Failed to send email to %s: %s", to_email, safe_err)
            except Exception:
                pass
            return False

    def send_async(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: str,
        sender_name: Optional[str] = None,
        reply_to: Optional[str] = None,
    ):
        """Dispatches email asynchronously in a background thread to prevent blocking client response."""
        executor.submit(
            self._send_raw_email,
            to_email,
            subject,
            html_body,
            text_body,
            sender_name,
            reply_to,
        )

    # -------------------------------------------------------------------------
    # HTML TEMPLATE BUILDERS
    # -------------------------------------------------------------------------

    def _build_admin_html_template(
        self,
        title: str,
        badge_text: str,
        badge_color: str,
        reference_id: str,
        fields: Dict[str, Any],
        action_phone: Optional[str] = None,
        action_email: Optional[str] = None,
    ) -> str:
        rows = ""
        for key, val in fields.items():
            if val is not None and str(val).strip():
                rows += f"""
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px 14px; font-weight: 600; color: #475569; width: 35%; vertical-align: top; font-size: 13px;">{key}</td>
                    <td style="padding: 10px 14px; color: #0f172a; font-size: 13px; vertical-align: top;">{str(val)}</td>
                </tr>
                """

        action_buttons = ""
        if action_phone:
            clean_phone = "".join(filter(str.isdigit, str(action_phone)))
            action_buttons += f"""
            <a href="tel:{action_phone}" style="display: inline-block; background-color: #0f766e; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin-right: 10px; margin-top: 8px;">📞 Call Customer</a>
            <a href="https://wa.me/{clean_phone}" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin-right: 10px; margin-top: 8px;">💬 WhatsApp Chat</a>
            """
        if action_email:
            action_buttons += f"""
            <a href="mailto:{action_email}?subject=Re: Inquiry from Lioc Website [{reference_id}]" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin-top: 8px;">✉️ Reply by Email</a>
            """

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>{title}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
            <div style="max-width: 620px; margin: 24px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <div style="background-color: #0d1527; padding: 24px 28px; border-bottom: 3px solid #14b8a6;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 1px;">LIOC<span style="color: #2dd4bf;">.</span></span>
                        <span style="background-color: {badge_color}; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">{badge_text}</span>
                    </div>
                    <div style="color: #94a3b8; font-size: 13px; margin-top: 6px;">New Inquiry Received on Lioc B2B Platform</div>
                </div>

                <!-- Reference Banner -->
                <div style="background-color: #f8fafc; padding: 14px 28px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
                    <span style="color: #64748b;">Tracking Reference: <strong style="color: #0f172a; font-family: monospace; font-size: 14px;">{reference_id}</strong></span>
                </div>

                <!-- Details Table -->
                <div style="padding: 24px 28px;">
                    <h2 style="font-size: 18px; margin: 0 0 16px 0; color: #0f172a;">{title}</h2>
                    <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                        <tbody>
                            {rows}
                        </tbody>
                    </table>

                    <!-- Quick Actions -->
                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Quick Actions for Sales Team</div>
                        {action_buttons}
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 16px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
                    This is an automated notification from the Lioc Commercial Website.<br>
                    Direct notification inbox: <a href="mailto:{self.recipient_email}" style="color: #0f766e; text-decoration: none;">{self.recipient_email}</a>
                </div>
            </div>
        </body>
        </html>
        """

    def _build_customer_html_template(
        self,
        customer_name: str,
        headline: str,
        message: str,
        badge_text: str,
        reference_id: str,
        fields: Dict[str, Any],
    ) -> str:
        """
        Builds a customer-facing confirmation email featuring Lioc branding,
        prominent Reference Tracking ID, summary of inquiry, and direct WhatsApp / Phone contact links.
        """
        rows = ""
        for key, val in fields.items():
            if val is not None and str(val).strip():
                rows += f"""
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 9px 12px; font-weight: 600; color: #64748b; width: 38%; vertical-align: top; font-size: 13px;">{key}</td>
                    <td style="padding: 9px 12px; color: #0f172a; font-size: 13px; vertical-align: top; font-weight: 500;">{str(val)}</td>
                </tr>
                """

        clean_wa = "".join(filter(str.isdigit, str(self.whatsapp_number)))
        wa_link = f"https://wa.me/91{clean_wa}?text=Hello%20Lioc%20Team%2C%20I%20have%20an%20inquiry%20regarding%20Ref%3A%20{reference_id}"

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{headline}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
            <div style="max-width: 600px; margin: 24px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0;">
                
                <!-- Premium Header -->
                <div style="background-color: #0d1527; padding: 28px 32px; border-bottom: 3px solid #14b8a6;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td>
                                <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 1.5px;">LIOC<span style="color: #2dd4bf;">.</span></span>
                                <div style="color: #94a3b8; font-size: 12px; font-weight: 500; margin-top: 4px; letter-spacing: 0.5px; text-transform: uppercase;">Commercial Cleaning & Hygiene Solutions</div>
                            </td>
                            <td style="text-align: right;">
                                <span style="background-color: rgba(20, 184, 166, 0.15); color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.3); font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 999px; text-transform: uppercase;">
                                    {badge_text}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Reference ID Highlight Card -->
                <div style="background: linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%); padding: 18px 32px; border-bottom: 1px solid #ccfbf1;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td>
                                <div style="font-size: 11px; font-weight: 700; color: #0f766e; text-transform: uppercase; letter-spacing: 0.5px;">Your Unique Reference ID</div>
                                <div style="font-size: 18px; font-weight: 800; color: #042f2e; font-family: 'Courier New', Courier, monospace; letter-spacing: 1px; margin-top: 2px;">{reference_id}</div>
                            </td>
                            <td style="text-align: right;">
                                <span style="background-color: #0d9488; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
                                    ✓ Received & Queued
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Main Content Body -->
                <div style="padding: 32px 32px 24px 32px;">
                    <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">{headline}</h1>
                    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
                        Dear <strong>{customer_name}</strong>,
                    </p>
                    <p style="font-size: 14px; color: #475569; margin: 0 0 20px 0;">
                        {message}
                    </p>

                    <!-- Summary Box -->
                    <div style="margin: 24px 0 20px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                        <div style="padding: 10px 16px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                            Summary of Your Submission
                        </div>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>

                    <!-- Direct Connect Assistance -->
                    <div style="background-color: #fafaf9; border-radius: 12px; padding: 20px; border: 1px dashed #cbd5e1; margin-top: 24px;">
                        <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
                            Need urgent assistance or direct technical consultation?
                        </div>
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 14px;">
                            You can connect with our Kolkata commercial desk immediately via WhatsApp or phone quoting reference <strong>{reference_id}</strong>.
                        </div>
                        <div>
                            <a href="{wa_link}" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 9px 16px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 12px; margin-right: 8px; margin-bottom: 6px;">
                                💬 WhatsApp Chat
                            </a>
                            <a href="tel:{self.primary_phone}" style="display: inline-block; background-color: #0f766e; color: #ffffff; padding: 9px 16px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 12px; margin-bottom: 6px;">
                                📞 Call {self.primary_phone}
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #0d1527; padding: 24px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #1e293b;">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">Lioc Commercial & Industrial Hygiene</div>
                    <div style="color: #64748b; margin-bottom: 12px; font-size: 11px;">
                        {self.company_address}
                    </div>
                    <div style="font-size: 11px; color: #475569;">
                        Direct Support: <a href="mailto:{self.company_email}" style="color: #2dd4bf; text-decoration: none;">{self.company_email}</a> | Phone: {self.primary_phone}
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

    # -------------------------------------------------------------------------
    # INTERNAL TEAM NOTIFICATIONS (TO ADMIN / SALES DESK)
    # -------------------------------------------------------------------------

    def send_quote_notification(self, quote: QuoteRequest):
        subject = f"🔔 [New Quote Request] {quote.company_name} — Ref: {quote.reference_id}"
        fields = {
            "Reference ID": quote.reference_id,
            "Customer Name": quote.full_name,
            "Company / Facility": quote.company_name,
            "Phone Number": quote.phone_number,
            "Email Address": quote.email,
            "Business Type": quote.business_type,
            "City / Location": quote.city,
            "Product Interested In": quote.product_interested_in or "Catalog Inquired",
            "Estimated Quantity": quote.estimated_quantity or "N/A",
            "Monthly Requirement": quote.monthly_requirement or "N/A",
            "Customer Note / Message": quote.message or "No specific message attached.",
        }
        text_body = f"""NEW BULK QUOTE REQUEST - LIOC B2B
---------------------------------------------
Reference ID: {quote.reference_id}
Customer Name: {quote.full_name}
Company Name: {quote.company_name}
Phone: {quote.phone_number}
Email: {quote.email}
Business Type: {quote.business_type}
City: {quote.city}
Product Interested: {quote.product_interested_in or 'Catalog'}
Estimated Quantity: {quote.estimated_quantity or 'N/A'}
Monthly Requirement: {quote.monthly_requirement or 'N/A'}
Message: {quote.message or 'N/A'}
---------------------------------------------
Lioc Commercial Sales Desk: {self.recipient_email}
"""
        html_body = self._build_admin_html_template(
            title="Bulk Quotation Request Details",
            badge_text="Quote Request",
            badge_color="#0f766e",
            reference_id=quote.reference_id,
            fields=fields,
            action_phone=quote.phone_number,
            action_email=quote.email,
        )
        self.send_async(self.recipient_email, subject, html_body, text_body)

    def send_sample_notification(self, sample: SampleRequest):
        subject = f"📦 [Free Sample Request] {sample.company_name} — Ref: {sample.reference_id}"
        fields = {
            "Reference ID": sample.reference_id,
            "Customer Name": sample.full_name,
            "Company / Facility": sample.company_name,
            "Phone Number": sample.phone_number,
            "Email Address": sample.email,
            "Business Type": sample.business_type,
            "Delivery Address": sample.business_address,
            "City / District": sample.city,
            "Product Requested": sample.product_interested_in,
            "Expected Monthly Requirement": sample.expected_monthly_requirement or "N/A",
            "Customer Message": sample.message or "N/A",
        }
        text_body = f"""NEW SAMPLE KIT REQUEST - LIOC B2B
---------------------------------------------
Reference ID: {sample.reference_id}
Customer Name: {sample.full_name}
Company Name: {sample.company_name}
Phone: {sample.phone_number}
Email: {sample.email}
Business Type: {sample.business_type}
Address: {sample.business_address}, {sample.city}
Product Requested: {sample.product_interested_in}
Expected Requirement: {sample.expected_monthly_requirement or 'N/A'}
Message: {sample.message or 'N/A'}
---------------------------------------------
Lioc Commercial Dispatch Desk: {self.recipient_email}
"""
        html_body = self._build_admin_html_template(
            title="Commercial Evaluation Sample Request",
            badge_text="Sample Kit",
            badge_color="#d97706",
            reference_id=sample.reference_id,
            fields=fields,
            action_phone=sample.phone_number,
            action_email=sample.email,
        )
        self.send_async(self.recipient_email, subject, html_body, text_body)

    def send_distributor_notification(self, dist: DistributorApplication):
        subject = f"🤝 [Distributor Application] {dist.company_name} ({dist.city}, {dist.state}) — Ref: {dist.reference_id}"
        fields = {
            "Reference ID": dist.reference_id,
            "Applicant Name": dist.applicant_name,
            "Company / Firm Name": dist.company_name,
            "Phone Number": dist.phone_number,
            "Email Address": dist.email,
            "GST Number": dist.gst_number or "Not Provided",
            "City & State": f"{dist.city}, {dist.state}",
            "Years in Business": dist.years_experience or "N/A",
            "Current Distributed Products": dist.current_products_distributed or "N/A",
            "Investment Capacity": dist.investment_capacity or "N/A",
            "Application Note": dist.message or "N/A",
        }
        text_body = f"""NEW DISTRIBUTOR PARTNERSHIP APPLICATION - LIOC B2B
---------------------------------------------
Reference ID: {dist.reference_id}
Applicant: {dist.applicant_name}
Company: {dist.company_name}
Phone: {dist.phone_number}
Email: {dist.email}
GST: {dist.gst_number or 'N/A'}
Location: {dist.city}, {dist.state}
Experience: {dist.years_experience or 'N/A'}
Products Distributed: {dist.current_products_distributed or 'N/A'}
Investment Capacity: {dist.investment_capacity or 'N/A'}
Message: {dist.message or 'N/A'}
---------------------------------------------
Lioc Channel Expansion: {self.recipient_email}
"""
        html_body = self._build_admin_html_template(
            title="Dealership / Territory Distributor Application",
            badge_text="Distributor Application",
            badge_color="#7c3aed",
            reference_id=dist.reference_id,
            fields=fields,
            action_phone=dist.phone_number,
            action_email=dist.email,
        )
        self.send_async(self.recipient_email, subject, html_body, text_body)

    def send_contact_notification(self, contact: ContactMessage):
        subject = f"💬 [Contact Inquiry] {contact.full_name} {f'({contact.company_name})' if contact.company_name else ''} — Ref: {contact.reference_id}"
        fields = {
            "Reference ID": contact.reference_id,
            "Sender Name": contact.full_name,
            "Email Address": contact.email,
            "Phone Number": contact.phone_number,
            "Company / Organization": contact.company_name or "N/A",
            "Subject": contact.subject or "General Commercial Inquiry",
            "Message / Inquiry": contact.message,
        }
        text_body = f"""NEW CONTACT INQUIRY - LIOC B2B
---------------------------------------------
Reference ID: {contact.reference_id}
Name: {contact.full_name}
Email: {contact.email}
Phone: {contact.phone_number}
Company: {contact.company_name or 'N/A'}
Subject: {contact.subject or 'General Inquiry'}
Message:
{contact.message}
---------------------------------------------
Lioc Support Desk: {self.recipient_email}
"""
        html_body = self._build_admin_html_template(
            title="Customer Contact Desk Inquiry",
            badge_text="Direct Inquiry",
            badge_color="#2563eb",
            reference_id=contact.reference_id,
            fields=fields,
            action_phone=contact.phone_number,
            action_email=contact.email,
        )
        self.send_async(self.recipient_email, subject, html_body, text_body)

    # -------------------------------------------------------------------------
    # CUSTOMER CONFIRMATION EMAILS (SENT TO USER WHO SUBMITTED EMAIL)
    # -------------------------------------------------------------------------

    def send_quote_customer_confirmation(self, quote: QuoteRequest):
        if not quote.email:
            return

        subject = f"[LIOC] Quotation Request Received (Ref: {quote.reference_id}) — Our Team Will Reach Out Shortly"
        fields = {
            "Inquiry Reference ID": quote.reference_id,
            "Product / Formulation": quote.product_interested_in or "Catalog Inquired",
            "Estimated Quantity": quote.estimated_quantity or "Specified in discussion",
            "Monthly Requirement": quote.monthly_requirement or "To be evaluated",
            "Company / Establishment": quote.company_name,
            "Location / City": quote.city,
            "Contact Phone": quote.phone_number,
        }

        headline = "We Have Received Your Quotation Request"
        message = (
            f"Thank you for contacting LIOC regarding commercial cleaning and hygiene supplies for "
            f"<strong>{quote.company_name}</strong>. We have registered your request under Reference ID "
            f"<strong>{quote.reference_id}</strong>. <strong>Our team will reach out to you shortly</strong> "
            f"with institutional pricing, technical data sheets, and custom bulk supply terms."
        )

        text_body = f"""Dear {quote.full_name},

Thank you for reaching out to LIOC Commercial & Industrial Hygiene Solutions.
We have received your quotation request for {quote.company_name}.

YOUR TRACKING REFERENCE ID: {quote.reference_id}

Our commercial team has received your details and will reach out to you shortly to provide wholesale pricing and supply options.

SUBMISSION SUMMARY:
- Reference ID: {quote.reference_id}
- Company: {quote.company_name}
- Product: {quote.product_interested_in or 'Catalog Range'}
- Estimated Quantity: {quote.estimated_quantity or 'N/A'}
- City: {quote.city}
- Contact Phone: {quote.phone_number}

Need immediate assistance?
- WhatsApp Sales Desk: https://wa.me/91{self.whatsapp_number}?text=Hello%20LIOC%20Team%2C%20Inquiry%20Ref%3A%20{quote.reference_id}
- Direct Phone: {self.primary_phone}
- Support Email: {self.company_email}
- Office & Factory: {self.company_address}

Warm regards,
LIOC Commercial Team
"""
        html_body = self._build_customer_html_template(
            customer_name=quote.full_name,
            headline=headline,
            message=message,
            badge_text="Quotation Queued",
            reference_id=quote.reference_id,
            fields=fields,
        )
        self.send_async(quote.email, subject, html_body, text_body, sender_name="LIOC Team")

    def send_sample_customer_confirmation(self, sample: SampleRequest):
        if not sample.email:
            return

        subject = f"[LIOC] Free Sample Kit Request Received (Ref: {sample.reference_id}) — Our Team Will Reach Out Shortly"
        fields = {
            "Inquiry Reference ID": sample.reference_id,
            "Product Sample Requested": sample.product_interested_in,
            "Company / Facility": sample.company_name,
            "Expected Volume": sample.expected_monthly_requirement or "Commercial Evaluation",
            "Delivery Address": f"{sample.business_address}, {sample.city}",
            "Contact Phone": sample.phone_number,
        }

        headline = "Your Free Evaluation Sample Kit Request Has Been Received"
        message = (
            f"Thank you for requesting a commercial evaluation sample kit for "
            f"<strong>{sample.company_name}</strong>. Your request is registered under Reference ID "
            f"<strong>{sample.reference_id}</strong>. <strong>Our team will reach out to you shortly</strong> "
            f"to verify your facility requirements and coordinate dispatch directly to your premises."
        )

        text_body = f"""Dear {sample.full_name},

Thank you for requesting a commercial evaluation sample kit from LIOC.
We have received your sample request for {sample.company_name}.

YOUR TRACKING REFERENCE ID: {sample.reference_id}

Our verification team will review your business details and our team will reach out to you shortly to coordinate dispatch.

SAMPLE REQUEST DETAILS:
- Reference ID: {sample.reference_id}
- Facility: {sample.company_name}
- Product: {sample.product_interested_in}
- Delivery Address: {sample.business_address}, {sample.city}
- Contact Phone: {sample.phone_number}

Need immediate assistance?
- WhatsApp Dispatch Desk: https://wa.me/91{self.whatsapp_number}?text=Hello%20LIOC%20Team%2C%20Sample%20Ref%3A%20{sample.reference_id}
- Direct Phone: {self.primary_phone}
- Support Email: {self.company_email}

Warm regards,
LIOC Team
"""
        html_body = self._build_customer_html_template(
            customer_name=sample.full_name,
            headline=headline,
            message=message,
            badge_text="Sample Kit Queued",
            reference_id=sample.reference_id,
            fields=fields,
        )
        self.send_async(sample.email, subject, html_body, text_body, sender_name="LIOC Team")

    def send_distributor_customer_confirmation(self, dist: DistributorApplication):
        if not dist.email:
            return

        subject = f"[LIOC] Dealership Partnership Application Received (Ref: {dist.reference_id}) — Our Team Will Reach Out Shortly"
        fields = {
            "Inquiry Reference ID": dist.reference_id,
            "Applicant Name": dist.applicant_name,
            "Firm / Company": dist.company_name,
            "Target Territory": f"{dist.city}, {dist.state}",
            "GSTIN": dist.gst_number or "Registered / Pending",
            "Industry Experience": dist.years_experience or "N/A",
            "Investment Bracket": dist.investment_capacity or "N/A",
            "Contact Phone": dist.phone_number,
        }

        headline = "Your Dealership & Distribution Application Has Been Received"
        message = (
            f"Thank you for your interest in partnering with LIOC as a regional distributor for "
            f"<strong>{dist.company_name}</strong> in {dist.city}, {dist.state}. "
            f"Your application is logged under Reference ID <strong>{dist.reference_id}</strong>. "
            f"<strong>Our team will reach out to you shortly</strong> to schedule an introductory discussion."
        )

        text_body = f"""Dear {dist.applicant_name},

Thank you for your interest in partnering with LIOC Commercial Hygiene.
We have received your dealership application for {dist.company_name} ({dist.city}, {dist.state}).

YOUR TRACKING REFERENCE ID: {dist.reference_id}

Our Channel Expansion Division is reviewing your profile and our team will reach out to you shortly to discuss territorial opportunities.

APPLICATION SUMMARY:
- Reference ID: {dist.reference_id}
- Firm Name: {dist.company_name}
- Territory: {dist.city}, {dist.state}
- Experience: {dist.years_experience or 'N/A'}
- Contact Phone: {dist.phone_number}

Direct Channel Inquiries:
- WhatsApp: https://wa.me/91{self.whatsapp_number}?text=Hello%20LIOC%20Team%2C%20Distributor%20Ref%3A%20{dist.reference_id}
- Phone: {self.primary_phone}
- Email: {self.company_email}

Warm regards,
LIOC Channel Expansion Division
"""
        html_body = self._build_customer_html_template(
            customer_name=dist.applicant_name,
            headline=headline,
            message=message,
            badge_text="Distributor Application",
            reference_id=dist.reference_id,
            fields=fields,
        )
        self.send_async(dist.email, subject, html_body, text_body, sender_name="LIOC Team")

    def send_contact_customer_confirmation(self, contact: ContactMessage):
        if not contact.email:
            return

        subject = f"[LIOC] We Have Received Your Inquiry (Ref: {contact.reference_id}) — Our Team Will Reach Out Shortly"
        fields = {
            "Inquiry Reference ID": contact.reference_id,
            "Subject / Topic": contact.subject or "General Commercial Inquiry",
            "Company / Organization": contact.company_name or "Individual / Commercial Client",
            "Contact Phone": contact.phone_number,
            "Your Message": contact.message,
        }

        headline = "Thank You for Contacting LIOC"
        message = (
            f"We have received your inquiry regarding <em>\"{contact.subject or 'Commercial Inquiry'}\"</em> "
            f"under Reference ID <strong>{contact.reference_id}</strong>. "
            f"<strong>Our team will reach out to you shortly</strong> to address your queries and provide any assistance you require."
        )

        text_body = f"""Dear {contact.full_name},

Thank you for contacting LIOC Commercial & Industrial Hygiene Solutions.
We have received your message.

YOUR TRACKING REFERENCE ID: {contact.reference_id}

Our team has queued your inquiry and will reach out to you shortly.

INQUIRY DETAILS:
- Reference ID: {contact.reference_id}
- Subject: {contact.subject or 'General Inquiry'}
- Company: {contact.company_name or 'N/A'}
- Message: {contact.message}

Need immediate assistance?
- WhatsApp Support: https://wa.me/91{self.whatsapp_number}?text=Hello%20LIOC%20Team%2C%20Inquiry%20Ref%3A%20{contact.reference_id}
- Direct Phone: {self.primary_phone}
- Direct Email: {self.company_email}
- Office & Factory: {self.company_address}

Warm regards,
LIOC Team
"""
        html_body = self._build_customer_html_template(
            customer_name=contact.full_name,
            headline=headline,
            message=message,
            badge_text="Inquiry Received",
            reference_id=contact.reference_id,
            fields=fields,
        )
        self.send_async(contact.email, subject, html_body, text_body, sender_name="LIOC Team")


email_service = EmailService()
