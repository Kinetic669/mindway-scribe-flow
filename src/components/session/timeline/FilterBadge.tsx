
"use client";

import { Button } from "@/components/ui/button";

type FilterBadgeProps = {
  filterType: string | null;
  onClearFilter: () => void;
};

export const FilterBadge = ({ filterType, onClearFilter }: FilterBadgeProps) => {
  if (!filterType) return null;
  
  return (
    <div className="mb-4 px-4 py-2 bg-gray-100 rounded-md text-sm flex justify-between items-center">
      <span className="px-2 py-1">Filtrowanie: {filterType}</span>
      <Button variant="ghost" size="sm" onClick={onClearFilter}>
        Wyczyść
      </Button>
    </div>
  );
};
