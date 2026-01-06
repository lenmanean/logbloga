import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/users";
import { getOrdersByUserId, getOrderById } from "@/lib/db/orders";
import { OrderCard } from "@/components/account/order-card";
import { formatAmountForDisplay } from "@/lib/stripe/utils";
import { formatDate } from "@/lib/utils";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrdersByUserId(user.id);

  // If specific order is requested, show order details
  if (searchParams.order) {
    const order = await getOrderById(searchParams.order, user.id);
    if (order) {
      return (
        <div className="container px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Order Details</h1>
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Order #{order.id.slice(0, 8)}
                </h2>
                <p className="text-muted-foreground">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Items</h3>
              <div className="space-y-2">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border rounded p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {item.product?.name || "Product"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Download Key: {item.download_key.slice(0, 8)}...
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatAmountForDisplay(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold">
                {formatAmountForDisplay(order.total_amount)}
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

