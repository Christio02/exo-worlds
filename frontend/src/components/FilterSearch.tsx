import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { PlanetFilter, SortOptions, SortField, SortDirection } from "../interfaces/filterTypes"

interface FilterSearchProps {
    onFilterChange: (filter: PlanetFilter) => void;
    onSortChange: (sort: SortOptions) => void;
    initialFilter?: PlanetFilter;
    initialSort?: SortOptions;
}

export const FilterSearch = ({ onFilterChange, onSortChange, initialFilter = {}, initialSort = { sortBy: 'NAME', sortDirection: 'ASC' } }: FilterSearchProps) => {
    const [filter, setFilter] = useState<PlanetFilter>(initialFilter)
    const [sort, setSort] = useState<SortOptions>(initialSort)

    useEffect(() => {
        onFilterChange(filter)
    }, [filter, onFilterChange])

    useEffect(() => {
        onSortChange(sort)
    }, [sort, onSortChange])

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFilter(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }))
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(prev => ({ ...prev, nameContains: e.target.value }))
    }

    const handleSortChange = (field: SortField) => {
        setSort(prev => ({ ...prev, sortBy: field }))
    }

    const handleSortDirectionChange = (direction: SortDirection) => {
        setSort(prev => ({ ...prev, sortDirection: direction }))
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-4 mb-4">
                <Input
                    placeholder="Search by name"
                    value={filter.nameContains || ''}
                    onChange={handleNameChange}
                    className="flex-grow"
                />
                <Select onValueChange={handleSortChange} value={sort.sortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NAME">Name</SelectItem>
                        <SelectItem value="MASS">Mass</SelectItem>
                        <SelectItem value="RADIUS">Radius</SelectItem>
                        <SelectItem value="HABITABILITY_INDEX">Habitability</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={handleSortDirectionChange} value={sort.sortDirection}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort direction" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ASC">Ascending</SelectItem>
                        <SelectItem value="DESC">Descending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Accordion type="single" collapsible>
                <AccordionItem value="advanced-filters">
                    <AccordionTrigger>Advanced Filters</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="minMass">Min Mass</Label>
                                <Input
                                    id="minMass"
                                    name="minMass"
                                    type="number"
                                    value={filter.minMass || ''}
                                    onChange={handleFilterChange}
                                    placeholder="Min mass"
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxMass">Max Mass</Label>
                                <Input
                                    id="maxMass"
                                    name="maxMass"
                                    type="number"
                                    value={filter.maxMass || ''}
                                    onChange={handleFilterChange}
                                    placeholder="Max mass"
                                />
                            </div>
                            <div>
                                <Label htmlFor="minRadius">Min Radius</Label>
                                <Input
                                    id="minRadius"
                                    name="minRadius"
                                    type="number"
                                    value={filter.minRadius || ''}
                                    onChange={handleFilterChange}
                                    placeholder="Min radius"
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxRadius">Max Radius</Label>
                                <Input
                                    id="maxRadius"
                                    name="maxRadius"
                                    type="number"
                                    value={filter.maxRadius || ''}
                                    onChange={handleFilterChange}
                                    placeholder="Max radius"
                                />
                            </div>
                            <div>
                                <Label htmlFor="minHabitabilityIndex">Min Habitability</Label>
                                <Input
                                    id="minHabitabilityIndex"
                                    name="minHabitabilityIndex"
                                    type="number"
                                    value={filter.minHabitabilityIndex || ''}
                                    onChange={handleFilterChange}
                                    placeholder="Min habitability"
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxHabitabilityIndex">Max Habitability</Label>
                                <Input
                                    id="maxHabitabilityIndex"
                                    name="maxHabitabilityIndex"
                                    type="number"
                                    value={filter.maxHabitabilityIndex || ''}
                                    onChange={handleFilterChange}
                                    placeholder="Max habitability"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
