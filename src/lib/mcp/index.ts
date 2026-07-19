import { defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import getServiceTool from "./tools/get-service";

export default defineMcp({
  name: "hiprofeet-mcp",
  title: "HIPROFEET Growth Intelligence",
  version: "0.1.0",
  instructions:
    "Public read-only tools for HIPROFEET — a business growth intelligence firm serving Nigerian operators. Use `list_services` to browse the service catalogue (Naira pricing, timelines) and `get_service` for full details on a specific service. Every service returns an `order_url` the user can open to place an order on hiprofeetv4.lovable.app.",
  tools: [listServicesTool, getServiceTool],
});
