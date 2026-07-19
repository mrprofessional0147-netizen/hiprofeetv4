import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SERVICES } from "@/data/services";

export default defineTool({
  name: "get_service",
  title: "Get HIPROFEET service details",
  description:
    "Get full details for a single HIPROFEET service by id: the problem it solves, how it helps, what's included, price, timeline, and the order URL.",
  inputSchema: {
    service_id: z
      .string()
      .describe("The service id, e.g. 'fb', 'ig', 'tt', 'website', 'followers', 'consultant'. Use list_services to discover ids."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ service_id }) => {
    const s = SERVICES[service_id];
    if (!s) {
      return {
        content: [{ type: "text", text: `No service with id "${service_id}". Call list_services to see valid ids.` }],
        isError: true,
      };
    }
    const detail = {
      id: s.id,
      name: s.name,
      tag: s.tag,
      price: s.price,
      period: s.period,
      timeline: s.tl,
      pain: s.pain,
      helps: s.helps,
      benefits: s.benefits,
      order_url: `https://hiprofeetv4.lovable.app/order/${s.id}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(detail, null, 2) }],
      structuredContent: detail,
    };
  },
});
