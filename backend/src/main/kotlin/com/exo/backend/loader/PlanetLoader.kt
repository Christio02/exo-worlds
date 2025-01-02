package com.exo.backend.loader

import com.exo.backend.model.Planet
import com.exo.backend.repository.PlanetRepository
import com.exo.backend.utils.GetPlanetImage
import com.exo.backend.utils.calculateHabitabilityIndex
import jakarta.transaction.Transactional
import org.json.JSONArray
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import java.net.URI
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Component
class PlanetLoader @Autowired constructor(private val planetRepository: PlanetRepository) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        val query = """
           SELECT pl_name, pl_rade, pl_masse, pl_orbper, pl_eqt, pl_insol, 
           pl_orbeccen, pl_dens, st_teff, st_rad, st_mass, st_met, st_lum,
           st_age, st_logg, sy_dist 
           FROM pscomppars 
           WHERE pl_rade BETWEEN 0.5 AND 2.5 
           AND pl_masse IS NOT NULL 
           AND pl_masse < 10.0 
           AND st_teff BETWEEN 2500 AND 7500 
           AND (pl_orbeccen IS NULL OR pl_orbeccen < 0.6) 
           ORDER BY 
               CASE 
                   WHEN pl_eqt BETWEEN 200 AND 350 THEN 1 
                   WHEN pl_eqt BETWEEN 150 AND 450 THEN 2 
                   ELSE 3 
               END, 
               ABS(1 - pl_rade), 
               ABS(1 - pl_masse)
       """.trimIndent()

        try {
            val encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8)
            val tapUrl = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=$encodedQuery&format=json"
            processPlanetData(tapUrl)
        } catch (e: Exception) {
            println("Error processing planet data: ${e.message}")
            e.printStackTrace()
        }
    }

    private fun processPlanetData(url: String) {
        try {
            val connection = URI(url).toURL().openConnection()
            connection.setRequestProperty("Accept", "application/json")
            val response = connection.getInputStream().bufferedReader().use { it.readText() }
            val jsonArray = JSONArray(response)

            if (jsonArray.isEmpty) {
                println("No planet data received")
                return
            }

            if (jsonArray.length().toLong() == planetRepository.count()) {
                println("Database is up to date")
                return
            }

            jsonArray.forEach { planetJson ->
                processPlanetJson(planetJson as org.json.JSONObject)
            }
        } catch (e: Exception) {
            throw RuntimeException("Failed to process planet data: ${e.message}", e)
        }
    }

    private fun processPlanetJson(planetData: org.json.JSONObject) {
        try {
            val name = planetData.getString("pl_name") ?: return
            if (planetRepository.existsPlanetByName(name)) return

            // Required parameters
            val radius = planetData.getDouble("pl_rade")
            val mass = planetData.getDouble("pl_masse")
            val orbitalPeriod = planetData.optDouble("pl_orbper", Double.NaN)
            val eqTemp = planetData.optDouble("pl_eqt", Double.NaN)
            val starTemp = planetData.optInt("st_teff", 0)
            val starRadius = planetData.optDouble("st_rad", 0.0)

            // Additional parameters for improved habitability calculation
            val stellarMass = planetData.optDouble("st_mass", Double.NaN)
            val stellarMetallicity = planetData.optDouble("st_met", Double.NaN)
            val planetDensity = planetData.optDouble("pl_dens", Double.NaN)
            val insolation = planetData.optDouble("pl_insol", Double.NaN)
            val stellarLuminosity = planetData.optDouble("st_lum", Double.NaN)

            val habitabilityIndex = calculateHabitabilityIndex(
                planetRadius = radius,
                planetMass = mass,
                orbitalPeriod = orbitalPeriod,
                equilibriumTemperature = if (eqTemp.isNaN()) null else eqTemp,
                stellarTemperature = starTemp,
                stellarRadius = starRadius,
                stellarMass = if (stellarMass.isNaN()) null else stellarMass,
                stellarMetallicity = if (stellarMetallicity.isNaN()) null else stellarMetallicity,
                planetDensity = if (planetDensity.isNaN()) null else planetDensity,
                insolation = if (insolation.isNaN()) null else insolation
            )

            val (imageData, imageType) = GetPlanetImage.getImage(radius, eqTemp)

            val planet = Planet(
                name = name,
                radius = radius,
                mass = mass,
                habitabilityIndex = habitabilityIndex,
                imageData = imageData,
                imageType = imageType,
            )

            planetRepository.save(planet)
            println("Successfully added planet: ${planet.name}")
        } catch (e: Exception) {
            println("Error processing planet ${planetData.optString("pl_name", "unknown")}: ${e.message}")
        }
    }
}
