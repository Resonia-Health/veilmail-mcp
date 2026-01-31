import type { Tool } from '@modelcontextprotocol/sdk/types.js'

export const TOOLS: Tool[] = [
  {
    name: 'send_email',
    description:
      'Send an email via Veil Mail. Supports HTML content, templates, attachments, and scheduling.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        from: {
          type: 'string',
          description: 'Sender email address (must be from a verified domain)',
        },
        to: {
          type: 'string',
          description: 'Recipient email address',
        },
        subject: {
          type: 'string',
          description: 'Email subject line',
        },
        html: {
          type: 'string',
          description: 'HTML content of the email',
        },
        text: {
          type: 'string',
          description: 'Plain text fallback content',
        },
        templateId: {
          type: 'string',
          description: 'Template ID to use instead of html/text',
        },
        templateData: {
          type: 'object',
          description: 'Data to populate template variables',
        },
        cc: {
          type: 'string',
          description: 'CC recipient email address',
        },
        bcc: {
          type: 'string',
          description: 'BCC recipient email address',
        },
        replyTo: {
          type: 'string',
          description: 'Reply-to email address',
        },
        scheduledFor: {
          type: 'string',
          description: 'ISO 8601 datetime to schedule the email',
        },
      },
      required: ['from', 'to', 'subject'],
    },
  },
  {
    name: 'get_email',
    description: 'Get details of a sent email by ID',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string',
          description: 'Email ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_emails',
    description: 'List sent emails with optional filters',
    inputSchema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Number of emails to return (max 100)',
        },
        status: {
          type: 'string',
          description:
            'Filter by status: queued, sent, delivered, bounced, failed',
        },
      },
    },
  },
  {
    name: 'validate_email',
    description:
      'Validate an email address. Checks syntax, MX records, disposable domain, and role address.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        email: {
          type: 'string',
          description: 'Email address to validate',
        },
      },
      required: ['email'],
    },
  },
  {
    name: 'list_templates',
    description: 'List available email templates',
    inputSchema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Number of templates to return',
        },
      },
    },
  },
  {
    name: 'get_template',
    description: 'Get a specific email template by ID',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string',
          description: 'Template ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_domains',
    description: 'List verified sending domains',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'list_audiences',
    description: 'List email audiences/contact lists',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'add_subscriber',
    description: 'Add a subscriber to an audience',
    inputSchema: {
      type: 'object' as const,
      properties: {
        audienceId: {
          type: 'string',
          description: 'Audience ID to add the subscriber to',
        },
        email: {
          type: 'string',
          description: 'Subscriber email address',
        },
        firstName: {
          type: 'string',
          description: 'Subscriber first name',
        },
        lastName: {
          type: 'string',
          description: 'Subscriber last name',
        },
      },
      required: ['audienceId', 'email'],
    },
  },
  {
    name: 'get_analytics',
    description:
      'Get email analytics overview including delivery rates, opens, clicks, and bounces',
    inputSchema: {
      type: 'object' as const,
      properties: {
        days: {
          type: 'number',
          description: 'Number of days to look back (default: 30)',
        },
      },
    },
  },
]
