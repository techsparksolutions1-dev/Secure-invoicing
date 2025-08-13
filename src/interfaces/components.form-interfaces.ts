import z from "zod";

import { GenerateInvoiceFormSchema } from "@/schemas/generate-invoice-form-schema";
import { LoginFormSchema } from "@/schemas/login-form-schema";

export type GenerateInvoiceFormType = z.infer<typeof GenerateInvoiceFormSchema>;
export type LoginFormType = z.infer<typeof LoginFormSchema>;
