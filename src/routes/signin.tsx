import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AuthShell, Field } from "@/components/site/AuthShell";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [
    { title: "Sign in | Veritrace" },
    { name: "description", content: "Sign in to manage your product passports on Veritrace." },
    { property: "og:title", content: "Sign in | Veritrace" },
    { property: "og:description", content: "Access your traceability dashboard." },
  ] }),
  component: () => (
    <AuthShell title="Welcome back" sub="Sign in to manage your passports." footer={<>New here? <Link to="/signup" className="text-gold">Create an account</Link></>}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Email" type="email" placeholder="you@company.com" required />
        <Field label="Password" type="password" placeholder="••••••••" required />
        <Button type="submit" size="lg" className="h-12 w-full rounded-xl">Sign in</Button>
      </form>
    </AuthShell>
  ),
});
