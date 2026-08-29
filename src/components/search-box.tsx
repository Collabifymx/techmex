"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SearchIcon } from "@/components/icons";

export function SearchBox({
  defaultValue = "",
  placeholder = "search",
  action = "/buscar",
  onSubmitQuery,
  autoFocus = false,
}: {
  defaultValue?: string;
  placeholder?: string;
  action?: string;
  onSubmitQuery?: (query: string) => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSubmitQuery) {
      onSubmitQuery(value);
      return;
    }
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`${action}${params.size ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="input-surface flex items-center gap-3 px-5 py-3.5">
        <SearchIcon className="h-4 w-4 shrink-0 text-mute" />
        <input
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            setValue(next);
            onSubmitQuery?.(next);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-mute"
        />
      </label>
    </form>
  );
}
