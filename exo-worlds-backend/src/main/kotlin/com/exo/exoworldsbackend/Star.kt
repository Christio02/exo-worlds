package com.exo.exoworldsbackend

import jakarta.persistence.*

@Table(name = "stars")
data class Star(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @Column(nullable = false)
    val numPlanets: Int,
)