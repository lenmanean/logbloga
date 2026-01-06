import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/users";
import { getOrdersByUserId } from "@/lib/db/orders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, User } from "lucide-react";

export default async function AccountPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  const orders = await getOrdersByUserId(user.id);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Account</h1>
        <p className="text-muted-foreground">Manage your account and orders</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {user.email}
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/settings">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Orders
            </CardTitle>
            <CardDescription>{orders.length} total orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Downloads
            </CardTitle>
            <CardDescription>Your purchased products</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/downloads">View Downloads</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {recentOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">
                    Order #{order.id.slice(0, 8)}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    order.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                    order.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

