// /hooks/useSignForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

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

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type SchemaType = "signIn" | "signUp";

const schemas = {
  signIn: signInSchema,
  signUp: signUpSchema,
};

export function useSignForm(type: SchemaType) {
  const schema = schemas[type];
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === "signIn"
        ? { email: "", password: "" }
        : { userName: "", email: "", password: "", confirmPassword: "" },
  });

  // Track isPending state changes
  useEffect(() => {
    console.log(`🔄 [useSignForm] ${type} isPending changed to:`, isPending);
  }, [isPending, type]);

  // Track error state changes
  useEffect(() => {
    if (error) {
      console.error(`❌ [useSignForm] ${type} error state:`, error);
    }
  }, [error, type]);

  async function onSubmit(values: SignInFormValues | SignUpFormValues) {
    console.log("🔵 [useSignForm] onSubmit called", { type, values });
    setError(null);
    setIsPending(true);

    try {
      if (type === "signIn") {
        const signInValues = values as SignInFormValues;
        console.log("🔵 [useSignForm] Starting sign in with client-side auth");

        try {
          console.log("🟢 [useSignForm] Calling authClient.signIn.email...");
          const result = await authClient.signIn.email({
            email: signInValues.email,
            password: signInValues.password,
          });

          console.log(
            "🟢 [useSignForm] authClient.signIn.email result:",
            result,
          );

          if (result.data) {
            console.log(
              "✅ [useSignForm] Sign in successful, redirecting to /test",
            );
            // Client-side auth automatically sets cookies
            window.location.href = "/test";
          } else if (result.error) {
            console.error(
              "❌ [useSignForm] Sign in error from API:",
              result.error,
            );
            setError(result.error.message || "Sign in failed");
            setIsPending(false);
          }
        } catch (err) {
          console.error("❌ [useSignForm] Sign in exception:", err);
          setError(err instanceof Error ? err.message : "Sign in failed");
          setIsPending(false);
        }
      } else {
        const signUpValues = values as SignUpFormValues;
        console.log("🔵 [useSignForm] Starting sign up with client-side auth");

        try {
          console.log("🟢 [useSignForm] Calling authClient.signUp.email...");
          const result = await authClient.signUp.email({
            email: signUpValues.email,
            password: signUpValues.password,
            name: signUpValues.userName,
          });

          console.log(
            "🟢 [useSignForm] authClient.signUp.email result:",
            result,
          );

          if (result.data) {
            console.log(
              "✅ [useSignForm] Sign up successful, redirecting to /test",
            );
            // Client-side auth automatically sets cookies
            window.location.href = "/test";
          } else if (result.error) {
            console.error(
              "❌ [useSignForm] Sign up error from API:",
              result.error,
            );
            setError(result.error.message || "Sign up failed");
            setIsPending(false);
          }
        } catch (err) {
          console.error("❌ [useSignForm] Sign up exception:", err);
          setError(err instanceof Error ? err.message : "Sign up failed");
          setIsPending(false);
        }
      }
    } catch (err) {
      console.error("❌ [useSignForm] Outer try-catch error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsPending(false);
    }
  }

  return { form, onSubmit, isPending, error };
}
