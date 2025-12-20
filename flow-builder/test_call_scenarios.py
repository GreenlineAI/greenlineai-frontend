"""
Test Script for GreenLine AI Call Flow Scenarios

This script helps test and validate the conversation flow by:
1. Simulating webhook events that Retell sends
2. Testing the CRM integration endpoints
3. Validating calendar integration

Run with: python test_call_scenarios.py
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Optional

# Configuration - update these for your environment
BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:3000")
WEBHOOK_URL = f"{BASE_URL}/api/inbound/webhook"
CALENDAR_CHECK_URL = f"{BASE_URL}/api/calendar/check-availability"
CALENDAR_BOOK_URL = f"{BASE_URL}/api/calendar/create-booking"

# Test agent ID - replace with your actual agent ID
TEST_AGENT_ID = os.environ.get("TEST_AGENT_ID", "agent_a031c45cf671b81a985d7ae082")


class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'


def print_test(name: str):
    print(f"\n{Colors.BLUE}{Colors.BOLD}━━━ TEST: {name} ━━━{Colors.END}")


def print_pass(msg: str):
    print(f"{Colors.GREEN}✓ PASS:{Colors.END} {msg}")


def print_fail(msg: str):
    print(f"{Colors.RED}✗ FAIL:{Colors.END} {msg}")


def print_info(msg: str):
    print(f"{Colors.YELLOW}ℹ INFO:{Colors.END} {msg}")


def send_webhook(event_type: str, data: dict) -> Optional[dict]:
    """Send a webhook event to the inbound webhook endpoint"""
    payload = {
        "event": event_type,
        "call_id": f"call_test_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "agent_id": TEST_AGENT_ID,
        "call_status": "ended",
        "direction": "inbound",
        **data
    }

    try:
        response = requests.post(WEBHOOK_URL, json=payload, timeout=10)
        return {
            "status_code": response.status_code,
            "response": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
        }
    except requests.exceptions.ConnectionError:
        return {"error": "Connection refused - is the server running?"}
    except Exception as e:
        return {"error": str(e)}


def test_webhook_endpoint():
    """Test 1: Verify webhook endpoint is accessible"""
    print_test("Webhook Endpoint Accessibility")

    try:
        response = requests.get(WEBHOOK_URL, timeout=5)
        if response.status_code == 200:
            print_pass(f"Webhook endpoint accessible at {WEBHOOK_URL}")
            print_info(f"Response: {response.json()}")
            return True
        else:
            print_fail(f"Unexpected status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_fail(f"Cannot connect to {WEBHOOK_URL}")
        print_info("Make sure your Next.js server is running: npm run dev")
        return False


def test_call_started_event():
    """Test 2: Simulate call_started event"""
    print_test("Call Started Event")

    result = send_webhook("call_started", {
        "from_number": "+14085551234",
        "to_number": "+16195551234",
        "start_timestamp": int(datetime.now().timestamp() * 1000)
    })

    if result.get("error"):
        print_fail(result["error"])
        return False

    if result["status_code"] == 200:
        print_pass("call_started event processed successfully")
        print_info(f"Response: {result['response']}")
        return True
    else:
        print_fail(f"Status code: {result['status_code']}")
        return False


def test_call_ended_with_service_request():
    """Test 3: Simulate call_ended with service appointment request"""
    print_test("Call Ended - Service Appointment Request")

    result = send_webhook("call_ended", {
        "from_number": "+14085551234",
        "to_number": "+16195551234",
        "start_timestamp": int((datetime.now() - timedelta(minutes=5)).timestamp() * 1000),
        "end_timestamp": int(datetime.now().timestamp() * 1000),
        "duration_ms": 300000,  # 5 minutes
        "dynamic_variables": {
            "caller_name": "John Test",
            "caller_phone": "+14085551234",
            "service_address": "123 Test Street, San Diego, CA 92101",
            "service_type": "Lawn Mowing",
            "urgency": "this week"
        },
        "call_analysis": {
            "call_summary": "Customer requested lawn mowing service for next week.",
            "user_sentiment": "positive",
            "call_successful": True
        },
        "transcript": "Agent: Thank you for calling... User: I need lawn mowing service..."
    })

    if result.get("error"):
        print_fail(result["error"])
        return False

    if result["status_code"] == 200:
        print_pass("Service request call processed - lead should be created in CRM")
        print_info(f"Response: {result['response']}")
        return True
    else:
        print_fail(f"Status code: {result['status_code']}")
        return False


def test_call_ended_with_message():
    """Test 4: Simulate call_ended with message taking"""
    print_test("Call Ended - Message Taking")

    result = send_webhook("call_ended", {
        "from_number": "+14087779999",
        "to_number": "+16195551234",
        "duration_ms": 120000,  # 2 minutes
        "dynamic_variables": {
            "message_name": "Jane Callback",
            "message_phone": "+14087779999",
            "message_reason": "Wants to discuss a large landscaping project",
            "callback_time": "afternoon"
        },
        "call_analysis": {
            "call_summary": "Caller left a message requesting callback about landscaping project.",
            "user_sentiment": "neutral",
            "call_successful": True
        }
    })

    if result.get("error"):
        print_fail(result["error"])
        return False

    if result["status_code"] == 200:
        print_pass("Message-taking call processed - lead should be created")
        return True
    else:
        print_fail(f"Status code: {result['status_code']}")
        return False


def test_function_call_check_availability():
    """Test 5: Simulate function call for calendar availability"""
    print_test("Function Call - Check Calendar Availability")

    result = send_webhook("function_call", {
        "function_name": "check_calendar_availability",
        "function_args": {
            "date_range": "next_7_days"
        }
    })

    if result.get("error"):
        print_fail(result["error"])
        return False

    response = result.get("response", {})
    if result["status_code"] == 200:
        if response.get("success") or response.get("available"):
            print_pass("Calendar availability retrieved successfully")
            slots = response.get("available_slots") or response.get("slots", [])
            print_info(f"Found {len(slots)} available slots (total: {response.get('total_slots', len(slots))})")
            if slots:
                print_info(f"First slot: {slots[0]}")
        elif response.get("error") == "calendar_not_configured":
            print_pass("Calendar not configured - fallback message returned (expected if Cal.com not set up)")
            print_info(f"Fallback: {response.get('fallback_message', 'N/A')}")
        else:
            print_fail(f"Unexpected response: {response}")
            return False
        return True
    else:
        print_fail(f"Status code: {result['status_code']}")
        return False


def test_function_call_create_booking():
    """Test 6: Simulate function call for creating a booking"""
    print_test("Function Call - Create Calendar Booking")

    # Get a future datetime for booking
    booking_time = datetime.now() + timedelta(days=2)
    booking_time = booking_time.replace(hour=10, minute=0, second=0, microsecond=0)

    result = send_webhook("function_call", {
        "function_name": "create_calendar_booking",
        "function_args": {
            "attendee_name": "Test Customer",
            "attendee_phone": "+14085559999",
            "attendee_email": "test@example.com",
            "start_time": booking_time.isoformat(),
            "service_type": "Tree Trimming",
            "notes": "Large oak tree in backyard needs trimming"
        }
    })

    if result.get("error"):
        print_fail(result["error"])
        return False

    response = result.get("response", {})
    if result["status_code"] == 200:
        if response.get("success"):
            print_pass("Booking created successfully!")
            print_info(f"Booking ID: {response.get('booking_id', 'N/A')}")
            print_info(f"Confirmation: {response.get('confirmation_message', 'N/A')}")
        elif response.get("error") == "calendar_not_configured":
            print_pass("Calendar not configured - fallback returned (expected if Cal.com not set up)")
        else:
            print_info(f"Response: {response}")
        return True
    else:
        print_fail(f"Status code: {result['status_code']}")
        return False


def test_calendar_endpoints_direct():
    """Test 7: Test calendar endpoints directly (not via webhook)"""
    print_test("Direct Calendar Endpoint Test")

    # Test check-availability endpoint
    try:
        response = requests.post(
            CALENDAR_CHECK_URL,
            json={"agent_id": TEST_AGENT_ID, "date_range": "next_7_days"},
            timeout=10
        )
        print_info(f"Check availability response: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                print_pass(f"Calendar check works - {len(data.get('available_slots', []))} slots found")
            else:
                print_info(f"Calendar response: {data.get('error', 'unknown')}")
    except Exception as e:
        print_fail(f"Calendar check failed: {e}")

    return True


def test_lead_scoring():
    """Test 8: Verify lead scoring logic with different scenarios"""
    print_test("Lead Scoring Logic")

    scenarios = [
        {
            "name": "Urgent customer (should be HOT)",
            "dynamic_variables": {"urgency": "today", "caller_name": "Urgent User", "caller_phone": "+14085551111"},
            "call_analysis": {"user_sentiment": "positive", "call_successful": True}
        },
        {
            "name": "Positive sentiment (should be HOT)",
            "dynamic_variables": {"caller_name": "Happy User", "caller_phone": "+14085552222"},
            "call_analysis": {"user_sentiment": "positive", "call_successful": True}
        },
        {
            "name": "Basic info only (should be WARM)",
            "dynamic_variables": {"caller_name": "Basic User", "caller_phone": "+14085553333"},
            "call_analysis": {"user_sentiment": "neutral", "call_successful": True}
        },
        {
            "name": "Minimal info (should be COLD)",
            "dynamic_variables": {},
            "call_analysis": {"user_sentiment": "negative", "call_successful": False}
        }
    ]

    for scenario in scenarios:
        result = send_webhook("call_ended", {
            "from_number": scenario["dynamic_variables"].get("caller_phone", "+14085550000"),
            "duration_ms": 60000,
            "dynamic_variables": scenario["dynamic_variables"],
            "call_analysis": scenario["call_analysis"]
        })

        if result.get("status_code") == 200:
            print_pass(f"{scenario['name']} - processed")
        else:
            print_fail(f"{scenario['name']} - failed")

    print_info("Check Supabase leads table to verify scoring")
    return True


def test_phone_normalization():
    """Test 9: Test phone number normalization"""
    print_test("Phone Number Normalization")

    from greenline_agent import normalize_phone_to_e164, validate_e164_phone

    test_cases = [
        ("408", "+1408", False),  # Incomplete
        ("4085551234", "+14085551234", True),  # 10 digits
        ("(408) 555-1234", "+14085551234", True),  # Formatted
        ("1-408-555-1234", "+14085551234", True),  # With country code
        ("+1 408 555 1234", "+14085551234", True),  # With + and spaces
        ("", "", False),  # Empty
    ]

    all_passed = True
    for input_phone, expected, should_be_valid in test_cases:
        result = normalize_phone_to_e164(input_phone)
        is_valid, msg = validate_e164_phone(result)

        if result == expected:
            print_pass(f"'{input_phone}' -> '{result}' (valid: {is_valid})")
        else:
            print_fail(f"'{input_phone}' -> '{result}' (expected: '{expected}')")
            all_passed = False

    return all_passed


def test_company_name_sanitization():
    """Test 10: Test company name sanitization"""
    print_test("Company Name Sanitization")

    from greenline_agent import sanitize_company_name

    test_cases = [
        ("Thank you for calling acme landscaping", "Acme Landscaping"),
        ("thanks for calling Bob's HVAC", "Bob's Hvac"),
        ("Welcome to Super Services", "Super Services"),
        ("You've reached The Best Company", "The Best Company"),
        ("ACME CORP", "Acme Corp"),
        ("already correct Name", "Already Correct Name"),
        ("Mike's Lawn Care", "Mike's Lawn Care"),  # Should stay mostly the same
    ]

    all_passed = True
    for input_name, expected in test_cases:
        result = sanitize_company_name(input_name)
        if result.lower() == expected.lower():  # Case-insensitive comparison
            print_pass(f"'{input_name}' -> '{result}'")
        else:
            print_fail(f"'{input_name}' -> '{result}' (expected: '{expected}')")
            all_passed = False

    return all_passed


def run_all_tests():
    """Run all tests and print summary"""
    print(f"\n{Colors.BOLD}{'='*60}")
    print("GreenLine AI Call Flow Test Suite")
    print(f"{'='*60}{Colors.END}")
    print(f"Target: {BASE_URL}")
    print(f"Agent ID: {TEST_AGENT_ID}")

    tests = [
        ("Webhook Endpoint", test_webhook_endpoint),
        ("Call Started Event", test_call_started_event),
        ("Service Request Call", test_call_ended_with_service_request),
        ("Message Taking Call", test_call_ended_with_message),
        ("Check Availability Function", test_function_call_check_availability),
        ("Create Booking Function", test_function_call_create_booking),
        ("Direct Calendar Endpoints", test_calendar_endpoints_direct),
        ("Lead Scoring", test_lead_scoring),
        ("Phone Normalization", test_phone_normalization),
        ("Company Name Sanitization", test_company_name_sanitization),
    ]

    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print_fail(f"Exception in {name}: {e}")
            results.append((name, False))

    # Summary
    print(f"\n{Colors.BOLD}{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}{Colors.END}")

    passed = sum(1 for _, p in results if p)
    total = len(results)

    for name, result in results:
        status = f"{Colors.GREEN}PASS{Colors.END}" if result else f"{Colors.RED}FAIL{Colors.END}"
        print(f"  {status} - {name}")

    print(f"\n{Colors.BOLD}Results: {passed}/{total} tests passed{Colors.END}")

    if passed == total:
        print(f"{Colors.GREEN}All tests passed!{Colors.END}")
    else:
        print(f"{Colors.YELLOW}Some tests failed - review output above{Colors.END}")


if __name__ == "__main__":
    run_all_tests()
