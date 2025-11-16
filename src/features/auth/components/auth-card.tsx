"use client";

import { useState } from "react";
import { useSignForm } from "../hooks/useSignForm";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";

export default function AuthCard() {
  const [isSignUp, setIsSignUp] = useState(false);
  const {
    form: formSignIn,
    onSubmit: onSignIn,
    isPending: isSignInPending,
    error: signInError,
  } = useSignForm("signIn");
  const {
    form: formSignUp,
    onSubmit: onSignUp,
    isPending: isSignUpPending,
    error: signUpError,
  } = useSignForm("signUp");

  return (
    <Card
      className={`relative w-full md:w-[80%] lg:w-[50%] h-auto md:h-[70vh] p-0 mx-4 md:mx-0 rounded-4xl transition-all duration-700 ease-in-out overflow-hidden`}
    >
      <CardContent className="relative flex flex-col md:flex-row h-full px-0">
        {/* Sign In */}
        <div
          className={`flex flex-col justify-center w-full md:w-[70%] h-auto md:h-full py-8 md:py-12 px-6 md:px-8 gap-4 transition-all duration-700 ease-in-out ${
            isSignUp ? "hidden md:flex md:opacity-0 md:pointer-events-none" : "flex md:opacity-100"
          }`}
        >
          <h1 className="text-[24px] md:text-[30px] text-center font-bold">Sign In</h1>
          <Form {...formSignIn}>
            <form onSubmit={formSignIn.handleSubmit(onSignIn)}>
              {/* Username Field */}
              <FormField
                control={formSignIn.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input
                        className="text-[12px]"
                        placeholder="Masukkan username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={formSignIn.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input
                        className="text-[12px]"
                        placeholder="Masukkan password"
                        type="password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {signInError && (
                <div className="text-red-500 text-sm text-center mb-2">
                  {signInError}
                </div>
              )}

              <div className="flex flex-col justify-center items-center gap-4">
                <Button
                  type="submit"
                  disabled={isSignInPending}
                  className="w-full md:w-[50%] bg-purple-400 hover:bg-purple-600 hover:-translate-y-0.5 active:translate-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSignInPending ? "Signing In..." : "Sign In"}
                </Button>
                <p className="md:hidden text-sm text-center">
                  Don't have an account?{" "}
                  <button 
                    type="button"
                    className="text-purple-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </Form>
        </div>

        {/* Sign Up */}
        <div
          className={`flex flex-col justify-center w-full md:w-[70%] h-auto md:h-full py-8 md:py-12 px-6 md:px-8 gap-4 transition-all duration-700 ease-in-out ${
            isSignUp ? "flex md:opacity-100" : "hidden md:flex md:opacity-0 md:pointer-events-none"
          }`}
        >
          <h1 className="text-[24px] md:text-[30px] text-center font-bold">Sign Up</h1>
          <Form {...formSignUp}>
            <form onSubmit={formSignUp.handleSubmit(onSignUp)}>
              {/* UserName Field */}
              <FormField
                control={formSignUp.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input
                        className="text-[12px]"
                        placeholder="Masukkan username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={formSignUp.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input
                        className="text-[12px]"
                        placeholder="Masukkan email"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={formSignUp.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input
                        className="text-[12px]"
                        placeholder="Masukkan password"
                        type="password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={formSignUp.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input
                        className="text-[12px]"
                        placeholder="Masukkan Confirm password"
                        type="password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {signUpError && (
                <div className="text-red-500 text-sm text-center mb-2">
                  {signUpError}
                </div>
              )}

              <div className="flex flex-col justify-center items-center gap-4">
                <Button
                  type="submit"
                  disabled={isSignUpPending}
                  className="w-full md:w-[50%] bg-purple-400 hover:bg-purple-600 hover:-translate-y-0.5 active:translate-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSignUpPending ? "Signing Up..." : "Register"}
                </Button>
                <p className="md:hidden text-sm text-center">
                  Already have an account?{" "}
                  <button 
                    type="button"
                    className="text-purple-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </Form>
        </div>

        {/* Left/Right Panel - Hidden on Mobile */}
        <div
          className={`hidden md:flex absolute top-0 left-1/2 w-[50%] h-full flex-col justify-center items-center gap-4 bg-purple-400 p-6 transition-all duration-700 ease-in-out ${isSignUp ? "-translate-x-full rounded-r-[30px] rounded-l-[30px]" : "rounded-l-[30px] rounded-r-[30px]"}`}
        >
          {isSignUp ? (
            <>
              <h1 className="text-[30px] font-bold">Welcome Back!</h1>
              <p className="text-[14px] text-center">
                Enter your personal details to use all of our features
              </p>
              <Button
                className="w-[50%] bg-transparent border hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-0 cursor-pointer"
                type="submit"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-[30px] font-bold">Hello, Friend!</h1>
              <p className="text-[14px] text-center">
                Register with your personal details to use all of site features
              </p>
              <Button
                className="w-[50%] bg-transparent border hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-0 cursor-pointer"
                type="submit"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
