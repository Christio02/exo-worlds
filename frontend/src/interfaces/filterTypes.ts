export type SortField = 'NAME' | 'MASS' | 'RADIUS' | 'HABITABILITY_INDEX';
export type SortDirection = 'ASC' | 'DESC';

export interface PlanetFilter {
  nameContains?: string;
  minMass?: number;
  maxMass?: number;
  minRadius?: number;
  maxRadius?: number;
  minHabitabilityIndex?: number;
  maxHabitabilityIndex?: number;
}

export interface SortOptions {
  sortBy: SortField;
  sortDirection: SortDirection;
}
