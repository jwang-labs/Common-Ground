import { Link } from "wouter";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-display font-bold text-foreground mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </div>
      </Link>
    </div>
  );
}
