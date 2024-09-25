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
import { registrationSchema } from "@/schemas/registrationSchema";
import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    try {
      const response = await api.post(`/auth/register`, data);

      localStorage.setItem("id", response.data.id);

      setMessage("User registered successfully!");
      window.location.href = "/main";
      console.log("User created:", response.data);
    } catch (error) {
      setMessage("Error during registration. Please try again.");
      console.error("Registration error:", error);
    }
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 2000);
    }
  }, [message]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
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
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        {message && <p className="text-sm text-red-500">{message}</p>}{" "}
      </form>
    </Form>
  );
}
