import React from 'react';
import { PlanetCardProps } from "../interfaces/planetInterface";

export const PlanetCard: React.FC<PlanetCardProps> = ({id, name, mass, radius, habitabilityIndex, imageType, imageData}) => {
    return (
        <div
            key={id}
            className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-blue-100 border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102"
        >
            {imageData ? (
                <img
                    src={`data:${imageType};base64,${imageData}`}
                    alt={`Planet ${name}`}
                    className="w-24 h-24 object-cover rounded-lg mb-4"
                    loading="lazy"
                />
            ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4 animate-pulse" />
            )}
            <h3 className="text-xl font-bold text-center text-gray-800 mb-3">{name}</h3>
            <ul className="w-full text-sm space-y-2 text-center text-gray-700">
                <li className="flex justify-between">
                    <span className="font-medium">Mass:</span>
                    <span>{mass.toFixed(2)} Earth masses</span>
                </li>
                <li className="flex justify-between">
                    <span className="font-medium">Radius:</span>
                    <span>{radius.toFixed(2)} Earth radii</span>
                </li>
                <li className="flex justify-between">
                    <span className="font-medium">Habitability:</span>
                    <span>{(habitabilityIndex * 100).toFixed(2)}%</span>
                </li>
            </ul>
        </div>
    );
};

