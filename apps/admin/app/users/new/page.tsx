import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserForm } from "../components/user-form";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/ui/button";

export default async function NewUserPage() {
  const session = await auth();
  
  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/users">
            <Button variant="outline" size="icon">
                <MoveLeft className="h-4 w-4" />
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New User</h1>
            <p className="text-sm text-gray-500">Grant access to a new team member.</p>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <UserForm />
      </div>
    </div>
  );
}
