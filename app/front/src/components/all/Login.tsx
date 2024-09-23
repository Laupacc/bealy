"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas/loginSchema";
import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "@/../utils";
import axios from "axios";

export default function LoginForm() {
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
      const response = await axios.post(`${BACKEND_URL}/auth/login`, data);

      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);

      setMessage("User logged in successfully!");
      window.location.href = "/main";
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
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>
                Please enter your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>Please enter your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
        {message && <p className="text-sm text-red-500">{message}</p>}{" "}
      </form>
    </Form>
  );
}
