import os
import sys
import json
import argparse
from typing import Optional
from retell import Retell
from greenline_agent import GreenLineAgentBuilder, GreenLineConfig


def load_config(config_path: str) -> GreenLineConfig:
    """Load configuration from JSON file."""
    with open(config_path, 'r') as f:
        data = json.load(f)
    return GreenLineConfig(**data)


def create_agent(args):
    """Create a new agent from config file."""
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        print("Error: RETELL_API_KEY environment variable not set")
        sys.exit(1)

    # Load config
    if args.config:
        config = load_config(args.config)
    else:
        # Use interactive prompts
        config = interactive_config()

    # Create agent
    print(f"\nCreating agent for {config.company_name}...")
    builder = GreenLineAgentBuilder(api_key)

    try:
        result = builder.create_agent(config)

        print("\n" + "=" * 60)
        print("Agent Created Successfully!")
        print("=" * 60)
        print(f"Company:              {config.company_name}")
        print(f"Conversation Flow ID: {result['conversation_flow_id']}")
        print(f"Agent ID:             {result['agent_id']}")
        print(f"Voice:                {config.voice_id}")
        print(f"Model:                {config.model}")
        print("=" * 60)

        # Save result to file
        output_file = f"agent_{result['agent_id']}.json"
        with open(output_file, 'w') as f:
            json.dump({
                "conversation_flow_id": result['conversation_flow_id'],
                "agent_id": result['agent_id'],
                "company_name": config.company_name,
                "created_at": __import__('datetime').datetime.now().isoformat()
            }, f, indent=2)
        print(f"\nAgent details saved to: {output_file}")

    except Exception as e:
        print(f"Error creating agent: {e}")
        sys.exit(1)


def interactive_config() -> GreenLineConfig:
    """Interactively gather configuration from user."""
    print("\nInteractive Agent Configuration")
    print("-" * 40)

    company_name = input("Company Name: ").strip()
    business_type = input("Business Type (landscaping/hvac): ").strip().lower()
    phone_number = input("Business Phone: ").strip()
    business_hours = input("Business Hours [8 AM to 6 PM, Monday through Saturday]: ").strip()

    print("\nServices (comma-separated):")
    services_input = input("> ").strip()
    services = [s.strip() for s in services_input.split(",")] if services_input else []

    print("\nService Areas (comma-separated):")
    areas_input = input("> ").strip()
    service_areas = [a.strip() for a in areas_input.split(",")] if areas_input else []

    owner_name = input("\nOwner/Manager Name (for messages & transfers): ").strip()
    transfer_number = input("Transfer Number for emergencies (optional): ").strip()
    emergency_availability = input("Emergency Availability [24/7 for emergencies]: ").strip()
    webhook_url = input("Webhook Base URL (optional): ").strip()

    print("\nVoice Options: 11labs-Adrian, 11labs-Rachel, 11labs-Drew, 11labs-Sarah")
    voice_id = input("Voice ID [11labs-Adrian]: ").strip() or "11labs-Adrian"

    print("\nModel Options: gpt-4.1, gpt-4.1-mini, claude-4.5-sonnet, claude-4.5-haiku")
    model = input("Model [gpt-4.1]: ").strip() or "gpt-4.1"

    return GreenLineConfig(
        company_name=company_name,
        business_type=business_type,
        phone_number=phone_number,
        business_hours=business_hours or "8 AM to 6 PM, Monday through Saturday",
        services=services,
        service_areas=service_areas,
        webhook_base_url=webhook_url,
        transfer_number=transfer_number,
        owner_name=owner_name,
        emergency_availability=emergency_availability or "24/7 for emergencies",
        voice_id=voice_id,
        model=model
    )


