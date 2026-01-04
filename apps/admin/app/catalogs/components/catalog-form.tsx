"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCatalog, updateCatalog } from "@/lib/actions/catalogs";
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

interface CatalogFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
}

export function CatalogForm({ initialData }: CatalogFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreateCatalogInput>({
    resolver: zodResolver(createCatalogSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
    },
  });

  function onSubmit(data: CreateCatalogInput) {
    startTransition(async () => {
      const result = initialData 
        ? await updateCatalog(initialData.id, data)
        : await createCatalog(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData ? "Catalog updated" : "Catalog created");
        router.push("/catalogs");
        router.refresh();
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
                        // Simple slug generation only if not editing or slug is empty
                        if (!initialData) {
                          const slug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                          form.setValue("slug", slug);
                        }
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
                        disabled={!!initialData} // Usually slug shouldn't change for SEO after creation
                    />
                </FormControl>
                <FormDescription className="text-xs">
                    URL-friendly unique identifier. {initialData && "(Slug cannot be changed after creation)"}
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
            {isPending ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Catalog" : "Create Catalog")}
            </Button>
        </div>
      </form>
    </Form>
  );
}
