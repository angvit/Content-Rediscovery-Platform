import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  confirmpassword: z.string(),
});

function Account() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
  });

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    console.log("Submitting");
    try {
      console.log(values);
      if (
        values.password !== "" &&
        values.password !== values.confirmpassword
      ) {
        toast.error("Passwords do not match.");
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/update`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        console.error("HTTP Error:", responseBody);
        toast.error(responseBody.detail || "Signup failed. Please try again.");
        return;
      }

      toast.success("update sucessful!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to update, please try again");
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-black w-full flex grow flex-col space-y-4 px-12"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <FormControl className="w-full">
                <Input placeholder="username" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              {" "}
              {/* Added w-full */}
              <FormLabel>Email</FormLabel>
              <FormControl className="w-full">
                <Input placeholder="email" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              {" "}
              {/* Added w-full */}
              <FormLabel>Password</FormLabel>
              <FormControl className="w-full">
                <PasswordInput placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmpassword"
          render={({ field }) => (
            <FormItem className="w-full">
              {" "}
              {/* Added w-full */}
              <FormLabel>Confirm password</FormLabel>
              <FormControl className="w-full">
                <PasswordInput placeholder="confirm password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="bg-[#202A29] hover:bg-gray-600 transition-all duration-200 text-white font-semibold py-2 px-4 rounded w-40"
          type="submit"
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
}

export default Account;
