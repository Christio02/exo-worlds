package com.exo.backend

import com.exo.backend.model.Planet
import com.exo.backend.repository.PlanetRepository
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.TestPropertySource

@DataJpaTest
@ActiveProfiles("test")
@Import(BackendApplication::class)
@TestPropertySource(locations = ["classpath:application-test.properties"])
class PlanetRepositoryTest {
    @Autowired
    private lateinit var planetRepository: PlanetRepository

    @Test
    fun testPlanetRepository() {
        val testImageData = "test".toByteArray()

        val planet = Planet(
            name = "Test Planet",
            mass = 1.0,
            radius = 1.0,
            habitabilityIndex = 0.5,
            imageData = testImageData,
            imageType = "image/jpeg"
        )
        planetRepository.save(planet)

        assertTrue(planetRepository.existsPlanetByName("Test Planet"))
        assertFalse(planetRepository.existsPlanetByName("Non-existent Planet"))
    }

    @Test
    fun testPlanetNotFound() {
        assertFalse(planetRepository.existsPlanetByName("Non-existent Planet"))
    }

    @Test
    fun testFindAll() {
        val testPlanet = Planet(
            name = "Test Planet",
            mass = 1.0,
            radius = 1.0,
            habitabilityIndex = 0.5,
            imageData = "test".toByteArray(),
            imageType = "image/jpeg"
        )
        planetRepository.save(testPlanet)

        val planets = planetRepository.findAll()
        assert(planets.isNotEmpty()) { "No planets found in the database!" }
        println(planets)
    }
}