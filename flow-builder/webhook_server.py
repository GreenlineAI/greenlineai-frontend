"""
⚠️  DEPRECATED - Use Cloudflare Workers Instead ⚠️

This standalone webhook server has been replaced by integrated
Cloudflare Workers in the main Next.js application:

  /functions/api/inbound/webhook.ts  - Inbound call handling
  /functions/api/calls/webhook.ts    - Outbound call handling
  /functions/api/meetings/webhook.ts - Meeting booking

These integrate directly with the Supabase CRM and provide:
- Lead creation/updates in the existing leads table
- Call analytics tracking
- Automatic sentiment analysis
- Recording and transcript storage

Configure your Retell agents to send webhooks to:
  https://your-domain.com/api/inbound/webhook

This file is kept for local testing/reference only.
"""

import os
import json
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from retell import Retell

# Initialize FastAPI app

app = FastAPI(
    title="GreenLine AI Webhook Server [DEPRECATED]",
    description="⚠️ DEPRECATED - Use /api/inbound/webhook instead. Backend API for Retell AI voice agents",
    version="1.0.0"
)

# CORS middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration from environment variables

RETELL_API_KEY = os.environ.get("RETELL_API_KEY", "")
CALENDLY_API_KEY = os.environ.get("CALENDLY_API_KEY", "")
CALENDLY_EVENT_TYPE_URI = os.environ.get("CALENDLY_EVENT_TYPE_URI", "")
CRM_WEBHOOK_URL = os.environ.get("CRM_WEBHOOK_URL", "")  # Optional: forward to your CRM

# Initialize Retell client for signature verification

retell = Retell(api_key=RETELL_API_KEY) if RETELL_API_KEY else None


# ============ Data Models ============

class LeadRequest(BaseModel):
    customer_name: str
    phone: str
    address: Optional[str] = None
    service_type: Optional[str] = None
    notes: Optional[str] = None
    priority: Optional[str] = "normal"
    callback_requested: Optional[bool] = False


class LeadResponse(BaseModel):
    success: bool
    lead_id: str
    message: str


class AvailabilityRequest(BaseModel):
    service_type: Optional[str] = None
    preferred_date: Optional[str] = None


class AvailabilityResponse(BaseModel):
    slots: List[dict]
    next_available: str


class AppointmentRequest(BaseModel):
    customer_name: str
    phone: str
    address: str
    service_type: Optional[str] = None
    appointment_time: str
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    success: bool
    confirmation_number: str
    datetime: str
    message: str


# ============ Helper Functions ============

def verify_retell_signature(body: bytes, signature: str) -> bool:
    """Verify the request is actually from Retell AI."""
    if not retell or not signature:
        return True  # Skip verification if not configured

    try:
        return retell.verify(
            body.decode('utf-8'),
            api_key=RETELL_API_KEY,
            signature=signature
        )
    except Exception as e:
        print(f"Signature verification error: {e}")
        return False


def generate_lead_id() -> str:
    """Generate a unique lead ID."""
    import uuid
    return f"LEAD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"


def generate_confirmation_number() -> str:
    """Generate a booking confirmation number."""
    import uuid
    return f"APT-{str(uuid.uuid4())[:8].upper()}"


async def forward_to_crm(lead_data: dict):
    """Forward lead data to external CRM if configured."""
    if not CRM_WEBHOOK_URL:
        return

    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                CRM_WEBHOOK_URL,
                json=lead_data,
                timeout=10.0
            )
    except Exception as e:
        print(f"CRM forward error: {e}")


