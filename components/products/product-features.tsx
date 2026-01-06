import { Check, Package, Download, Shield } from "lucide-react";

interface ProductFeaturesProps {
  fileSize?: number | null;
  fileFormat?: string;
}

export function ProductFeatures({
  fileSize,
  fileFormat,
}: ProductFeaturesProps) {
  const formatFileSize = (bytes: number | null | undefined): string => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">Instant Download</h4>
          <p className="text-sm text-muted-foreground">
            Get immediate access after purchase
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">File Details</h4>
          <p className="text-sm text-muted-foreground">
            {fileSize ? `${formatFileSize(fileSize)}` : "Digital file"}
            {fileFormat && ` • ${fileFormat}`}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">Secure Purchase</h4>
          <p className="text-sm text-muted-foreground">
            Protected by Stripe payment processing
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Check className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">30-Day Access</h4>
          <p className="text-sm text-muted-foreground">
            Download link valid for 30 days
          </p>
        </div>
      </div>
    </div>
  );
}