def list_agents(args):
    """List all agents."""
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        print("Error: RETELL_API_KEY environment variable not set")
        sys.exit(1)

    client = Retell(api_key=api_key)

    try:
        agents = client.agent.list()

        print("\n" + "=" * 80)
        print("Your Retell AI Agents")
        print("=" * 80)

        if not agents:
            print("No agents found.")
        else:
            for agent in agents:
                print(f"\n{agent.agent_name or 'Unnamed Agent'}")
                print(f"   ID: {agent.agent_id}")
                print(f"   Voice: {agent.voice_id}")
                print(f"   Published: {agent.is_published if hasattr(agent, 'is_published') else 'N/A'}")

        print("\n" + "=" * 80)
        print(f"Total: {len(agents)} agent(s)")

    except Exception as e:
        print(f"Error listing agents: {e}")
        sys.exit(1)


def list_flows(args):
    """List all conversation flows."""
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        print("Error: RETELL_API_KEY environment variable not set")
        sys.exit(1)

    client = Retell(api_key=api_key)

    try:
        flows = client.conversation_flow.list()

        print("\n" + "=" * 80)
        print("Your Conversation Flows")
        print("=" * 80)

        if not flows:
            print("No conversation flows found.")
        else:
            for flow in flows:
                print(f"\nFlow ID: {flow.conversation_flow_id}")
                print(f"   Version: {flow.version}")
                print(f"   Model: {flow.model_choice.get('model', 'N/A') if flow.model_choice else 'N/A'}")
                if flow.nodes:
                    print(f"   Nodes: {len(flow.nodes)}")

        print("\n" + "=" * 80)
        print(f"Total: {len(flows)} flow(s)")

    except Exception as e:
        print(f"Error listing flows: {e}")
        sys.exit(1)


def delete_agent(args):
    """Delete an agent."""
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        print("Error: RETELL_API_KEY environment variable not set")
        sys.exit(1)

    client = Retell(api_key=api_key)

    agent_id = args.agent_id

    # Confirm deletion
    confirm = input(f"Are you sure you want to delete agent {agent_id}? (yes/no): ")
    if confirm.lower() != 'yes':
        print("Deletion cancelled.")
        return

    try:
        client.agent.delete(agent_id)
        print(f"Agent {agent_id} deleted successfully.")
    except Exception as e:
        print(f"Error deleting agent: {e}")
        sys.exit(1)


def delete_flow(args):
    """Delete a conversation flow."""
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        print("Error: RETELL_API_KEY environment variable not set")
        sys.exit(1)

    client = Retell(api_key=api_key)

    flow_id = args.flow_id

    confirm = input(f"Are you sure you want to delete flow {flow_id}? (yes/no): ")
    if confirm.lower() != 'yes':
        print("Deletion cancelled.")
        return

    try:
        client.conversation_flow.delete(flow_id)
        print(f"Conversation flow {flow_id} deleted successfully.")
    except Exception as e:
        print(f"Error deleting flow: {e}")
        sys.exit(1)


def test_agent(args):
    """Test an agent with a web call."""
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        print("Error: RETELL_API_KEY environment variable not set")
        sys.exit(1)

    client = Retell(api_key=api_key)

    agent_id = args.agent_id

    print(f"\nCreating test web call for agent {agent_id}...")

    try:
        # Create a web call for testing
        call = client.call.create_web_call(
            agent_id=agent_id
        )

        print("\n" + "=" * 60)
        print("Test Web Call Created!")
        print("=" * 60)
        print(f"Call ID: {call.call_id}")
        print(f"Access Token: {call.access_token}")
        print(f"\nOpen this URL to test your agent:")
        print(f"   https://dashboard.retellai.com/playground?call_id={call.call_id}")
        print("=" * 60)

    except Exception as e:
        print(f"Error creating test call: {e}")
        sys.exit(1)


