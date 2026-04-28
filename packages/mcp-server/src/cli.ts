#!/usr/bin/env node
import { stdin, stdout } from "node:process";
import {
  getComponent,
  getComponentProps,
  getExample,
  getToken,
  searchComponents,
  searchTokens,
} from "./tools.js";

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc?: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: unknown;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: JsonRpcId;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: string;
  };
}

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

const protocolVersion = "2024-11-05";

class MethodNotFoundError extends Error {
  constructor(method: string) {
    super(`Unsupported MCP method: ${method}`);
    this.name = "MethodNotFoundError";
  }
}

class InvalidParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidParamsError";
  }
}

const tools = [
  {
    name: "search_components",
    description:
      "Search Nexu Design component metadata by name, description, import, docs URL, or examples.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search text such as button, dialog, or form." },
        limit: { type: "number", description: "Maximum results to return, from 1 to 100." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_component",
    description:
      "Get full Nexu Design metadata for a component by id, name, docs slug, or export name.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          description: "Component id or name, for example button or Button.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_component_props",
    description: "Get curated props metadata for a Nexu Design component.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          description: "Component id or name, for example button or Button.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_example",
    description: "Get examples for a component, or a specific example source by id.",
    inputSchema: {
      type: "object",
      properties: {
        component: { type: "string", description: "Component id such as button." },
        example: {
          type: "string",
          description: "Example id or short name, such as button/basic or basic.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "search_tokens",
    description:
      "Search Nexu Design token metadata by name, CSS variable, category, page, or usage.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search text such as background, radius, or --nexu.",
        },
        category: { type: "string", description: "Optional token category filter." },
        limit: { type: "number", description: "Maximum results to return, from 1 to 100." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_token",
    description: "Get full Nexu Design token metadata by token name or CSS variable.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          description: "Token name or CSS variable, such as color.background.",
        },
      },
      additionalProperties: false,
    },
  },
] as const;

const toolHandlers: Record<string, ToolHandler> = {
  search_components: searchComponents,
  get_component: (args) => getComponent({ name: getRequiredString(args, "name") }),
  get_component_props: (args) => getComponentProps({ name: getRequiredString(args, "name") }),
  get_example: getExample,
  search_tokens: searchTokens,
  get_token: (args) => getToken({ name: getRequiredString(args, "name") }),
};

let input = "";

stdin.setEncoding("utf8");
stdin.on("data", (chunk) => {
  input += chunk;
  processInputBuffer();
});

stdin.on("end", () => {
  processInputBuffer(true);
});

function processInputBuffer(flush = false) {
  while (input.includes("\n")) {
    const newlineIndex = input.indexOf("\n");
    const line = input.slice(0, newlineIndex).trim();
    input = input.slice(newlineIndex + 1);
    void handleLine(line);
  }

  if (flush && input.trim()) {
    const line = input.trim();
    input = "";
    void handleLine(line);
  }
}

async function handleLine(line: string) {
  if (!line) return;

  let message: unknown;

  try {
    message = JSON.parse(line) as unknown;
  } catch (error) {
    writeError(null, -32700, "Parse error", error);
    return;
  }

  const response = await handleMessage(message);

  if (response !== undefined) writeMessage(response);
}

async function handleMessage(
  message: unknown,
): Promise<JsonRpcResponse | JsonRpcResponse[] | undefined> {
  if (Array.isArray(message)) return handleBatch(message);

  return handleSingleMessage(message);
}

async function handleBatch(
  messages: unknown[],
): Promise<JsonRpcResponse | JsonRpcResponse[] | undefined> {
  if (messages.length === 0) return buildError(null, -32600, "Invalid request");

  const responses = (await Promise.all(messages.map(handleSingleMessage))).filter(
    (response): response is JsonRpcResponse => response !== undefined,
  );

  return responses.length > 0 ? responses : undefined;
}

