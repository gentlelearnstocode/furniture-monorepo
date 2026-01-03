"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { createCatalog } from "@/lib/actions/catalogs";
import { createCatalogSchema, type CreateCatalogInput } from "@/lib/validations/catalogs";

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
import { Textarea } from "@repo/ui/ui/textarea";

export function CreateCatalogForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateCatalogInput>({
    resolver: zodResolver(createCatalogSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  function onSubmit(data: CreateCatalogInput) {
    startTransition(async () => {
      const result = await createCatalog(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Catalog created successfully");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Catalog Name</FormLabel>
                <FormControl>
                    <Input 
                    placeholder="e.g. Living Room" 
                    {...field} 
                    onChange={(e) => {
                        field.onChange(e);
                        // Simple slug generation
                        const slug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                        form.setValue("slug", slug);
                    }} 
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                    <Input 
                        placeholder="e.g. living-room" 
                        {...field} 
                        className="font-mono text-sm"
                    />
                </FormControl>
                <FormDescription className="text-xs">
                    URL-friendly unique identifier.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                    placeholder="Describe this catalog category..." 
                    className="min-h-[120px] resize-none"
                    {...field} 
                />
              </FormControl>
               <FormDescription className="text-xs">
                    Optional description for internal reference or SEO.
                </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
            {isPending ? "Creating Catalog..." : "Create Catalog"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
