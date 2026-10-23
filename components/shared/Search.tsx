"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(currentQuery);
  const lastSyncedQuery = useRef(currentQuery);

  // Keep the input in sync when the query changes from outside (back/forward, reset...)
  useEffect(() => {
    if (lastSyncedQuery.current === currentQuery) return;
    lastSyncedQuery.current = currentQuery;
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
     // Avoid a redundant navigation when nothing changed
      if (query.trim() === currentQuery) return;

      if (query) {
        const newUrl = formUrlQuery({
          searchParams: removeKeysFromQuery({
            searchParams: searchParams.toString(),
            keysToRemove: ["page"],
          }).split("?")[1] || "",
          key: "query",
          value: query,
        });

        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          searchParams: searchParams.toString(),
          keysToRemove: ["query", "page"],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [router, searchParams, query, currentQuery]);

  return (
    <div className="search">
      <Image
        src="/assets/icons/search.svg"
        alt="search"
        width={24}
        height={24}
      />

      <Input
        className="search-field"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};