import { db, products } from "@repo/database";
import { Button } from "@repo/ui/ui/button";
import { Plus, MoreHorizontal, Search, Settings } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/ui/card";
import { Input } from "@repo/ui/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/ui/dropdown-menu";
import { Badge } from "@repo/ui/ui/badge";
import Image from "next/image";
import { DeleteProductButton } from "./components/delete-product-button";


export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const allProducts = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.createdAt)],
    with: {
        catalog: true,
        gallery: {
          where: (productAssets, { eq }) => eq(productAssets.isPrimary, true),
          with: {
            asset: true
          },
          limit: 1
        }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <nav className="flex items-center text-sm text-gray-500 mb-1">
             <Link href="/" className="hover:text-gray-900 transition-colors">Dashboard</Link>
             <span className="mx-2">/</span>
             <span className="font-medium text-gray-900">Products</span>
           </nav>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-base text-gray-500 mt-1">Manage your inventory, pricing, and variants.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/products/new">
            <Button size="sm" className="bg-brand-primary-600 hover:bg-brand-primary-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
         <Card className="p-4 flex flex-col justify-between">
             <span className="text-sm font-medium text-gray-500">Total Products</span>
             <span className="text-2xl font-bold">{allProducts.length}</span>
         </Card>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
           <div className="flex items-center justify-between">
            <div>
                <CardTitle>Product List</CardTitle>
                <CardDescription>View and manage your products.</CardDescription>
            </div>
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search products..." className="pl-8" />
            </div>
           </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow className="hover:bg-gray-50/50">
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead className="w-[300px]">Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Catalog</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allProducts.length === 0 ? (
                         <TableRow>
                            <TableCell colSpan={6} className="h-48 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Settings className="h-8 w-8 text-gray-300" />
                                    <p>No products found. Add your first product to get started.</p>
                                </div>
                            </TableCell>
                         </TableRow>
                    ) : (
                        allProducts.map((product) => {
                             const primaryImage = product.gallery?.[0]?.asset?.url;

                             return (
                              <TableRow key={product.id} className="group">
                                 <TableCell>
                                     <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                         {primaryImage ? (
                                             <Image 
                                                 src={primaryImage} 
                                                 alt={product.name}
                                                 fill
                                                 className="object-cover"
                                             />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                                 No Image
                                             </div>
                                         )}
                                     </div>
                                 </TableCell>
                                 <TableCell>
                                     <div className="flex flex-col">
                                         <span className="font-medium text-gray-900">{product.name}</span>
                                         <div className="md:hidden text-xs text-gray-500 truncate max-w-[150px]">{product.slug}</div>
                                     </div>
                                 </TableCell>
                                 <TableCell>${product.basePrice}</TableCell>
                                 <TableCell>
                                     {product.catalog ? (
                                         <Badge variant="outline" className="font-normal text-xs">
                                             {product.catalog.name}
                                         </Badge>
                                     ) : (
                                         <span className="text-gray-400 text-xs">-</span>
                                     )}
                                 </TableCell>
                                 <TableCell>
                                     <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}>
                                         {product.isActive ? "Active" : "Draft"}
                                     </Badge>
                                 </TableCell>
                                 <TableCell className="text-right">
                                     <DropdownMenu>
                                         <DropdownMenuTrigger asChild>
                                             <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <span className="sr-only">Open menu</span>
                                                 <MoreHorizontal className="h-4 w-4" />
                                             </Button>
                                         </DropdownMenuTrigger>
                                         <DropdownMenuContent align="end">
                                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                             <DropdownMenuItem asChild>
                                                <Link href={`/products/${product.id}/edit`}>
                                                    Edit Product
                                                </Link>
                                             </DropdownMenuItem>
                                             <DropdownMenuSeparator />
                                             <DeleteProductButton productId={product.id} productName={product.name} />
                                         </DropdownMenuContent>
                                     </DropdownMenu>
                                 </TableCell>
                              </TableRow>
                             );
                        })
                    )}
                </TableBody>
             </Table>
        </CardContent>
      </Card>
    </div>
  );
}
