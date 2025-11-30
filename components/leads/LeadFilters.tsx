'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { LeadFilters as LeadFiltersType, LeadStatus, LeadScore } from '@/lib/types';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFiltersChange: (filters: LeadFiltersType) => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export function LeadFilters({ filters, onFiltersChange }: LeadFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value as LeadStatus | 'all' });
  };

  const handleScoreChange = (value: string) => {
    onFiltersChange({ ...filters, score: value as LeadScore | 'all' });
  };

  const handleStateChange = (value: string) => {
    onFiltersChange({ ...filters, state: value });
  };

  const handleRatingChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minRating: values[0],
      maxRating: values[1],
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      score: 'all',
      industry: 'all',
      state: 'all',
      minRating: null,
      maxRating: null,
    });
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.score !== 'all' ||
    filters.state !== 'all' ||
    filters.minRating !== null ||
    filters.maxRating !== null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by business name, phone, or city..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
            <SelectItem value="not_interested">Not Interested</SelectItem>
            <SelectItem value="no_answer">No Answer</SelectItem>
            <SelectItem value="invalid">Invalid</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.score} onValueChange={handleScoreChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scores</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="warm">Warm</SelectItem>
            <SelectItem value="cold">Cold</SelectItem>
          </SelectContent>
        </Select>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Leads</SheetTitle>
              <SheetDescription>
                Apply filters to narrow down your lead list.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={filters.state} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Google Rating Range</Label>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[filters.minRating ?? 0, filters.maxRating ?? 5]}
                  onValueChange={handleRatingChange}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.minRating ?? 0} stars</span>
                  <span>{filters.maxRating ?? 5} stars</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
                <Button className="flex-1" onClick={() => setIsOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
