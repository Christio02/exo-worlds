package com.exo.exoworldsbackend.graphql.types

data class PlanetDTO(
    val id: Long,
    val name: String,
    val mass: Double,
    val radius: Double,
    val habitabilityIndex: Double,
    val imageType: String,
    val imageData: String
)