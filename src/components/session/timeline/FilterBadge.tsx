
"use client";

import { Button } from "@/components/ui/button";

type FilterBadgeProps = {
  filterType: string | null;
  onClearFilter: () => void;
};

export const FilterBadge = ({ filterType, onClearFilter }: FilterBadgeProps) => {
  if (!filterType) return null;
  
  return (
    <div className="mb-4 px-3 py-1.5 bg-gray-100 rounded-md text-sm flex justify-between items-center">
      <span>Filtrowanie: {filterType}</span>
      <Button variant="ghost" size="sm" onClick={onClearFilter}>
        Wyczyść
      </Button>
    </div>
  );
};
