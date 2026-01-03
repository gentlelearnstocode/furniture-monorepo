"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { createProductSchema, type CreateProductInput } from "@/lib/validations/products";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/ui/select";
import { Checkbox } from "@repo/ui/ui/checkbox";

import { ImageUpload } from "./image-upload";

interface CatalogOption {
    id: string;
    name: string;
}

interface ProductFormProps {
    catalogs: CatalogOption[];
    initialData?: CreateProductInput & { id: string };
}

export function ProductForm({ catalogs, initialData }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData ? {
        ...initialData,
        basePrice: parseFloat(initialData.basePrice as any),
        description: initialData.description || "",
        shortDescription: initialData.shortDescription || "",
    } : {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      basePrice: 0,
      isActive: true,
      catalogId: undefined, 
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: "cm",
      },
      images: [],
    },
  });

  function onSubmit(data: CreateProductInput) {
    startTransition(async () => {
      const result = initialData 
        ? await updateProduct(initialData.id, data)
        : await createProduct(data);
        
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData ? "Product updated successfully" : "Product created successfully");
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
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                    <Input 
                    placeholder="e.g. Modern Sofa" 
                    {...field} 
                    onChange={(e) => {
                        field.onChange(e);
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
                    <Input placeholder="e.g. modern-sofa" {...field} className="font-mono text-sm" />
                </FormControl>
                <FormDescription className="text-xs">
                    URL-friendly unique identifier.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
             <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} value={field.value as any} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="catalogId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catalog</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a catalog" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {catalogs.map((catalog) => (
                            <SelectItem key={catalog.id} value={catalog.id}>
                                {catalog.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea 
                    placeholder="A brief summary of the product..." 
                    className="min-h-[80px] resize-none"
                    {...field} 
                />
              </FormControl>
              <FormDescription className="text-xs">
                    Displayed in product lists and previews.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea 
                    placeholder="Comprehensive product details..." 
                    className="min-h-[120px] resize-none"
                    {...field} 
                />
              </FormControl>
              <FormDescription className="text-xs">
                    Detailed information shown on the product page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
            <h3 className="text-sm font-medium">Dimensions</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <FormField
                    control={form.control}
                    name="dimensions.width"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Width</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="0.0" {...field} value={field.value as any} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dimensions.height"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Height</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="0.0" {...field} value={field.value as any} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dimensions.depth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Depth</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="0.0" {...field} value={field.value as any} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dimensions.unit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="cm">cm</SelectItem>
                                    <SelectItem value="mm">mm</SelectItem>
                                    <SelectItem value="inch">inch</SelectItem>
                                    <SelectItem value="m">m</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Product Images</h3>
            <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <ImageUpload 
                                value={field.value as any} 
                                onChange={field.onChange}
                                folder={`products/${form.getValues("slug") || "general"}`}
                            />
                        </FormControl>
                        <FormDescription className="text-xs">
                            Upload product images. The star icon marks the primary image.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            Active Status
                        </FormLabel>
                        <FormDescription className="text-xs">
                            This product will be visible in the store.
                        </FormDescription>
                    </div>
                </FormItem>
            )}
        />

        <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
            {isPending 
                ? (initialData ? "Updating Product..." : "Creating Product...") 
                : (initialData ? "Update Product" : "Create Product")}
            </Button>
        </div>
      </form>
    </Form>
  );
}
