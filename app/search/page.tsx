import { Suspense } from "react";
import SearchClient from "./search-client";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading search…</div>}>
      <SearchClient />
    </Suspense>
  );
}
