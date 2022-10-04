import { z } from "zod";
import { buildJsonSchema, buildJsonSchemas } from "fastify-zod";
const userCore = {
  email: z.string().email(),
  name: z.string().min(1),
};
const createUserSchema = z.object({
  ...userCore,
  id: z.string().uuid(),
  password: z.string().min(1),
});

const userResponseSchema = z.object({
  ...userCore,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  userResponseSchema,
  loginSchema,
  loginResponseSchema,
});
