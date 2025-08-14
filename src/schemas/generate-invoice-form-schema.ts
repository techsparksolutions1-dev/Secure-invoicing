import { z } from "zod";

export const GenerateInvoiceFormSchema = z.object({
  clientId: z.string(),
  clientName: z
    .string()
    .min(1, { message: "Client name is required." })
    .max(100, { message: "Client name must be under 100 characters." }),
  clientPhoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 7 && val.length <= 15), {
      message: "Phone number must be between 7-15 characters if provided.",
    }),
  clientEmailAddress: z
    .string()
    .min(1, { message: "Email address is required." })
    .email({ message: "Please enter a valid email address." }),
  serviceTitle: z
    .string()
    .min(1, { message: "Service title is required." })
    .max(300, { message: "Service title must be under 300 characters." }),
  serviceDescription: z
    .string()
    .min(1, { message: "Service description is required." })
    .max(2000, {
      message: "Service description must be under 2000 characters.",
    }),
  invoiceNumber: z.string().optional(),

  dueDate: z.date({ message: "Please select a valid date." }).refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    { message: "Due date must be in the future." }
  ),

  totalAmount: z
    .string()
    .min(1, { message: "Total amount is required." })
    .refine((val) => !isNaN(Number(val)), {
      message: "Total amount must be a number.",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Total amount must be zero or greater.",
    }),
});
