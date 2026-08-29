import { Logo } from "@/components/logo";
import { NavBar } from "@/components/nav-bar";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo size="sm" />
      </div>
      <NavBar />
    </header>
  );
}
