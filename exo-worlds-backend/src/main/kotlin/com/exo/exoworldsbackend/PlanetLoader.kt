package com.exo.exoworldsbackend

import jakarta.transaction.Transactional
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import java.net.URI
import java.net.URLEncoder
import java.nio.charset.StandardCharsets


@Component
class PlanetLoader @Autowired constructor(private val planetRepository: PlanetRepository) : CommandLineRunner {

    private fun getPlanetImageUrl(planetName: String): String {
        try {
            val encodedPlanetName = URLEncoder.encode(planetName, StandardCharsets.UTF_8)

            val imageApiUrl = URI("https://images-api.nasa.gov/search?q=$encodedPlanetName").toURL()
            val connection = imageApiUrl.openConnection()
            connection.setRequestProperty("Accept", "application/json")

            val response = connection.getInputStream().bufferedReader().use { it.readText() }
            val jsonObject = JSONObject(response)

            val collection = jsonObject.getJSONObject("collection")
            val items = collection.getJSONArray("items")

            for (i in 0 until items.length()) {
                val item = items.getJSONObject(i)
                val data = item.getJSONArray("data").getJSONObject(0)

                if (data.getString("media_type") == "image") {
                    val links = item.getJSONArray("links")
                    for (j in 0 until links.length()) {
                        val link = links.getJSONObject(j)
                        if (link.getString("rel") == "preview") {
                            return link.getString("href")
                        }
                    }
                }
            }

            return "/api/placeholder/400/400"
        } catch (e: Exception) {
            println("Error fetching image for planet $planetName: ${e.message}")
            return "/api/placeholder/400/400"
        }
    }

    @Transactional
    override fun run(vararg args: String?) {
        val psQuery = """
            SELECT pl_name, pl_rade, pl_masse, pl_orbper, pl_eqt, st_teff, st_rad
            FROM ps
            WHERE pl_rade BETWEEN 0.5 AND 2.5
              AND pl_masse BETWEEN 0.1 AND 10
              AND default_flag = 1
        """.trimIndent()

        val pscompparsQuery = """
            SELECT pl_name, pl_rade, pl_masse, pl_orbper, pl_eqt, st_teff, st_rad
            FROM pscomppars
            WHERE pl_rade BETWEEN 0.5 AND 2.5
              AND pl_masse BETWEEN 0.1 AND 10
              AND default_flag = 1
        """.trimIndent()

        val toiQuery = """
            SELECT pl_name, pl_rade, pl_masse, pl_orbper, pl_eqt, st_teff, st_rad
            FROM toi
            WHERE pl_rade BETWEEN 0.5 AND 2.5
              AND pl_masse BETWEEN 0.1 AND 10
        """.trimIndent()

        val mlQuery = """
            SELECT pl_name, pl_rade, pl_masse, pl_orbper, pl_eqt, st_teff, st_rad
            FROM ml
            WHERE pl_rade BETWEEN 0.5 AND 2.5
              AND pl_masse BETWEEN 0.1 AND 10
        """.trimIndent()

        val queries = listOf(
            Pair(psQuery, "ps"),
            Pair(pscompparsQuery, "pscomppars"),
            Pair(toiQuery, "toi"),
            Pair(mlQuery, "ml")

        )

        for ((query, tableName) in queries) {
            try {
                val encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8)
                    .replace("+", "%20")

                val tapUrl = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=$encodedQuery&format=json"
                sendTAPRequestAndSaveData(tapUrl, tableName)
            } catch (e: Exception) {
                println("Error processing query for $tableName: ${e.message}")
                e.printStackTrace()
            }
        }


    }

    private fun sendTAPRequestAndSaveData(url: String, tableName: String) {
        try {
            val connection = URI(url).toURL().openConnection()
            connection.setRequestProperty("Accept", "application/json")
            val response = connection.getInputStream().bufferedReader().use { it.readText() }
            val jsonArray = JSONArray(response)

            for (i in 0 until jsonArray.length()) {
                val planetData = jsonArray.getJSONObject(i)

                val name = planetData.getString("pl_name")
                val radius = planetData.getDouble("pl_rade")
                val mass = planetData.getDouble("pl_masse")
                val orbitalPeriod = planetData.getDouble("pl_orbper")
                val eqTemp = planetData.optDouble("pl_eqt", Double.NaN)
                val starTemp = planetData.getDouble("st_teff")
                val starRadius = planetData.getDouble("st_rad")

                val habitabilityIndex = calculateHabitabilityIndex(
                    planetRadius = radius,
                    planetMass = mass,
                    orbitalPeriod = orbitalPeriod,
                    equilibriumTemperature = eqTemp,
                    stellarTemperature = starTemp,
                    stellarRadius = starRadius,
                )

                val planet = Planet(
                    name = name,
                    radius = radius,
                    mass = mass,
                    habitabilityIndex = habitabilityIndex,
                    image = getPlanetImageUrl(name)
                )
                planetRepository.save(planet)
            }

        } catch (e: JSONException) {
            println("Error parsing JSON: ${e.message}")
        } catch (e: Exception) {
            println("Error loading planet data from $tableName: ${e.message}")
            e.printStackTrace()
        }
    }
}