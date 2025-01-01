package com.exo.exoworldsbackend.controller

import com.exo.exoworldsbackend.graphql.types.PlanetDTO
import com.exo.exoworldsbackend.model.Planet
import com.exo.exoworldsbackend.repository.PlanetRepository
import com.exo.exoworldsbackend.utils.GetPlanetImage
import com.exo.exoworldsbackend.utils.calculateHabitabilityIndex
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import java.util.*

@Controller
class PlanetController(private val planetRepository: PlanetRepository) {

    @QueryMapping
    fun planets(): List<PlanetDTO> {
        val allPlanets = planetRepository.findAll()
        println("Found ${allPlanets.size} planets")
        return allPlanets.map {
            println("Converting planet: ${it.name}")
            it.toDTO()
        }
    }

    @QueryMapping
    fun planet(@Argument id: String): PlanetDTO? =
        planetRepository.findById(id.toLong()).map { it.toDTO() }.orElse(null)

    @MutationMapping
    fun createPlanet(
        @Argument name: String,
        @Argument mass: Double,
        @Argument radius: Double,
        @Argument orbitalPeriod: Double,
        @Argument planetTemperature: Double?,
        @Argument stellarTemperature: Int,
        @Argument stellarRadius: Double
    ): Planet {
        val habitabilityIndex = calculateHabitabilityIndex(
            planetRadius = radius,
            planetMass = mass,
            orbitalPeriod = orbitalPeriod,
            equilibriumTemperature = planetTemperature,
            stellarTemperature = stellarTemperature,
            stellarRadius = stellarRadius
        )

        val (imageData, imageType) = GetPlanetImage.getImage(radius, planetTemperature ?: Double.NaN)

        val planet = Planet(
            name = name,
            mass = mass,
            radius = radius,
            habitabilityIndex = habitabilityIndex,
            imageData = imageData,
            imageType = imageType
        )

        return planetRepository.save(planet)
    }

    private fun Planet.toDTO(): PlanetDTO {
        return PlanetDTO(
            id = this.id,
            name = this.name,
            mass = this.mass,
            radius = this.radius,
            habitabilityIndex = this.habitabilityIndex,
            imageType = this.imageType,
            imageData = Base64.getEncoder().encodeToString(this.imageData)
        )
    }
}