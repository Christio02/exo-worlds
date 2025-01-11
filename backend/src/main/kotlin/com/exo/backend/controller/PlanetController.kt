package com.exo.backend.controller

import com.exo.backend.graphql.types.PlanetDTO
import com.exo.backend.model.*
import com.exo.backend.repository.PlanetRepository
import com.exo.backend.utils.GetPlanetImage
import com.exo.backend.utils.calculateHabitabilityIndex
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.domain.Specification
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import jakarta.persistence.criteria.Predicate
import java.util.*

@Controller
class PlanetController(private val planetRepository: PlanetRepository) {

    @QueryMapping
    fun planets(
        @Argument filter: PlanetFilter?,
        @Argument sortBy: SortField?,
        @Argument sortDirection: SortDirection?
    ): List<PlanetDTO> {
        val sort = when (sortBy) {
            SortField.NAME -> Sort.by(
                if (sortDirection == SortDirection.DESC) Sort.Direction.DESC else Sort.Direction.ASC,
                "name"
            )
            SortField.MASS -> Sort.by(
                if (sortDirection == SortDirection.DESC) Sort.Direction.DESC else Sort.Direction.ASC,
                "mass"
            )
            SortField.RADIUS -> Sort.by(
                if (sortDirection == SortDirection.DESC) Sort.Direction.DESC else Sort.Direction.ASC,
                "radius"
            )
            SortField.HABITABILITY_INDEX -> Sort.by(
                if (sortDirection == SortDirection.DESC) Sort.Direction.DESC else Sort.Direction.ASC,
                "habitabilityIndex"
            )
            null -> Sort.by(Sort.Direction.ASC, "id")
        }

        val specification = filter?.let { buildSpecification(it) }

        val planets = if (specification != null) {
            planetRepository.findAll(specification, sort)
        } else {
            planetRepository.findAll(sort)
        }

        return planets.map { it.toDTO() }
    }

    @QueryMapping
    fun planet(@Argument id: String): PlanetDTO? =
        planetRepository.findById(id.toLong()).map { it.toDTO() }.orElse(null)


    private fun buildSpecification(filter: PlanetFilter): Specification<Planet> {
        return Specification<Planet> { root, _, criteriaBuilder ->
            val predicates = mutableListOf<Predicate>()

            filter.minMass?.let {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("mass"), it))
            }
            filter.maxMass?.let {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("mass"), it))
            }
            filter.minRadius?.let {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("radius"), it))
            }
            filter.maxRadius?.let {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("radius"), it))
            }
            filter.minHabitabilityIndex?.let {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("habitabilityIndex"), it))
            }
            filter.maxHabitabilityIndex?.let {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("habitabilityIndex"), it))
            }
            filter.nameContains?.let {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    "%${it.lowercase()}%"
                ))
            }

            criteriaBuilder.and(*predicates.toTypedArray())
        }
    }



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