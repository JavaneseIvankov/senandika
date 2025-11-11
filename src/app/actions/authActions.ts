"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * [WHAT] Sign in with email and password
 */
export async function signInWithPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  return await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers: await headers(),
  });
}

/**
 * [WHAT] Sign up with email and password
 */
export async function signUpWithPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    throw new Error("Email, password, and name are required");
  }

  return await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
    headers: await headers(),
  });
}

/**
 * [WHAT] Sign out the current user
 */
export async function signOut() {
  return await auth.api.signOut({
    headers: await headers(),
  });
}

/**
 * [WHAT] Get current session
 */
export async function getSessionData() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}