async function handleSingleMessage(message: unknown): Promise<JsonRpcResponse | undefined> {
  if (!isJsonRpcRequest(message)) return buildError(null, -32600, "Invalid request");

  const request = message;

  if (request.id === undefined) {
    try {
      await handleNotification(request);
    } catch {
      // JSON-RPC notifications do not receive responses; ignore unsupported extension notifications.
    }

    return undefined;
  }

  try {
    const result = await handleRequest(request);
    return buildResponse(request.id, result);
  } catch (error) {
    const isMethodNotFound = error instanceof MethodNotFoundError;
    const isInvalidParams = error instanceof InvalidParamsError;

    return buildError(
      request.id,
      isMethodNotFound ? -32601 : isInvalidParams ? -32602 : -32603,
      error instanceof Error ? error.message : "Internal error",
      error,
    );
  }
}

async function handleNotification(request: JsonRpcRequest) {
  if (request.method === "notifications/initialized" || request.method.startsWith("$/")) return;

  await handleRequest({ ...request, id: null });
}

async function handleRequest(request: JsonRpcRequest) {
  switch (request.method) {
    case "initialize":
      return {
        protocolVersion,
        capabilities: {
          tools: {},
          resources: {},
        },
        serverInfo: {
          name: "@nexu-design/mcp",
          version: "0.0.0",
        },
      };
    case "tools/list":
      return { tools };
    case "tools/call":
      return callTool(request.params);
    case "resources/list":
      return {
        resources: [
          resource("nexu://components", "Nexu Design components", "Component metadata index"),
          resource("nexu://tokens", "Nexu Design tokens", "Design token metadata index"),
        ],
      };
    case "resources/read":
      return readResource(request.params);
    default:
      throw new MethodNotFoundError(request.method);
  }
}

async function callTool(params: unknown) {
  const { name, arguments: args = {} } = asRecord(params);

  if (typeof name !== "string" || !toolHandlers[name]) {
    throw new InvalidParamsError(`Unknown Nexu Design MCP tool: ${String(name)}`);
  }

  let result: unknown;

  try {
    result = await toolHandlers[name](asRecord(args));
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: error instanceof Error ? error.message : "Tool execution failed",
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

async function readResource(params: unknown) {
  const { uri } = asRecord(params);

  if (uri === "nexu://components") {
    const result = await searchComponents({ limit: 100 });
    return resourceContents(uri, result);
  }

  if (uri === "nexu://tokens") {
    const result = await searchTokens({ limit: 100 });
    return resourceContents(uri, result);
  }

  if (typeof uri === "string" && uri.startsWith("nexu://components/")) {
    const result = await getComponent({ name: uri.replace("nexu://components/", "") });
    return resourceContents(uri, result);
  }

  if (typeof uri === "string" && uri.startsWith("nexu://examples/")) {
    const result = await getExample({ example: uri.replace("nexu://examples/", "") });
    return resourceContents(uri, result);
  }

  throw new Error(`Unknown Nexu Design MCP resource: ${String(uri)}`);
}

function resource(uri: string, name: string, description: string) {
  return { uri, name, description, mimeType: "application/json" };
}

function resourceContents(uri: unknown, result: unknown) {
  if (typeof uri !== "string") throw new Error("Resource uri must be a string.");

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return value as Record<string, unknown>;
}

function getRequiredString(args: Record<string, unknown>, key: string) {
  const value = args[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new InvalidParamsError(`Tool argument ${key} must be a non-empty string.`);
  }

  return value;
}

function isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as { method?: unknown }).method === "string"
  );
}

function buildResponse(id: JsonRpcId, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

function buildError(id: JsonRpcId, code: number, message: string, error?: unknown) {
  return {
    jsonrpc: "2.0" as const,
    id,
    error: {
      code,
      message,
      data: error instanceof Error ? error.stack : undefined,
    },
  };
}

function writeMessage(message: JsonRpcResponse | JsonRpcResponse[]) {
  stdout.write(`${JSON.stringify(message)}\n`);
}

function writeError(id: JsonRpcId, code: number, message: string, error?: unknown) {
  writeMessage(buildError(id, code, message, error));
}
