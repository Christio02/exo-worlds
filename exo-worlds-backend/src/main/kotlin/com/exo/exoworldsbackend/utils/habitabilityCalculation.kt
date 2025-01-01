package com.exo.exoworldsbackend.utils

import kotlin.math.abs
import kotlin.math.pow
import kotlin.math.sqrt

fun calculateHabitabilityIndex(
    planetRadius: Double,
    planetMass: Double,
    orbitalPeriod: Double,
    equilibriumTemperature: Double?,
    stellarTemperature: Int,
    stellarRadius: Double,
    stellarMass: Double? = null,
    stellarMetallicity: Double? = null,
    planetDensity: Double? = null,
    insolation: Double? = null
): Double {
    val planetSizeScore = calculatePlanetSizeScore(planetRadius, planetDensity)
    val planetMassScore = calculatePlanetMassScore(planetMass)
    val orbitalScore = calculateOrbitalScore(orbitalPeriod, stellarTemperature, stellarRadius, stellarMass, insolation)
    val temperatureScore = calculateTemperatureScore(equilibriumTemperature, insolation)
    val stellarScore = calculateStellarScore(stellarTemperature, stellarMetallicity)

    return (0.25 * planetSizeScore +
            0.25 * planetMassScore +
            0.2 * orbitalScore +
            0.2 * temperatureScore +
            0.1 * stellarScore).coerceIn(0.0, 1.0)
}

private fun calculatePlanetSizeScore(radius: Double, density: Double?): Double {
    val radiusScore = when {
        radius < 0.5 -> 0.0
        radius <= 1.5 -> 1.0
        radius <= 2.5 -> 0.8
        else -> 0.5
    }

    val densityScore = density?.let {
        when {
            it < 2.0 -> 0.3
            it <= 8.0 -> 1.0
            it <= 15.0 -> 0.7
            else -> 0.4
        }
    } ?: 0.7

    return 0.7 * radiusScore + 0.3 * densityScore
}

private fun calculatePlanetMassScore(mass: Double): Double = when {
    mass < 0.1 -> 0.0
    mass <= 2.0 -> 1.0
    mass <= 5.0 -> 0.8
    mass <= 10.0 -> 0.5
    else -> 0.3
}

private fun calculateOrbitalScore(
    orbitalPeriod: Double,
    stellarTemp: Int,
    stellarRadius: Double,
    stellarMass: Double?,
    insolation: Double?
): Double {
    if (stellarTemp == 0 || stellarRadius == 0.0) {
        return insolation?.let { calculateInsolationScore(it) } ?: 0.5
    }

    val mass = stellarMass ?: (stellarRadius.pow(1.5)) // Estimate mass if not provided
    val habitableZoneFactor = sqrt(mass)

    val innerBoundary = 0.75 * habitableZoneFactor * (stellarTemp / 5778.0).pow(-0.5)
    val outerBoundary = 1.77 * habitableZoneFactor * (stellarTemp / 5778.0).pow(-0.5)

    val orbitalScore = when {
        orbitalPeriod < innerBoundary -> 0.0
        orbitalPeriod in innerBoundary..outerBoundary -> 1.0
        orbitalPeriod > outerBoundary -> 0.0
        else -> 0.5
    }

    val insolationScore = insolation?.let { calculateInsolationScore(it) } ?: orbitalScore
    return maxOf(orbitalScore, insolationScore)
}

private fun calculateInsolationScore(insolation: Double): Double = when {
    insolation < 0.2 -> 0.0
    insolation <= 1.5 -> 1.0 - abs(1.0 - insolation) * 0.5
    insolation <= 2.0 -> 0.7
    else -> 0.0
}

private fun calculateTemperatureScore(eqTemp: Double?, insolation: Double?): Double {
    val tempScore = eqTemp?.let {
        when {
            it < 220 -> 0.0
            it <= 320 -> 1.0 - abs(270 - it) / 100
            it <= 370 -> 0.5
            else -> 0.0
        }
    }

    val insolScore = insolation?.let { calculateInsolationScore(it) }

    return tempScore ?: insolScore ?: 0.5
}

private fun calculateStellarScore(temp: Int, metallicity: Double?): Double {
    val tempScore = when {
        temp < 2500 -> 0.0
        temp <= 4000 -> 0.8  // M-dwarfs
        temp <= 5500 -> 1.0  // K & G stars
        temp <= 7500 -> 0.7  // F stars
        else -> 0.3
    }

    val metalScore = metallicity?.let {
        when {
            it < -0.5 -> 0.5  // Metal-poor
            it <= 0.5 -> 1.0  // Solar-like
            else -> 0.7      // Metal-rich
        }
    } ?: 0.7

    return 0.7 * tempScore + 0.3 * metalScore
}