import { db } from "@repo/database";
import { Button } from "@repo/ui/ui/button";
import { Plus, MoreHorizontal, Search, Layers } from "lucide-react";
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

export default async function CollectionsPage() {
  const allCollections = await db.query.collections.findMany({
    with: {
        banner: true,
    },
    orderBy: (collections, { desc }) => [desc(collections.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <nav className="flex items-center text-sm text-gray-500 mb-1">
             <Link href="/" className="hover:text-gray-900 transition-colors">Dashboard</Link>
             <span className="mx-2">/</span>
             <span className="font-medium text-gray-900">Collections</span>
           </nav>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Collections</h1>
          <p className="text-base text-gray-500 mt-1">Manage product groupings and marketing sets.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/collections/new">
            <Button size="sm" className="bg-brand-primary-600 hover:bg-brand-primary-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
         <Card className="p-4 flex flex-col justify-between">
             <span className="text-sm font-medium text-gray-500">Total Collections</span>
             <span className="text-2xl font-bold">{allCollections.length}</span>
         </Card>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
           <div className="flex items-center justify-between">
            <div>
                <CardTitle>Collection List</CardTitle>
                <CardDescription>View and manage your collections.</CardDescription>
            </div>
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search collections..." className="pl-8" />
            </div>
           </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow className="hover:bg-gray-50/50">
                        <TableHead className="w-[100px]">Banner</TableHead>
                        <TableHead className="min-w-[200px]">Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allCollections.length === 0 ? (
                         <TableRow>
                            <TableCell colSpan={6} className="h-48 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Layers className="h-8 w-8 text-gray-300" />
                                    <p>No collections found. Create your first one to get started.</p>
                                </div>
                            </TableCell>
                         </TableRow>
                    ) : (
                        allCollections.map((collection) => (
                             <TableRow key={collection.id} className="group">
                                <TableCell>
                                    <div className="relative h-12 w-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                        {collection.banner?.url ? (
                                            <img 
                                                src={collection.banner.url} 
                                                alt={collection.name}
                                                className="object-cover h-full w-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full">
                                                <Layers className="h-4 w-4 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{collection.name}</span>
                                        <div className="md:hidden text-xs text-gray-500 truncate max-w-[150px]">{collection.slug}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal font-mono text-xs">
                                        {collection.slug}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={collection.isActive ? "success" : "secondary" as any} className="font-medium text-[10px] uppercase tracking-wider">
                                        {collection.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-500 max-w-xs truncate">
                                    {collection.description || <span className="text-gray-300 italic">No description</span>}
                                </TableCell>
                                <TableCell className="text-right">
                                    <CollectionActions collection={collection} />
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

function CollectionActions({ collection }: { collection: any }) {
    return (
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
                    <Link href={`/collections/${collection.id}`}>
                        Edit Collection
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteCollectionItem id={collection.id} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

import { DeleteCollectionItem } from "./components/delete-collection-item";
