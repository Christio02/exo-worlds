import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PlanetFilter, SortOptions, SortField, SortDirection } from '../interfaces/filterTypes';

interface FilterSearchProps {
  onFilterChange: (filter: PlanetFilter) => void;
  onSortChange: (sort: SortOptions) => void;
  initialFilter?: PlanetFilter;
  initialSort?: SortOptions;
}

export const FilterSearch = ({
  onFilterChange,
  onSortChange,
  initialFilter = {},
  initialSort = { sortBy: 'NAME', sortDirection: 'ASC' },
}: FilterSearchProps) => {
  const [filter, setFilter] = useState<PlanetFilter>(initialFilter);
  const [sort, setSort] = useState<SortOptions>(initialSort);

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  useEffect(() => {
    onSortChange(sort);
  }, [sort, onSortChange]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, nameContains: e.target.value }));
  };

  const handleSortChange = (field: SortField) => {
    setSort(prev => ({ ...prev, sortBy: field }));
  };

  const handleSortDirectionChange = (direction: SortDirection) => {
    setSort(prev => ({ ...prev, sortDirection: direction }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-blue-500">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <Input
          placeholder="Search by name"
          value={filter.nameContains || ''}
          onChange={handleNameChange}
          className="flex-grow bg-slate-700 text-blue-100 placeholder-blue-300 border-blue-500"
        />
        <Select onValueChange={handleSortChange} value={sort.sortBy}>
          <SelectTrigger className="w-full md:w-[180px] bg-slate-700 text-blue-100 border-blue-500">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 text-blue-100 border-blue-500">
            <SelectItem value="NAME">Name</SelectItem>
            <SelectItem value="MASS">Mass</SelectItem>
            <SelectItem value="RADIUS">Radius</SelectItem>
            <SelectItem value="HABITABILITY_INDEX">Habitability</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleSortDirectionChange} value={sort.sortDirection}>
          <SelectTrigger className="w-full md:w-[180px] bg-slate-700 text-blue-100 border-blue-500">
            <SelectValue placeholder="Sort direction" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 text-blue-100 border-blue-500">
            <SelectItem value="ASC">Ascending</SelectItem>
            <SelectItem value="DESC">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Accordion type="single" collapsible className="bg-slate-700 rounded-md">
        <AccordionItem value="advanced-filters" className="border-blue-500">
          <AccordionTrigger className="text-blue-100 hover:text-blue-300 px-4">
            Advanced Filters
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minMass" className="text-blue-200">
                  Min Mass
                </Label>
                <Input
                  id="minMass"
                  name="minMass"
                  type="number"
                  value={filter.minMass || ''}
                  onChange={handleFilterChange}
                  placeholder="Min mass"
                  className="bg-slate-600 text-blue-100 placeholder-blue-300 border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="maxMass" className="text-blue-200">
                  Max Mass
                </Label>
                <Input
                  id="maxMass"
                  name="maxMass"
                  type="number"
                  value={filter.maxMass || ''}
                  onChange={handleFilterChange}
                  placeholder="Max mass"
                  className="bg-slate-600 text-blue-100 placeholder-blue-300 border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="minRadius" className="text-blue-200">
                  Min Radius
                </Label>
                <Input
                  id="minRadius"
                  name="minRadius"
                  type="number"
                  value={filter.minRadius || ''}
                  onChange={handleFilterChange}
                  placeholder="Min radius"
                  className="bg-slate-600 text-blue-100 placeholder-blue-300 border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="maxRadius" className="text-blue-200">
                  Max Radius
                </Label>
                <Input
                  id="maxRadius"
                  name="maxRadius"
                  type="number"
                  value={filter.maxRadius || ''}
                  onChange={handleFilterChange}
                  placeholder="Max radius"
                  className="bg-slate-600 text-blue-100 placeholder-blue-300 border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="minHabitabilityIndex" className="text-blue-200">
                  Min Habitability
                </Label>
                <Input
                  id="minHabitabilityIndex"
                  name="minHabitabilityIndex"
                  type="number"
                  value={filter.minHabitabilityIndex || ''}
                  onChange={handleFilterChange}
                  placeholder="Min habitability"
                  className="bg-slate-600 text-blue-100 placeholder-blue-300 border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="maxHabitabilityIndex" className="text-blue-200">
                  Max Habitability
                </Label>
                <Input
                  id="maxHabitabilityIndex"
                  name="maxHabitabilityIndex"
                  type="number"
                  value={filter.maxHabitabilityIndex || ''}
                  onChange={handleFilterChange}
                  placeholder="Max habitability"
                  className="bg-slate-600 text-blue-100 placeholder-blue-300 border-blue-500"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
