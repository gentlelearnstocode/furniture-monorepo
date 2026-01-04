import { db } from "@repo/database";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@repo/ui/ui/button";
import { Plus, ShieldCheck, Shield, UserX, UserCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@repo/ui/ui/badge";
import { toggleUserStatus, deleteUser } from "@/lib/actions/users";

export default async function UsersPage() {
  const session = await auth();
  
  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const allUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
          <p className="text-sm text-gray-500">Manage administrative access and roles.</p>
        </div>
        <Link href="/users/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Username</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.id}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.username}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {user.role === "admin" ? (
                      <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        <Shield className="w-3 h-3 mr-1" /> Editor
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.isActive ? (
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100">Active</Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-100 hover:bg-red-50">Inactive</Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <form action={async () => { "use server"; await toggleUserStatus(user.id); }}>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className={user.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                disabled={session.user.id === user.id}
                            >
                                {user.isActive ? (
                                    <><UserX className="w-4 h-4 mr-1"/> Deactivate</>
                                ) : (
                                    <><UserCheck className="w-4 h-4 mr-1"/> Activate</>
                                )}
                            </Button>
                        </form>
                        <form action={async () => { "use server"; await deleteUser(user.id); }}>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-none"
                                disabled={session.user.id === user.id}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
