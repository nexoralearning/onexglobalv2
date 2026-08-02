import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationScreenProps {
  email: string;
  onLoginClick: () => void;
}

export function VerificationScreen({ email, onLoginClick }: VerificationScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full bg-card border rounded-2xl p-8 shadow-sm space-y-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Mail className="w-7 h-7" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Verify Your Email</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We have sent you a verification email to <span className="font-semibold text-foreground">{email}</span>. Please verify it and log in.
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium">
            💡 Don't see the email? Be sure to check your <strong>spam or junk folder</strong>!
          </div>
        </div>

        <Button onClick={onLoginClick} className="w-full gap-2 h-11 text-base">
          Login <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