def get_agent(args):
    """Get details of a specific agent."""
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        print("Error: RETELL_API_KEY environment variable not set")
        sys.exit(1)

    client = Retell(api_key=api_key)

    try:
        agent = client.agent.retrieve(args.agent_id)

        print("\n" + "=" * 60)
        print(f"Agent Details: {agent.agent_name or 'Unnamed'}")
        print("=" * 60)
        print(f"Agent ID:    {agent.agent_id}")
        print(f"Voice ID:    {agent.voice_id}")

        if agent.response_engine:
            engine = agent.response_engine
            print(f"Engine Type: {engine.get('type', 'N/A')}")
            if engine.get('type') == 'conversation-flow':
                print(f"Flow ID:     {engine.get('conversation_flow_id', 'N/A')}")

        print("=" * 60)

    except Exception as e:
        print(f"Error getting agent: {e}")
        sys.exit(1)


def export_flow(args):
    """Export a conversation flow to JSON."""
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        print("Error: RETELL_API_KEY environment variable not set")
        sys.exit(1)

    client = Retell(api_key=api_key)

    try:
        flow = client.conversation_flow.retrieve(args.flow_id)

        # Convert to dict
        flow_dict = {
            "conversation_flow_id": flow.conversation_flow_id,
            "version": flow.version,
            "model_choice": flow.model_choice,
            "start_speaker": flow.start_speaker,
            "global_prompt": flow.global_prompt,
            "nodes": flow.nodes,
            "tools": flow.tools,
            "start_node_id": flow.start_node_id,
            "default_dynamic_variables": flow.default_dynamic_variables
        }

        output_file = args.output or f"flow_{args.flow_id}.json"
        with open(output_file, 'w') as f:
            json.dump(flow_dict, f, indent=2, default=str)

        print(f"Flow exported to: {output_file}")

    except Exception as e:
        print(f"Error exporting flow: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="GreenLine AI - Retell Agent Management CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python cli.py create --config config.json
  python cli.py create                          # Interactive mode
  python cli.py list-agents
  python cli.py list-flows
  python cli.py get-agent <agent_id>
  python cli.py test <agent_id>
  python cli.py delete-agent <agent_id>
  python cli.py export-flow <flow_id> -o flow.json

Environment:
  RETELL_API_KEY    Your Retell AI API key (required)
"""
    )

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Create command
    create_parser = subparsers.add_parser("create", help="Create a new agent")
    create_parser.add_argument("--config", "-c", help="Path to config JSON file")
    create_parser.set_defaults(func=create_agent)

    # List agents command
    list_agents_parser = subparsers.add_parser("list-agents", help="List all agents")
    list_agents_parser.set_defaults(func=list_agents)

    # List flows command
    list_flows_parser = subparsers.add_parser("list-flows", help="List all conversation flows")
    list_flows_parser.set_defaults(func=list_flows)

    # Get agent command
    get_parser = subparsers.add_parser("get-agent", help="Get agent details")
    get_parser.add_argument("agent_id", help="Agent ID")
    get_parser.set_defaults(func=get_agent)

    # Test command
    test_parser = subparsers.add_parser("test", help="Create a test web call")
    test_parser.add_argument("agent_id", help="Agent ID to test")
    test_parser.set_defaults(func=test_agent)

    # Delete agent command
    delete_agent_parser = subparsers.add_parser("delete-agent", help="Delete an agent")
    delete_agent_parser.add_argument("agent_id", help="Agent ID to delete")
    delete_agent_parser.set_defaults(func=delete_agent)

    # Delete flow command
    delete_flow_parser = subparsers.add_parser("delete-flow", help="Delete a conversation flow")
    delete_flow_parser.add_argument("flow_id", help="Flow ID to delete")
    delete_flow_parser.set_defaults(func=delete_flow)

    # Export flow command
    export_parser = subparsers.add_parser("export-flow", help="Export flow to JSON")
    export_parser.add_argument("flow_id", help="Flow ID to export")
    export_parser.add_argument("--output", "-o", help="Output file path")
    export_parser.set_defaults(func=export_flow)

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        sys.exit(0)

    args.func(args)


if __name__ == "__main__":
    main()
