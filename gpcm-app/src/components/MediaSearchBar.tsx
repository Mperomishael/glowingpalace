import { Search } from "lucide-react";
import type { MediaSort } from "@/lib/media";

export function MediaSearchBar({
  query,
  sort,
  onQueryChange,
  onSortChange,
  placeholder = "Search by name…",
  dark = false,
}: {
  query: string;
  sort: MediaSort;
  onQueryChange: (value: string) => void;
  onSortChange: (value: MediaSort) => void;
  placeholder?: string;
  dark?: boolean;
}) {
  const field = dark
    ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:ring-amber-300/40"
    : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:ring-violet-400/50";
  const idle = dark
    ? "text-white/70 hover:bg-white/10"
    : "text-zinc-600 hover:bg-zinc-100";
  const active = dark
    ? "bg-amber-300 text-zinc-900"
    : "bg-violet-600 text-white";

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <label className="relative flex-1">
        <Search
          size={16}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-white/40" : "text-zinc-400"}`}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm outline-none focus:ring-2 ${field}`}
        />
      </label>
      <div
        className={`flex h-11 rounded-xl border p-1 ${dark ? "border-white/15 bg-white/5" : "border-zinc-200 bg-white"}`}
        role="group"
        aria-label="Sort sermons"
      >
        <button
          type="button"
          onClick={() => onSortChange("latest")}
          className={`flex-1 sm:flex-none px-4 rounded-lg text-sm font-medium transition-colors ${sort === "latest" ? active : idle}`}
        >
          Latest
        </button>
        <button
          type="button"
          onClick={() => onSortChange("name")}
          className={`flex-1 sm:flex-none px-4 rounded-lg text-sm font-medium transition-colors ${sort === "name" ? active : idle}`}
        >
          By name
        </button>
      </div>
    </div>
  );
}