async def get_calendly_availability(days_ahead: int = 7) -> List[dict]:
    """Fetch available time slots from Calendly."""
    if not CALENDLY_API_KEY or not CALENDLY_EVENT_TYPE_URI:
        # Return mock data if Calendly not configured
        return get_mock_availability()

    try:
        async with httpx.AsyncClient() as client:
            # Get available times from Calendly
            start_time = datetime.utcnow().isoformat() + "Z"
            end_time = (datetime.utcnow() + timedelta(days=days_ahead)).isoformat() + "Z"

            response = await client.get(
                "https://api.calendly.com/event_type_available_times",
                params={
                    "event_type": CALENDLY_EVENT_TYPE_URI,
                    "start_time": start_time,
                    "end_time": end_time
                },
                headers={
                    "Authorization": f"Bearer {CALENDLY_API_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                slots = []
                for slot in data.get("collection", [])[:10]:  # Limit to 10 slots
                    start = datetime.fromisoformat(slot["start_time"].replace("Z", "+00:00"))
                    slots.append({
                        "datetime": slot["start_time"],
                        "display": start.strftime("%A, %B %d at %I:%M %p")
                    })
                return slots
            else:
                print(f"Calendly API error: {response.status_code}")
                return get_mock_availability()

    except Exception as e:
        print(f"Calendly error: {e}")
        return get_mock_availability()


async def book_calendly_appointment(
    invitee_email: str,
    invitee_name: str,
    start_time: str,
    notes: str = ""
) -> dict:
    """Book an appointment via Calendly."""
    if not CALENDLY_API_KEY or not CALENDLY_EVENT_TYPE_URI:
        # Return mock confirmation if Calendly not configured
        return {
            "success": True,
            "uri": f"mock://calendly/{generate_confirmation_number()}",
            "start_time": start_time
        }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.calendly.com/scheduled_events",
                json={
                    "event_type": CALENDLY_EVENT_TYPE_URI,
                    "start_time": start_time,
                    "invitee": {
                        "email": invitee_email,
                        "name": invitee_name
                    },
                    "text_reminder_number": "",  # Could add phone here
                    "questions_and_answers": [
                        {"question": "Notes", "answer": notes}
                    ]
                },
                headers={
                    "Authorization": f"Bearer {CALENDLY_API_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )

            if response.status_code in [200, 201]:
                data = response.json()
                return {
                    "success": True,
                    "uri": data.get("resource", {}).get("uri", ""),
                    "start_time": start_time
                }
            else:
                return {"success": False, "error": response.text}

    except Exception as e:
        print(f"Calendly booking error: {e}")
        return {"success": False, "error": str(e)}


def get_mock_availability() -> List[dict]:
    """Generate mock availability for testing."""
    slots = []
    now = datetime.now()

    # Generate slots for next 5 business days
    current_date = now + timedelta(days=1)
    slots_added = 0

    while slots_added < 6:
        # Skip weekends
        if current_date.weekday() < 6:  # Mon-Sat
            # Add morning and afternoon slots
            for hour in [9, 11, 14, 16]:
                slot_time = current_date.replace(hour=hour, minute=0, second=0, microsecond=0)
                if slot_time > now:
                    slots.append({
                        "datetime": slot_time.isoformat(),
                        "display": slot_time.strftime("%A, %B %d at %I:%M %p")
                    })
                    slots_added += 1
                    if slots_added >= 6:
                        break
        current_date += timedelta(days=1)

    return slots


# ============ In-Memory Storage (Replace with DB in production) ============

leads_db: dict = {}
appointments_db: dict = {}


# ============ API Endpoints ============

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "GreenLine AI Webhook Server",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/api/leads", response_model=LeadResponse)
async def submit_lead(
    request: Request,
    x_retell_signature: Optional[str] = Header(None)
):
    """
    Receive lead data from Retell AI agent.
    Called when customer info is collected during a call.
    """
    body = await request.body()

    # Verify signature
    if x_retell_signature and not verify_retell_signature(body, x_retell_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Parse request
    try:
        data = json.loads(body)
        lead = LeadRequest(**data.get("args", data))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid request: {e}")

    # Generate lead ID
    lead_id = generate_lead_id()

    # Store lead
    lead_data = {
        "lead_id": lead_id,
        "customer_name": lead.customer_name,
        "phone": lead.phone,
        "address": lead.address,
        "service_type": lead.service_type,
        "notes": lead.notes,
        "priority": lead.priority,
        "callback_requested": lead.callback_requested,
        "created_at": datetime.utcnow().isoformat(),
        "status": "new"
    }
    leads_db[lead_id] = lead_data

    # Forward to CRM asynchronously
    await forward_to_crm(lead_data)

    print(f"Lead captured: {lead_id} - {lead.customer_name} ({lead.phone})")

    return LeadResponse(
        success=True,
        lead_id=lead_id,
        message=f"Lead {lead_id} created successfully"
    )


@app.get("/api/availability")
async def check_availability(
    request: Request,
    service_type: Optional[str] = None,
    preferred_date: Optional[str] = None,
    x_retell_signature: Optional[str] = Header(None)
):
    """
    Check available appointment slots.
    Returns available time slots from Calendly or mock data.
    """
    # Note: GET requests have empty body for signature verification
    if x_retell_signature:
        # For GET requests, verify with empty string
        if not retell.verify("", api_key=RETELL_API_KEY, signature=x_retell_signature):
            # Log but don't fail - signature verification for GET can be tricky
            print("Warning: Signature verification failed for GET request")

    # Get availability
    slots = await get_calendly_availability()

    # Filter by preferred date if provided
    if preferred_date:
        try:
            pref_date = datetime.fromisoformat(preferred_date.replace("Z", "+00:00"))
            slots = [s for s in slots if pref_date.date().isoformat() in s["datetime"]]
        except:
            pass  # Ignore invalid date format

    next_available = slots[0]["display"] if slots else "No availability found"

    print(f"Availability checked: {len(slots)} slots available")

    return {
        "slots": slots,
        "next_available": next_available
    }


@app.post("/api/appointments", response_model=AppointmentResponse)
async def book_appointment(
    request: Request,
    x_retell_signature: Optional[str] = Header(None)
):
    """
    Book an appointment for a customer.
    Creates appointment in Calendly and stores locally.
    """
    body = await request.body()

    # Verify signature
    if x_retell_signature and not verify_retell_signature(body, x_retell_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Parse request
    try:
        data = json.loads(body)
        appt = AppointmentRequest(**data.get("args", data))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid request: {e}")

    # Generate confirmation number
    confirmation = generate_confirmation_number()

    # Book via Calendly (or mock)
    # Note: Calendly requires email, we'll generate a placeholder
    placeholder_email = f"{appt.phone.replace(' ', '').replace('-', '')}@placeholder.greenline.ai"

    booking_result = await book_calendly_appointment(
        invitee_email=placeholder_email,
        invitee_name=appt.customer_name,
        start_time=appt.appointment_time,
        notes=f"Phone: {appt.phone}\nAddress: {appt.address}\nService: {appt.service_type}\nNotes: {appt.notes or 'N/A'}"
    )

    if not booking_result.get("success", True):
        # Even if Calendly fails, we store locally and return success
        # The appointment can be manually added later
        print(f"Warning: Calendly booking failed: {booking_result.get('error')}")

    # Parse and format appointment time
    try:
        appt_datetime = datetime.fromisoformat(appt.appointment_time.replace("Z", "+00:00"))
        formatted_datetime = appt_datetime.strftime("%A, %B %d at %I:%M %p")
    except:
        formatted_datetime = appt.appointment_time

    # Store appointment
    appointment_data = {
        "confirmation_number": confirmation,
        "customer_name": appt.customer_name,
        "phone": appt.phone,
        "address": appt.address,
        "service_type": appt.service_type,
        "appointment_time": appt.appointment_time,
        "formatted_time": formatted_datetime,
        "notes": appt.notes,
        "calendly_uri": booking_result.get("uri", ""),
        "created_at": datetime.utcnow().isoformat(),
        "status": "confirmed"
    }
    appointments_db[confirmation] = appointment_data

    # Also create a lead record if not exists
    lead_id = generate_lead_id()
    leads_db[lead_id] = {
        "lead_id": lead_id,
        "customer_name": appt.customer_name,
        "phone": appt.phone,
        "address": appt.address,
        "service_type": appt.service_type,
        "notes": appt.notes,
        "priority": "normal",
        "callback_requested": False,
        "appointment_confirmation": confirmation,
        "created_at": datetime.utcnow().isoformat(),
        "status": "appointment_booked"
    }

    print(f"Appointment booked: {confirmation} - {appt.customer_name} on {formatted_datetime}")

    return AppointmentResponse(
        success=True,
        confirmation_number=confirmation,
        datetime=formatted_datetime,
        message=f"Appointment confirmed for {formatted_datetime}"
    )


@app.get("/api/leads")
async def list_leads():
    """List all captured leads (for admin/testing)."""
    return {
        "count": len(leads_db),
        "leads": list(leads_db.values())
    }


@app.get("/api/appointments")
async def list_appointments():
    """List all appointments (for admin/testing)."""
    return {
        "count": len(appointments_db),
        "appointments": list(appointments_db.values())
    }


@app.post("/webhook/retell")
async def retell_webhook(request: Request):
    """
    Generic webhook endpoint for Retell call events.
    Receives call status updates, transcripts, etc.
    """
    body = await request.body()
    data = json.loads(body)

    event_type = data.get("event", "unknown")
    call_id = data.get("call_id", "unknown")

    print(f"Retell webhook: {event_type} for call {call_id}")

    # Handle different event types
    if event_type == "call_started":
        print(f"   Call started: {data.get('from_number')} -> {data.get('to_number')}")

    elif event_type == "call_ended":
        print(f"   Call ended. Duration: {data.get('duration_ms', 0)/1000:.1f}s")
        # Could save transcript here
        transcript = data.get("transcript", "")
        if transcript:
            print(f"   Transcript length: {len(transcript)} chars")

    elif event_type == "call_analyzed":
        # Post-call analysis available
        analysis = data.get("analysis", {})
        print(f"   Analysis: {analysis}")

    return {"status": "received", "event": event_type}


# ============ Run Server ============

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))

    print("\n" + "=" * 50)
    print("GreenLine AI Webhook Server")
    print("=" * 50)
    print(f"Port: {port}")
    print(f"Retell API: {'Configured' if RETELL_API_KEY else 'Not configured'}")
    print(f"Calendly API: {'Configured' if CALENDLY_API_KEY else 'Not configured (using mock)'}")
    print(f"CRM Webhook: {'Configured' if CRM_WEBHOOK_URL else 'Not configured'}")
    print("=" * 50 + "\n")

    uvicorn.run(app, host="0.0.0.0", port=port)
