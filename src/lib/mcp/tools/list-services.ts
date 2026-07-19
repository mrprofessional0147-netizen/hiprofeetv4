import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SERVICE_LIST } from "@/data/services";

export default defineTool({
  name: "list_services",
  title: "List HIPROFEET services",
  description:
    "List every service HIPROFEET offers, with pricing in Naira, delivery timeline, and a short description. Use this to answer questions about what HIPROFEET sells or to recommend a fitting service.",
  inputSchema: {
    search: z
      .string()
      .optional()
      .describe("Optional case-insensitive substring filter matched against service name, tag, or id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ search }) => {
    const q = search?.trim().toLowerCase();
    const rows = SERVICE_LIST.filter((s) =>
      !q ? true : [s.id, s.name, s.tag].join(" ").toLowerCase().includes(q),
    ).map((s) => ({
      id: s.id,
      name: s.name,
      tag: s.tag,
      price: s.price,
      timeline: s.tl,
      order_url: `https://hiprofeetv4.lovable.app/order/${s.id}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { services: rows },
    };
  },
});
