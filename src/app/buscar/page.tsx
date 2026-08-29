import { redirect } from "next/navigation";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  redirect(q ? `/directorio?q=${encodeURIComponent(q)}` : "/directorio");
}
