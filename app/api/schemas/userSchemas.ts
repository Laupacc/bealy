import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export const registrationSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  age: z.number().int().positive().optional(),
  description: z.string().optional(),
  profilePicture: z.string().url().optional(),
  showProfile: z.boolean().optional(),
});
