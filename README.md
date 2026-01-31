# @resonia/veilmail-mcp

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes Veil Mail API operations as tools for AI agents. This allows AI assistants like Claude, ChatGPT, and other MCP-compatible clients to send emails, manage templates, work with audiences, and retrieve analytics through natural language.

## Installation

```bash
npm install @resonia/veilmail-mcp
```

Or run directly with npx:

```bash
npx @resonia/veilmail-mcp
```

## Configuration

The server requires a Veil Mail API key to authenticate requests. Set it via the `VEILMAIL_API_KEY` environment variable.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VEILMAIL_API_KEY` | Yes | - | Your Veil Mail API key (e.g., `veil_live_xxxxx`) |
| `VEILMAIL_BASE_URL` | No | `https://api.veilmail.xyz` | Custom API base URL (useful for self-hosted instances) |

You can obtain an API key from the [Veil Mail Dashboard](https://app.veilmail.xyz/settings/api-keys).

## Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "veilmail": {
      "command": "npx",
      "args": ["@resonia/veilmail-mcp"],
      "env": {
        "VEILMAIL_API_KEY": "veil_live_xxxxx"
      }
    }
  }
}
```

Restart Claude Desktop after updating the configuration. You should see the Veil Mail tools available in the tools menu.

## Usage with Other MCP Clients

Any MCP-compatible client can use this server. Start it as a subprocess communicating over stdio:

```bash
VEILMAIL_API_KEY=veil_live_xxxxx npx @resonia/veilmail-mcp
```

## Available Tools

### send_email

Send an email via Veil Mail. Supports HTML content, templates, attachments, and scheduling.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | string | Yes | Sender email address (must be from a verified domain) |
| `to` | string | Yes | Recipient email address |
| `subject` | string | Yes | Email subject line |
| `html` | string | No | HTML content of the email |
| `text` | string | No | Plain text fallback content |
| `templateId` | string | No | Template ID to use instead of html/text |
| `templateData` | object | No | Data to populate template variables |
| `cc` | string | No | CC recipient email address |
| `bcc` | string | No | BCC recipient email address |
| `replyTo` | string | No | Reply-to email address |
| `scheduledFor` | string | No | ISO 8601 datetime to schedule the email |

### get_email

Get details of a sent email by ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Email ID |

### list_emails

List sent emails with optional filters.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of emails to return (max 100) |
| `status` | string | No | Filter by status: queued, sent, delivered, bounced, failed |

### validate_email

Validate an email address. Checks syntax, MX records, disposable domain, and role address.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Email address to validate |

### list_templates

List available email templates.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of templates to return |

### get_template

Get a specific email template by ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Template ID |

### list_domains

List verified sending domains. No parameters required.

### list_audiences

List email audiences/contact lists. No parameters required.

### add_subscriber

Add a subscriber to an audience.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audienceId` | string | Yes | Audience ID to add the subscriber to |
| `email` | string | Yes | Subscriber email address |
| `firstName` | string | No | Subscriber first name |
| `lastName` | string | No | Subscriber last name |

### get_analytics

Get email analytics overview including delivery rates, opens, clicks, and bounces.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `days` | number | No | Number of days to look back (default: 30) |

## Example Interactions

Once configured, you can ask your AI assistant things like:

- "Send a welcome email to user@example.com from hello@mydomain.com"
- "List all my email templates"
- "Show me email analytics for the past 7 days"
- "Validate the email address test@example.com"
- "Add john@example.com to my newsletter audience"
- "What's the delivery rate for my recent emails?"

## Security Considerations

- **Never expose API keys in prompts or conversation history.** Always use environment variables.
- **Use test mode keys (`veil_test_xxxxx`) during development** to avoid sending real emails.
- **Review email content before sending.** The AI assistant will use the `send_email` tool, so verify recipient addresses and content are correct.
- **Scope API keys appropriately.** Create dedicated API keys for MCP usage with only the permissions needed.
- **Rotate keys regularly.** If you suspect an API key has been compromised, rotate it immediately in the Veil Mail dashboard.

## Development

```bash
# Clone the repository
git clone https://github.com/resonia/veil-mail.git
cd veil-mail/packages/mcp-server

# Install dependencies
bun install

# Build
bun run build

# Run locally
VEILMAIL_API_KEY=veil_test_xxxxx node dist/index.js

# Type check
bun run typecheck

# Watch mode
bun run dev
```

## License

MIT
