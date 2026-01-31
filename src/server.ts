import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { TOOLS } from './tools.js'

const API_BASE_URL =
  process.env.VEILMAIL_BASE_URL || 'https://api.veilmail.xyz'
const API_KEY = process.env.VEILMAIL_API_KEY || ''

async function apiRequest(
  method: string,
  path: string,
  body?: unknown,
): Promise<unknown> {
  const url = `${API_BASE_URL}${path}`
  const headers: Record<string, string> = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'User-Agent': '@resonia/veilmail-mcp/0.1.0',
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      `API error (${response.status}): ${(error as Record<string, string>).message || response.statusText}`,
    )
  }

  if (response.status === 204) return { success: true }
  return response.json()
}

function queryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return ''
  return (
    '?' +
    entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&')
  )
}

async function handleToolCall(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  switch (name) {
    case 'send_email': {
      const result = await apiRequest('POST', '/v1/emails', {
        from: args.from,
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
        templateId: args.templateId,
        templateData: args.templateData,
        cc: args.cc,
        bcc: args.bcc,
        replyTo: args.replyTo,
        scheduledFor: args.scheduledFor,
      })
      return JSON.stringify(result, null, 2)
    }

    case 'get_email': {
      const result = await apiRequest('GET', `/v1/emails/${args.id}`)
      return JSON.stringify(result, null, 2)
    }

    case 'list_emails': {
      const qs = queryString({ limit: args.limit, status: args.status })
      const result = await apiRequest('GET', `/v1/emails${qs}`)
      return JSON.stringify(result, null, 2)
    }

    case 'validate_email': {
      const result = await apiRequest('POST', '/v1/emails/validate', {
        email: args.email,
      })
      return JSON.stringify(result, null, 2)
    }

    case 'list_templates': {
      const qs = queryString({ limit: args.limit })
      const result = await apiRequest('GET', `/v1/templates${qs}`)
      return JSON.stringify(result, null, 2)
    }

    case 'get_template': {
      const result = await apiRequest('GET', `/v1/templates/${args.id}`)
      return JSON.stringify(result, null, 2)
    }

    case 'list_domains': {
      const result = await apiRequest('GET', '/v1/domains')
      return JSON.stringify(result, null, 2)
    }

    case 'list_audiences': {
      const result = await apiRequest('GET', '/v1/audiences')
      return JSON.stringify(result, null, 2)
    }

    case 'add_subscriber': {
      const result = await apiRequest(
        'POST',
        `/v1/audiences/${args.audienceId}/subscribers`,
        {
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
        },
      )
      return JSON.stringify(result, null, 2)
    }

    case 'get_analytics': {
      const qs = queryString({ days: args.days })
      const result = await apiRequest('GET', `/v1/analytics/overview${qs}`)
      return JSON.stringify(result, null, 2)
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

export function createServer(): {
  server: Server
  transport: StdioServerTransport
} {
  const server = new Server(
    {
      name: 'veilmail-mcp',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }))

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params

    if (!API_KEY) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Error: VEILMAIL_API_KEY environment variable is not set. Please set it to your VeilMail API key.',
          },
        ],
      }
    }

    try {
      const result = await handleToolCall(
        name,
        (args ?? {}) as Record<string, unknown>,
      )
      return {
        content: [{ type: 'text' as const, text: result }],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  })

  const transport = new StdioServerTransport()
  return { server, transport }
}
