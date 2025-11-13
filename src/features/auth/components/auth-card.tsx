"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { Card, CardContent } from "@/shared/components/ui/card"; 
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField } from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button"

const formSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Password tidak sama"),
})

export default function AuthCard() {
  const [isSignUp, setIsSignUp] = useState(false);

  const formSignIn = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const formSignUp = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card className={`relative w-[50%] h-[70vh] p-0 px-0 rounded-4xl transition-all duration-700 ease-in-out ${isSignUp ? "animate-move" : "animate-move"}`}>
      <CardContent className="relative flex flex-row h-full px-0">

        {/* Sign In */}
        <div className={`flex flex-col justify-center w-[70%] h-full py-12 px-8 gap-4 transition-all duration-700 ease-in-oute ${isSignUp ? "animate-move" : "animate-move"}`}>
          <h1 className="text-[30px] text-center font-bold">Sign In</h1>
          <Form {...formSignIn}>
            <form onSubmit={formSignIn.handleSubmit(onSubmit)}>

              {/* Username Field */ }
              <FormField
                control={formSignIn.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input className="text-[12px]" placeholder="Masukkan username" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Password Field */ }
              <FormField
                control={formSignIn.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input className="text-[12px]" placeholder="Masukkan password" type="password" autoComplete="off" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />

               <div className="flex flex-col justify-center items-center gap-4">
                <a href="/" className="text-center text-[14px] hover:underline">Forget Your Password?</a>
                <Button className="w-[50%] bg-purple-400 hover:bg-purple-600 hover:-translate-y-0.5 active:translate-0 cursor-pointer">Register</Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Sign Up */}
        <div className={`flex flex-col justify-center w-[70%] h-full py-12 px-8 gap-4 transition-all duration-700 ease-in-out ${isSignUp ? "animate-move" : "animate-move"}`}>
          <h1 className="text-[30px] text-center font-bold">Sign Up</h1>
          <Form {...formSignUp}>
            <form onSubmit={formSignUp.handleSubmit(onSubmit)}>

              {/* Email Field */ }
              <FormField
                control={formSignUp.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input className="text-[12px]" placeholder="Masukkan username" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Password Field */ }
              <FormField
                control={formSignUp.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input className="text-[12px]" placeholder="Masukkan password" type="password" autoComplete="off" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */ }
              <FormField
                control={formSignUp.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl className="mb-4 border rounded-2xl px-4 py-1">
                      <input className="text-[12px]" placeholder="Masukkan Confirm password" type="password" autoComplete="off" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-center items-center gap-4">
                <a href="/" className="text-center text-[14px] hover:underline">Forget Your Password?</a>
                <Button className="w-[50%] bg-purple-400 hover:bg-purple-600 hover:-translate-y-0.5 active:translate-0 cursor-pointer">Register</Button>
              </div>
              
            </form>
          </Form>
        </div>

        {/* Left/Right Panel */}
        <div className={`absolute top-0 left-1/2 w-[50%] h-full flex flex-col justify-center items-center gap-4 bg-purple-400 p-6 transition-all duration-700 ease-in-out ${isSignUp ? "-translate-x-full rounded-r-[30px] rounded-l-[30px]" : "rounded-l-[30px] rounded-r-[30px]"}`}>  
          {isSignUp ? (
            <>
              <h1 className="text-[30px] font-bold">Welcome Back!</h1>
              <p className="text-[14px] text-center">Enter your personal details to use all of our features</p>
              <Button className="w-[50%] bg-transparent border hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-0 cursor-pointer" type="submit" onClick={() => setIsSignUp(false)}>Sign In</Button>
            </>
          ) : (
            <>
              <h1 className="text-[30px] font-bold">Hello, Friend!</h1>
              <p className="text-[14px] text-center">Register with your personal details to use all of site features</p>
              <Button className="w-[50%] bg-transparent border hover:bg-white hover:text-black hover:-translate-y-0.5 active:translate-0 cursor-pointer" type="submit" onClick={() => setIsSignUp(true)}>Sign Up</Button>
            </>
          )}
        </div>
        
      </CardContent>
    </Card>
  )
}