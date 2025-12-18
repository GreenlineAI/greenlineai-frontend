#!/usr/bin/env python3
"""
GreenLine AI - CRM Integration Test Script

This script tests the complete flow:
1. Creates a mock business onboarding record
2. Creates a Retell agent for that business
3. Verifies the CRM integration is configured

Usage:
    cd flow-builder
    pip install python-dotenv supabase
    python test_full_flow.py
"""

import os
import sys
import time

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Verify required env vars
required_vars = ["RETELL_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]
missing = [v for v in required_vars if not os.environ.get(v)]
if missing:
    print(f"Error: Missing environment variables: {', '.join(missing)}")
    print("Make sure .env file has all required variables")
    sys.exit(1)

from supabase import create_client
from greenline_agent import create_agent_for_onboarding, GreenLineAgentBuilder

# Initialize Supabase
supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)


def create_test_onboarding():
    """Create a test business onboarding record."""
    timestamp = int(time.time())

    result = supabase.table("business_onboarding").insert({
        "business_name": f"Test Landscaping {timestamp}",
        "business_type": "landscaping",
        "owner_name": "Test Owner",
        "email": f"test{timestamp}@example.com",
        "phone": "+15551234567",
        "city": "San Diego",
        "state": "CA",
        "zip": "92101",
        "services": ["Lawn Mowing & Maintenance", "Tree Trimming", "Landscaping Design"],
        "greeting_name": "Test Landscaping",
        "preferred_voice": "professional_male",
        "hours_monday": "8 AM - 6 PM",
        "hours_tuesday": "8 AM - 6 PM",
        "hours_wednesday": "8 AM - 6 PM",
        "hours_thursday": "8 AM - 6 PM",
        "hours_friday": "8 AM - 6 PM",
        "status": "pending"
    }).execute()

    return result.data[0]


def verify_onboarding(onboarding_id):
    """Verify the onboarding record was updated correctly."""
    result = supabase.table("business_onboarding").select("*").eq("id", onboarding_id).single().execute()
    return result.data


def cleanup_test_data(onboarding_id, agent_id=None):
    """Clean up test data (optional)."""
    # Delete onboarding record
    supabase.table("business_onboarding").delete().eq("id", onboarding_id).execute()
    print(f"Deleted onboarding: {onboarding_id}")

    # Note: Retell agent should be deleted via Retell API if needed


def main():
    print("=" * 60)
    print("GREENLINE AI - CRM INTEGRATION TEST")
    print("=" * 60)

    # Step 1: Create test onboarding
    print("\n[Step 1] Creating test business onboarding...")
    onboarding = create_test_onboarding()
    onboarding_id = onboarding["id"]
    print(f"  Business: {onboarding['business_name']}")
    print(f"  Onboarding ID: {onboarding_id}")
    print(f"  Status: {onboarding['status']}")

    # Step 2: Create agent for the business
    print("\n[Step 2] Creating Retell agent...")
    try:
        result = create_agent_for_onboarding(onboarding_id)
        agent_id = result["agent_id"]
        flow_id = result["conversation_flow_id"]
        crm_linked = result["onboarding_updated"]

        print(f"  Agent ID: {agent_id}")
        print(f"  Flow ID: {flow_id}")
        print(f"  Webhook: https://www.greenline-ai.com/api/inbound/webhook")
        print(f"  CRM Linked: {crm_linked}")
    except Exception as e:
        print(f"  Error creating agent: {e}")
        agent_id = None
        crm_linked = False

    # Step 3: Verify the setup
    print("\n[Step 3] Verifying CRM integration...")
    updated_onboarding = verify_onboarding(onboarding_id)

    print(f"  Status: {updated_onboarding['status']}")
    print(f"  Retell Agent ID: {updated_onboarding.get('retell_agent_id', 'Not set')}")

    if updated_onboarding.get('retell_agent_id'):
        print("\n  CRM Integration: READY")
        print("  - Inbound calls to this agent will create leads")
        print("  - Leads will appear in the business owner's dashboard")
    else:
        print("\n  CRM Integration: NOT CONFIGURED")

    # Summary
    print("\n" + "=" * 60)
    print("TEST RESULTS")
    print("=" * 60)
    print(f"  Onboarding Created: Yes")
    print(f"  Agent Created: {'Yes' if agent_id else 'No'}")
    print(f"  CRM Linked: {'Yes' if crm_linked else 'No'}")

    # Next steps
    print("\n" + "=" * 60)
    print("NEXT STEPS")
    print("=" * 60)
    print("1. Assign a phone number to this agent in Retell dashboard")
    print("2. Make a test call to the number")
    print("3. Check Supabase 'leads' table for the new lead")
    print("")
    print("To simulate a webhook without calling:")
    print(f"""
curl -X POST https://www.greenline-ai.com/api/inbound/webhook \\
  -H "Content-Type: application/json" \\
  -d '{{
    "event": "call_ended",
    "call_id": "test-{int(time.time())}",
    "agent_id": "{agent_id or 'AGENT_ID'}",
    "direction": "inbound",
    "from_number": "+15559876543",
    "duration_ms": 60000,
    "dynamic_variables": {{
      "caller_name": "Test Customer",
      "caller_phone": "+15559876543",
      "service_type": "Lawn Mowing",
      "urgency": "this week"
    }}
  }}'
""")

    # Cleanup prompt
    print("=" * 60)
    cleanup = input("\nDelete test data? (y/n): ").strip().lower()
    if cleanup == 'y':
        cleanup_test_data(onboarding_id, agent_id)
        print("Test data cleaned up.")
    else:
        print(f"\nKeeping test data. Onboarding ID: {onboarding_id}")
        if agent_id:
            print(f"Agent ID: {agent_id}")


if __name__ == "__main__":
    main()
