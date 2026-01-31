#!/usr/bin/env node

import { createServer } from './server.js'

async function main() {
  const { server, transport } = createServer()
  await server.connect(transport)

  process.on('SIGINT', async () => {
    await server.close()
    process.exit(0)
  })
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error)
  process.exit(1)
})
