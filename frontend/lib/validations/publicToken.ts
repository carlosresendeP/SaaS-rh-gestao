import { z } from "zod";

export const publicTokenSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

export type PublicTokenFormData = z.infer<typeof publicTokenSchema>;