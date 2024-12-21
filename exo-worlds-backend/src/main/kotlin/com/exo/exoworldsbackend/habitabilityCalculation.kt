package com.exo.exoworldsbackend

import kotlin.math.pow
import kotlin.math.sqrt

fun calculateHabitabilityIndex(
    planetRadius: Double,
    planetMass: Double,
    orbitalPeriod: Double,
    equilibriumTemperature: Double?,
    stellarTemperature: Double,
    stellarRadius: Double
): Double {
    // 1. Planet Size
    val planetSizeScore = when {
        planetRadius < 0.5 -> 0.0 // Too small
        planetRadius in 0.5..1.5 -> 1.0 // Earth-like
        planetRadius in 1.5..2.5 -> 0.8
        else -> 0.5 // Too large
    }

    // 2. Planet Mass
    val planetMassScore = when {
        planetMass < 0.1 -> 0.0 // Too low gravity
        planetMass in 0.1..2.0 -> 1.0 // Earth-like
        planetMass in 2.0..5.0 -> 0.8
        else -> 0.5 // Too high gravity
    }

    // 3. Orbital Period and Habitable Zone
    val orbitalPeriodScore = calculateOrbitalPeriodScore(orbitalPeriod, stellarTemperature, stellarRadius)

    // 4. Equilibrium Temperature (if available)
    val temperatureScore = equilibriumTemperature?.let { calculateTemperatureScore(it) } ?: 0.5

    // 5. Overall Habitability (weighted average)
    val habitabilityIndex = 0.3 * planetSizeScore +
            0.25 * planetMassScore +
            0.3 * orbitalPeriodScore +
            0.15 * temperatureScore

    return habitabilityIndex
}

private fun calculateOrbitalPeriodScore(
    orbitalPeriod: Double,
    stellarTemperature: Double,
    stellarRadius: Double
): Double {
    // Calculate the habitable zone boundaries (rough estimation)
    val innerBoundary = 0.75 * sqrt(stellarRadius) * (stellarTemperature / 5778.0).pow(-0.5)
    val outerBoundary = 1.77 * sqrt(stellarRadius) * (stellarTemperature / 5778.0).pow(-0.5)

    return when {
        orbitalPeriod < innerBoundary -> 0.0 // Too hot
        orbitalPeriod in innerBoundary..outerBoundary -> 1.0 // Habitable zone
        orbitalPeriod > outerBoundary -> 0.0 // Too cold
        else -> 0.5
    }
}

private fun calculateTemperatureScore(equilibriumTemperature: Double): Double {
    return when {
        equilibriumTemperature < 250 -> 0.0 // Too cold
        equilibriumTemperature in 250.0..320.0 -> 1.0 // Ideal temperature range
        equilibriumTemperature > 320 -> 0.0 // Too hot
        else -> 0.5
    }
}