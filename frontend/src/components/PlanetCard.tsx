import { memo } from 'react';
import { PlanetCardProps } from '../interfaces/planetInterface';

export const PlanetCard = memo(
  ({ id, name, mass, radius, habitabilityIndex, imageType, imageData }: PlanetCardProps) => {
    return (
      <div
        key={id}
        className="flex flex-col items-center p-6 bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        {imageData ? (
          <img
            src={`data:${imageType};base64,${imageData}`}
            alt={`Planet ${name}`}
            className="w-32 h-32 object-cover rounded-full mb-6 ring-4 ring-blue-400 ring-opacity-50"
            loading="lazy"
          />
        ) : (
          <div className="w-32 h-32 bg-slate-700 rounded-full mb-6 animate-pulse ring-4 ring-blue-400 ring-opacity-50" />
        )}
        <h3 className="text-2xl font-bold text-center text-blue-300 mb-4">{name}</h3>
        <ul className="w-full text-sm space-y-2 text-slate-300">
          <li className="flex justify-between">
            <span className="font-medium text-blue-200">Mass:</span>
            <span>{mass.toFixed(2)} Earth masses</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium text-blue-200">Radius:</span>
            <span>{radius.toFixed(2)} Earth radii</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium text-blue-200">Habitability:</span>
            <span
              className="font-semibold"
              style={{ color: `hsl(${habitabilityIndex * 120}, 100%, 50%)` }}
            >
              {(habitabilityIndex * 100).toFixed(2)}%
            </span>
          </li>
        </ul>
      </div>
    );
  }
);

PlanetCard.displayName = 'PlanetCard';
