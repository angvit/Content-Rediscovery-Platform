"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  username: z.string().min(1).min(5).max(50),
  password: z.string(),
});

interface responseData {
  status?: number;
  data?: JSON;
  error?: string;
  token?: string;
}
interface GoogleDecodeInterface {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}

interface ResponseData {
  success: boolean;
  message: string;
  token: string;
}

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();

  const googleLogin = async (credentials: any) => {
    const data: GoogleDecodeInterface = jwtDecode(credentials.credential);
    console.log(data);

    const userData = {
      google_id: data.sub,
    };

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google/login`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data: ResponseData = await response.json();

      console.log(data);
      if (data.success) {
        document.cookie = `token=${data.token}; path=/; max-age=3600`;
        router.push("/home");
      } else {
        toast.error("no user found");
      }
    } catch (error) {
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  async function onSubmit(
    values: z.infer<typeof formSchema>
  ): Promise<responseData> {
    try {
      console.log("Form values:", values);
      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response body:", errorBody);
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      const data = await response.json();
      console.log("Login successful, response data:", data);

      if (data.token) {
        console.log("Token received:", data.token);
        localStorage.setItem("cshere_token", data.token);
      }

      document.cookie = `token=${data.token}; path=/; max-age=3600`;
      console.log("Cookie set for token.");

      router.push("/home");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-black space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username or email" type="text" {...field} />
              </FormControl>
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
                <PasswordInput placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="bg-gray-400 hover:bg-gray-500 transition-all duration-200 text-gray-900 font-semibold py-2 px-4 rounded w-full"
          type="submit"
        >
          Submit
        </Button>
      </form>

      <hr className="border-black mb-4" />
      <GoogleLogin
        onSuccess={(credentials) => googleLogin(credentials)}
        onError={() => toast.error("Failed to signup with google.")}
      />

      <div className="text-center text-gray-400 mt-4">
        <p className="text-sm">Don't have an account?</p>
        <Link href="/signup">
          <Button variant="link" className="text-blue-500 hover:text-blue-700">
            Sign Up
          </Button>
        </Link>
      </div>
    </Form>
  );
}
