import { z } from "zod";

export const SummarySchema = z.object({
  summary: z.string().describe("summary of the speach"),
  topics: z.array(z.string().describe("topic name")).describe("list of topics"),
});
