package com.exo.exoworldsbackend

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PlanetRepository : JpaRepository<Planet, Long>