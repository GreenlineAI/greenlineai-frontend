# GreenLine AI - Retell Conversation Flow Builder

> Programmatically create and deploy AI voice agents for landscaping and HVAC companies using Retell AI’s Conversation Flow API.

## 🎯 Overview

This project provides a complete solution for creating AI voice agents via code rather than manually building conversation flows in the Retell dashboard. Perfect for:

- Deploying multiple agents for different clients
- Version controlling your conversation flows
- Automating agent provisioning
- Integrating with CI/CD pipelines

## 📁 Project Structure

```
greenline-retell/
├── greenline_agent.py     # Main agent builder class
├── webhook_server.py      # FastAPI webhook server
├── cli.py                 # Command-line interface
├── config.sample.json     # Sample landscaping config
├── config.hvac.sample.json # Sample HVAC config
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables

```bash
export RETELL_API_KEY="your_retell_api_key"

# Optional - for Calendly integration
export CALENDLY_API_KEY="your_calendly_api_key"
export CALENDLY_EVENT_TYPE_URI="your_calendly_event_type_uri"

# Optional - forward leads to your CRM
export CRM_WEBHOOK_URL="https://your-crm.com/webhook"
```

### 3. Create Your First Agent

**Option A: Using config file**

```bash
# Copy and customize the sample config
cp config.sample.json my_company.json
# Edit my_company.json with your company details

# Create the agent
python cli.py create --config my_company.json
```

**Option B: Interactive mode**

```bash
python cli.py create
# Follow the prompts
```

**Option C: Programmatically**

```python
from greenline_agent import GreenLineAgentBuilder, GreenLineConfig

config = GreenLineConfig(
    company_name="My Landscaping Co",
    business_type="landscaping",
    phone_number="(555) 123-4567",
    services=["Lawn Care", "Tree Trimming"],
    service_areas=["San Diego", "La Jolla"],
    webhook_base_url="https://your-server.com"
)

builder = GreenLineAgentBuilder(api_key="your_key")
result = builder.create_agent(config)

print(f"Agent ID: {result['agent_id']}")
```

### 4. Start the Webhook Server

```bash
python webhook_server.py
# Server starts at http://localhost:8000
```

For production, use:

```bash
uvicorn webhook_server:app --host 0.0.0.0 --port 8000 --workers 4
```

### 5. Test Your Agent

```bash
python cli.py test <agent_id>
```

## 📞 Conversation Flow Structure

The agent follows the comprehensive flow defined in `docs/RETELL-INCOMING-FLOW.md`:

```
                        ┌─────────────────────────────────────────┐
                        │           INCOMING CALL FLOW            │
                        └─────────────────────────────────────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │  Node 1: Greeting     │
                              └───────────────────────┘
                                          │
                      ┌───────────────────┼───────────────────┬────────────┐
                      ▼                   ▼                   ▼            ▼
            ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐
            │ Schedule Service│ │ Get Information │ │ Speak to Owner  │ │Solicitor │
            └─────────────────┘ └─────────────────┘ └─────────────────┘ └──────────┘
                      │                   │                   │            │
                      ▼                   ▼                   ▼            ▼
            ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐
            │ Collect Details │ │ Answer Questions│ │ Check Urgency   │ │End Call  │
            └─────────────────┘ └─────────────────┘ └─────────────────┘ └──────────┘
                      │                   │                   │
                      ▼                   │         ┌────────┴────────┐
            ┌─────────────────┐           │         ▼                 ▼
            │ Confirm Service │           │   ┌───────────┐    ┌───────────┐
            │     Area        │           │   │ Transfer  │    │ Take Msg  │
            └─────────────────┘           │   └───────────┘    └───────────┘
                      │                   │         │                 │
                      ▼                   │         │                 │
            ┌─────────────────┐           │         │                 │
            │ Scheduling Intro│           │         │                 │
            └─────────────────┘           │         │                 │
                      │                   │         │                 │
                      ▼                   │         │                 │
            ┌─────────────────┐           │         │                 │
            │Check Availability│          │         │                 │
            │  (Cal.com API)  │           │         │                 │
            └─────────────────┘           │         │                 │
                      │                   │         │                 │
                      ▼                   │         │                 │
            ┌─────────────────┐           │         │                 │
            │  Create Booking │           │         │                 │
            │  (Cal.com API)  │           │         │                 │
            └─────────────────┘           │         │                 │
                      │                   │         │                 │
                      └───────────────────┴─────────┴─────────────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │     End Call          │
                              │  (Multiple endings)   │
                              └───────────────────────┘
