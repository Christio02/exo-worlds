import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ChangeEvent, useEffect, useState } from 'react';
import { PlanetFilter, SortDirection, SortField, SortOptions } from '../interfaces/filterTypes';

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

  // Slider ranges
  const [massRange, setMassRange] = useState<[number, number]>([
    initialFilter.minMass ?? 0.1,
    initialFilter.maxMass ?? 10.0,
  ]);
  const [radiusRange, setRadiusRange] = useState<[number, number]>([
    initialFilter.minRadius ?? 0.5,
    initialFilter.maxRadius ?? 5.0,
  ]);
  const [habitabilityRange, setHabitabilityRange] = useState<[number, number]>([
    (initialFilter.minHabitabilityIndex ?? 0) * 100,
    (initialFilter.maxHabitabilityIndex ?? 1) * 100,
  ]);

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  useEffect(() => {
    onSortChange(sort);
  }, [sort, onSortChange]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, nameContains: e.target.value }));
  };

  const handleSortChange = (field: SortField) => {
    setSort(prev => ({ ...prev, sortBy: field }));
  };

  const handleSortDirectionChange = (direction: SortDirection) => {
    setSort(prev => ({ ...prev, sortDirection: direction }));
  };

  const handleMassRangeChange = (values: number[]) => {
    const [min, max] = values;
    setMassRange([min, max]);
    setFilter(prev => ({
      ...prev,
      minMass: min === 0.1 ? undefined : min,
      maxMass: max === 10.0 ? undefined : max,
    }));
  };

  const handleRadiusRangeChange = (values: number[]) => {
    const [min, max] = values;
    setRadiusRange([min, max]);
    setFilter(prev => ({
      ...prev,
      minRadius: min === 0.5 ? undefined : min,
      maxRadius: max === 5.0 ? undefined : max,
    }));
  };

  const handleHabitabilityRangeChange = (values: number[]) => {
    const [min, max] = values;
    setHabitabilityRange([min, max]);
    setFilter(prev => ({
      ...prev,
      minHabitabilityIndex: min === 0 ? undefined : min / 100,
      maxHabitabilityIndex: max === 100 ? undefined : max / 100,
    }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-blue-500">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <Input
          placeholder="Search by name"
          value={filter.nameContains || ''}
          onChange={handleNameChange}
          className="grow bg-slate-700 text-blue-100 placeholder-blue-300 border-blue-500"
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
            <div className="space-y-6">
              {/* Mass Range Slider */}
              <div>
                <Label className="text-blue-200 text-sm font-medium">
                  Mass Range: {massRange[0].toFixed(1)} - {massRange[1].toFixed(1)} Earth masses
                </Label>
                <Slider
                  value={massRange}
                  onValueChange={handleMassRangeChange}
                  min={0.1}
                  max={10.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              {/* Radius Range Slider */}
              <div>
                <Label className="text-blue-200 text-sm font-medium">
                  Radius Range: {radiusRange[0].toFixed(1)} - {radiusRange[1].toFixed(1)} Earth
                  radii
                </Label>
                <Slider
                  value={radiusRange}
                  onValueChange={handleRadiusRangeChange}
                  min={0.5}
                  max={5.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              {/* Habitability Range Slider */}
              <div>
                <Label className="text-blue-200 text-sm font-medium">
                  Habitability Range: {habitabilityRange[0].toFixed(0)}% -{' '}
                  {habitabilityRange[1].toFixed(0)}%
                </Label>
                <Slider
                  value={habitabilityRange}
                  onValueChange={handleHabitabilityRangeChange}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
