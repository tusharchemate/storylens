import * as z from "zod";

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Too short" }).max(20),
  username: z.string().min(2, { message: "Too short" }).max(20),
  email: z.string().email(),
  password: z.string().min(8, "Password must be 8 characters.").max(20),
});

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be 8 characters.").max(20),
});

export const PostValidation = z.object({
  caption: z.string().min(5).max(20),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});
