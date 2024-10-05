"use client";
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { registrationSchema } from "@/schemas/registrationSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export default function RegisterForm() {
  const router = useRouter();
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
      const response = await api.post(`/users/register`, data);

      // localStorage.setItem("id", response.data.id);

      toast.success("Registered successfully!");

      router.push(`/main`);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-center justify-between bg-white p-8 rounded-lg shadow-md w-full h-full m-6"
      >
        <p className="text-xl md:text-2xl font-bold text-center">
          Register to get started
        </p>
        <div>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-md">First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First name"
                    autoComplete="given-name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-md">Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last name"
                    autoComplete="family-name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-md">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" autoComplete="email" {...field} />
                </FormControl>
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
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit">Submit</Button>
          {message && <p className="text-sm text-red-500">{message}</p>}
        </div>
      </form>
    </Form>
  );
}
