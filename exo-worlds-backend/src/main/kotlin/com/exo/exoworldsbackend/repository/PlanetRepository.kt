package com.exo.exoworldsbackend.repository

import com.exo.exoworldsbackend.model.Planet
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PlanetRepository : JpaRepository<Planet, Long> {
    fun existsPlanetByName(name: String): Boolean
}