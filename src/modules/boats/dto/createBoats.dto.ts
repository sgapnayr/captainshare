import { z } from "zod";

export const CreateBoatDto = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  location: z.string().min(1, "Location is required"),
  licenseRequired: z.array(z.string(), {
    message: "License requirements must be an array of strings",
  }),
  captainShareCertificationsRequired: z.array(z.string(), {
    message: "Captain certifications must be an array of strings",
  }),
  ownerIds: z
    .array(z.string(), { message: "Owner IDs must be an array of strings" })
    .min(1, "At least one owner is required"),
  rateWillingToPay: z.number().positive("Rate must be a positive number"),
  preferredCaptains: z.array(z.string()).optional(),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .int()
    .min(1900, "Year must be no earlier than 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  color: z.string(),
  hin: z.string().optional(),
  motorDetails: z.string().optional(),
  commercialUse: z.boolean(),
});
