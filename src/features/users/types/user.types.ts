import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório" })
    .max(255, { message: "O nome deve conter no máximo 255 caracteres" }),
  
  email: z
    .string()
    .email({ message: "Email inválido" })
    .min(1, { message: "O email é obrigatório" }),
  
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
    }),
});

export const updateUserSchema = createUserSchema.partial();

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
  is_active: z.boolean(),
});

// Tipos inferidos dos schemas
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof userResponseSchema>; 