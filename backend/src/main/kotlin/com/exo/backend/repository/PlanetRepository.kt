package com.exo.backend.repository

import com.exo.backend.model.Planet
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface PlanetRepository : JpaRepository<Planet, Long>, JpaSpecificationExecutor<Planet> {
    fun existsPlanetByName(name: String): Boolean
}