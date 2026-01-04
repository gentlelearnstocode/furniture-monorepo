"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@repo/ui/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/ui/form";
import { Input } from "@repo/ui/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/ui/select";
import { createUser } from "@/lib/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "editor"]),
});

export function UserForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "editor",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await createUser(values);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("User created successfully");
        router.push("/users");
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                    <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>Used for login. Must be unique.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Access Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="editor">Editor (Product Management)</SelectItem>
                    <SelectItem value="admin">Admin (Full Access & User Mgmt)</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="pt-4 border-t">
            <Button type="submit" className="w-full md:w-auto min-w-[150px]" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                Create User
            </Button>
        </div>
      </form>
    </Form>
  );
}
