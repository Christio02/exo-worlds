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

    @QueryMapping
    fun paginatedPlanets(
        @Argument page: Int,
        @Argument size: Int = 10,
        @Argument sortBy: SortField = SortField.NAME,
        @Argument sortDirection: SortDirection = SortDirection.ASC,
        @Argument filter: PlanetFilter? = null
    ): PagedPlanets {
        val sort = when (sortBy) {
            SortField.NAME -> Sort.by("name")
            SortField.MASS -> Sort.by("mass")
            SortField.RADIUS -> Sort.by("radius")
            SortField.HABITABILITY_INDEX -> Sort.by("habitabilityIndex")
        }.let { if (sortDirection == SortDirection.DESC) it.descending() else it.ascending() }

        val spec = filter?.let { buildSpecification(it) } ?: Specification.where(null)
        val pageable = PageRequest.of(page, size, sort)
        val result = planetRepository.findAll(spec, pageable)

        return PagedPlanets(
            planets = result.content.map { it.toDTO() },
            totalPages = result.totalPages,
            totalElements = result.totalElements,
            currentPage = result.number
        )
    }

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