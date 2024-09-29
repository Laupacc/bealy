"use client";
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/schemas/loginSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await api.post(`/auth/login`, data, {
        withCredentials: true,
      });

      localStorage.setItem("id", response.data.id);

      router.push(`/main`);
      console.log("User logged in:", response.data);
    } catch (error) {
      setMessage("Error during login. Please try again.");
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 2000);
    }
  }, [message]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-center justify-between bg-white p-8 rounded-lg shadow-md w-full h-full m-6"
      >
        <p className="text-xl md:text-2xl font-bold text-center">
          Or Log into your account
        </p>
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-md">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-md">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit">Login</Button>
          {message && <p className="text-sm text-red-500">{message}</p>}{" "}
        </div>
      </form>
    </Form>
  );
}
