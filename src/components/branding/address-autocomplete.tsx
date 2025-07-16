"use client";
import { useState, useRef } from "react";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
}

interface NominatimResult {
  place_id: string;
  display_name: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
    );
    const data = (await res.json()) as NominatimResult[];
    setSuggestions(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setShowSuggestions(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      void fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = (address: string) => {
    onSelect(address);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder ?? "Start typing address..."}
        autoComplete="off"
        onFocus={() => value && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <Card className="card-primary absolute z-10 mt-1 max-h-60 w-full overflow-auto">
          <ul>
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                className="hover:bg-muted cursor-pointer px-4 py-2 text-sm"
                onMouseDown={() => handleSelect(s.display_name)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
