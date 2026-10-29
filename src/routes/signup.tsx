import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AuthShell, Field } from "@/components/site/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [
    { title: "Create account | Veritrace" },
    { name: "description", content: "Onboard your brand and issue blockchain product passports." },
    { property: "og:title", content: "Create account | Veritrace" },
    { property: "og:description", content: "Start tracing your products today." },
  ] }),
  component: () => (
    <AuthShell title="Onboard your brand" sub="Issue your first passport in minutes." footer={<>Already have an account? <Link to="/signin" className="text-gold">Sign in</Link></>}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" placeholder="Amel Ben Ali" required />
          <Field label="Company" placeholder="Domaine Zitouna" required />
        </div>
        <Field label="Work email" type="email" placeholder="you@company.com" required />
        <Field label="Password" type="password" placeholder="8+ characters" required />
        <Button type="submit" size="lg" className="h-12 w-full rounded-xl">Create account</Button>
      </form>
    </AuthShell>
  ),
});
