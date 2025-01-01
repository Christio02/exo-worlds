package com.exo.exoworldsbackend.model

import jakarta.persistence.*


@Entity
@Table(name = "planets")
data class Planet(

    @Column(nullable = false, unique = true)
    val name: String,

    @Column(nullable = false)
    val mass: Double,

    @Column(nullable = false)
    val radius: Double,

    @Column(name = "habitability_index", nullable = false)
    val habitabilityIndex: Double,

    @Column(nullable = false)
    val imageType: String,

    @Basic(fetch = FetchType.LAZY)
    @Column(nullable = false, columnDefinition = "bytea")
    val imageData: ByteArray,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Planet
        return id == other.id
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}