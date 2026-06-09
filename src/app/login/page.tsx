import { Target } from "lucide-react";
import { loginAction } from "@/lib/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080B12] px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700/60 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
            <Target className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">Archery Lab</h1>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Motion Analysis Workbench
            </p>
          </div>
        </div>

        <form action={loginAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue="demo@archer.app"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue="demo1234"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Demo account: demo@archer.app / demo1234
        </p>
      </div>
    </div>
  );
}
