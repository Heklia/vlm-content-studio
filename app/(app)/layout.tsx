import { AppShell } from "@/shared/ui/AppShell";
import { requireAuth } from "@/services/auth/require-auth";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return <AppShell>{children}</AppShell>;
}
