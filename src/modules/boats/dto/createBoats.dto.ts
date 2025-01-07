import { z } from "zod";

export const CreateBoatsDto = z.object({
  name: z.string().min(1, "Name is required"),
});
