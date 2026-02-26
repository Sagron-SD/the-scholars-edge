"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const supabase = createBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function run() {
      const { data } = await supabase.auth.getSession();
      const authed = !!data.session;

      const isAuthPage = pathname.startsWith("/auth/");
      if (!authed && !isAuthPage) {
        router.replace("/auth/sign-in");
        return;
      }

      if (mounted) setReady(true);
    }

    run();

    const { data: sub } = supabase.auth.onAuthStateChange(() => run());

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  if (!ready) return null;
  return <>{children}</>;
}