```

### Node Types

| Node | Name | Type | Purpose |
|------|------|------|---------|
| 1 | Greeting | conversation | Initial greeting and intent detection |
| 2 | Collect Service Details | conversation | Ask what service is needed |
| 2a | Extract Service Info | conversation | Collect name, phone, address |
| 2b | Help Identify Issue | conversation | Help unclear callers |
| 3 | Confirm Service Area | conversation | Verify location |
| 3a | Scheduling Intro | conversation | Ask about timing preference |
| 4 | Check Availability | function | Cal.com API check |
| 4a | Offer Times | conversation | Present available slots |
| 4b | Create Booking | function | Cal.com API booking |
| 4c | Booking Confirmation | conversation | Confirm the booking |
| 5 | Answer Questions | conversation | Handle FAQs |
| 5a | Service Not Offered | conversation | Politely decline |
| 5b | Outside Service Area | conversation | Location not served |
| 5c | Pricing Response | conversation | Handle pricing questions |
| 8 | Check Urgency | conversation | Emergency or callback? |
| 8a | Transfer Call | call_transfer | Transfer to owner |
| 9 | Take Message | conversation | Collect message details |
| 9a | Confirm Message | conversation | Read back message |
| 10-13 | End Nodes | end | Various call dispositions |

### Call Dispositions

| Ending | Disposition | When Used |
|--------|-------------|-----------|
| Node 10 | Info Provided | Questions answered |
| Node 11 | Appointment Booked | Booking successful |
| Node 12 | Solicitor | Sales/spam call |
| Node 13 | Message Taken | Left message for owner |

## 🛠 CLI Commands

```bash
# Create new agent
python cli.py create --config config.json
python cli.py create  # Interactive mode

# List resources
python cli.py list-agents
python cli.py list-flows

# Get details
python cli.py get-agent <agent_id>

# Test agent
python cli.py test <agent_id>

# Delete resources
python cli.py delete-agent <agent_id>
python cli.py delete-flow <flow_id>

# Export flow to JSON
python cli.py export-flow <flow_id> -o flow.json
```

## 🔗 Webhook Endpoints

|Endpoint           |Method|Description                  |
|-------------------|------|-----------------------------|
|`/`                |GET   |Health check                 |
|`/api/leads`       |POST  |Submit lead data             |
|`/api/availability`|GET   |Check calendar availability  |
|`/api/appointments`|POST  |Book appointment             |
|`/api/leads`       |GET   |List all leads (admin)       |
|`/api/appointments`|GET   |List all appointments (admin)|
|`/webhook/retell`  |POST  |Retell event webhook         |

## ⚙️ Configuration Options

|Field                   |Type  |Description                              |
|------------------------|------|-----------------------------------------|
|`company_name`          |string|Your company's name                      |
|`business_type`         |string|`landscaping` or `hvac`                  |
|`phone_number`          |string|Display phone number                     |
|`business_hours`        |string|Operating hours                          |
|`services`              |array |List of services offered                 |
|`service_areas`         |array |Areas you serve                          |
|`owner_name`            |string|Owner/manager name for messages/transfers|
|`transfer_number`       |string|Number for emergency transfers           |
|`emergency_availability`|string|Emergency availability hours             |
|`webhook_base_url`      |string|Your webhook server URL                  |
|`voice_id`              |string|Retell voice ID                          |
|`model`                 |string|LLM model to use                         |

### Available Voices

- `11labs-Adrian` - Male, American
- `11labs-Rachel` - Female, American
- `11labs-Drew` - Male, American
- `11labs-Sarah` - Female, American

### Available Models

- `gpt-4.1` (recommended)
- `gpt-4.1-mini` (faster, cheaper)
- `claude-4.5-sonnet`
- `claude-4.5-haiku` (faster, cheaper)
- `gemini-2.5-flash`

## 🔐 Calendly Integration

To enable real calendar integration:

1. Get your Calendly API key from [Calendly Integrations](https://calendly.com/integrations)
1. Find your Event Type URI from the Calendly API
1. Set environment variables:

```bash
export CALENDLY_API_KEY="your_key"
export CALENDLY_EVENT_TYPE_URI="https://api.calendly.com/event_types/xxx"
```

Without Calendly configured, the system uses mock availability data for testing.

## 🚢 Production Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "webhook_server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```bash
RETELL_API_KEY=your_retell_api_key
CALENDLY_API_KEY=your_calendly_api_key
CALENDLY_EVENT_TYPE_URI=your_event_type_uri
CRM_WEBHOOK_URL=https://your-crm.com/webhook
PORT=8000
```

## 📊 Node Types Reference

|Node Type      |Purpose              |API Type          |
|---------------|---------------------|------------------|
|`conversation` |Handle dialogue      |Main prompts      |
|`function`     |Call external APIs   |Custom functions  |
|`call_transfer`|Transfer to human    |Warm/cold transfer|
|`end`          |End the call         |Terminal node     |
|`logic_split`  |Conditional branching|Coming soon       |
|`sms`          |Send SMS             |Coming soon       |

## 🐛 Debugging

Enable verbose logging:

```bash
export RETELL_LOG=debug
python cli.py create --config config.json
```

View webhook logs:

```bash
# The webhook server logs all incoming requests
python webhook_server.py
```

## 📝 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

-----

Built with ❤️ for GreenLine AI by leveraging Retell AI’s Conversation Flow API.