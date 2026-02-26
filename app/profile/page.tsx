import { AppShell } from "@/components/app-shell";
import { SignOutButton } from "@/components/sign-out-button";

export default function ProfilePage() {
  return (
    <AppShell title="Profile" subtitle="Your identity, settings, and streak.">
      <section className="card-surface card-padding space-y-3">
        <h2 className="font-semibold">Account</h2>
        <p className="text-sm text-zinc-400">
          Your beta account is active. More profile details and settings are coming next.
        </p>
        <SignOutButton />
      </section>
    </AppShell>
  );
}
