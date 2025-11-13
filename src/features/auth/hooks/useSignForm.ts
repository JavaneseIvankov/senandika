// /hooks/useSignForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signInSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
});

const signUpSchema = z
  .object({
    userName: z.string().min(3, "Minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Password tidak sama"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

type SchemaType = "signIn" | "signUp";

const schemas = {
  signIn: signInSchema,
  signUp: signUpSchema,
};

export function useSignForm(type: SchemaType) {
  const schema = schemas[type];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === "signIn"
        ? { email: "", password: "" }
        : { userName: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: any) {
    console.log(`${type === "signIn" ? "Sign In" : "Sign Up"}:`, values);
  }

  return { form, onSubmit };
}