package com.exo.exoworldsbackend

import jakarta.persistence.*


@Entity
@Table(name = "planets")
data class Planet(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    val mass: Double,

    @Column(nullable = false)
    val radius: Double,

    @Column(nullable = false)
    val habitabilityIndex: Double,

    @Column(nullable = false)
    val image: String,
)