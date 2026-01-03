import { db } from "@repo/database";
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

export const dynamic = 'force-dynamic';

export default async function CatalogsPage() {
  const allCatalogs = await db.query.catalogs.findMany({
    orderBy: (catalogs, { desc }) => [desc(catalogs.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <nav className="flex items-center text-sm text-gray-500 mb-1">
             <Link href="/" className="hover:text-gray-900 transition-colors">Dashboard</Link>
             <span className="mx-2">/</span>
             <span className="font-medium text-gray-900">Catalogs</span>
           </nav>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Catalogs</h1>
          <p className="text-base text-gray-500 mt-1">Manage product categories and organizational hierarchy.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/catalogs/new">
            <Button size="sm" className="bg-brand-primary-600 hover:bg-brand-primary-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Catalog
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
         <Card className="p-4 flex flex-col justify-between">
             <span className="text-sm font-medium text-gray-500">Total Catalogs</span>
             <span className="text-2xl font-bold">{allCatalogs.length}</span>
         </Card>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
           <div className="flex items-center justify-between">
            <div>
                <CardTitle>Catalog List</CardTitle>
                <CardDescription>View and manage your catalogs.</CardDescription>
            </div>
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search catalogs..." className="pl-8" />
            </div>
           </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow className="hover:bg-gray-50/50">
                        <TableHead className="w-[300px]">Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allCatalogs.length === 0 ? (
                         <TableRow>
                            <TableCell colSpan={4} className="h-48 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Settings className="h-8 w-8 text-gray-300" />
                                    <p>No catalogs found. Create your first one to get started.</p>
                                </div>
                            </TableCell>
                         </TableRow>
                    ) : (
                        allCatalogs.map((catalog) => (
                             <TableRow key={catalog.id} className="group">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{catalog.name}</span>
                                        <div className="md:hidden text-xs text-gray-500 truncate max-w-[150px]">{catalog.slug}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal font-mono text-xs">
                                        {catalog.slug}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-500 max-w-xs truncate">
                                    {catalog.description || <span className="text-gray-300 italic">No description</span>}
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
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Edit Catalog</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                             </TableRow>
                        ))
                    )}
                </TableBody>
             </Table>
        </CardContent>
      </Card>
    </div>
  );
}
