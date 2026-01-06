import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/users";
import { getOrderItemsByUserId } from "@/lib/db/orders";
import { DownloadCard } from "@/components/account/download-card";

export default async function DownloadsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const orderItems = await getOrderItemsByUserId(user.id);

  return (
    <div className="container px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Downloads</h1>
      {orderItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No downloads available. Purchase a product to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orderItems.map((item) => (
            <DownloadCard key={item.id} orderItem={item} />
          ))}
        </div>
      )}
    </div>
  );
}

