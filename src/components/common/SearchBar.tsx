"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({ value, onChange, onSearch, placeholder = "Search records" }: {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}) {
  return (
    <form className="flex w-full max-w-md gap-2" onSubmit={(event) => { event.preventDefault(); onSearch(); }} role="search">
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-10 bg-white" />
      <Button type="submit" size="icon" aria-label="Search" title="Search" className="size-10 bg-blue-600 text-white hover:bg-blue-700"><Search className="size-4" /></Button>
    </form>
  );
}
