---
name: medus-mcp-integration
description: Use for APIs, bridges, MCP servers, external-service connectors, agent tools, authentication debugging, tool schemas, and integration reliability work across Medus projects.
---

# Medus MCP / Integration

Research the current official API/protocol details before implementation when behavior may have changed.

Map authentication, transport, endpoints, request/response schemas, pagination, rate limits, destructive operations, and common failure states.

Use discoverable action-oriented tool names with consistent service prefixes. Make schemas explicit and constrained. Return focused structured data instead of dumping huge raw responses.

Where supported, identify read-only, destructive, idempotent, and open-world behavior.

Errors must tell the agent what failed, why when known, which input/credential/state caused it, and what to do next. Never expose secrets, tokens, authorization headers, or private credentials.

Test at minimum: build/schema validity, clean auth failure, one happy path, pagination/filtering where relevant, and safeguards around destructive operations.
