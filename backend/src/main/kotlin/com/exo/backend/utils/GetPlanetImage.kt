package com.exo.backend.utils

class GetPlanetImage {
    companion object {
        fun getImage(radius: Double, eqTemp: Double): Pair<ByteArray, String> {
            val tempCategory = when {
                !eqTemp.isNaN() && eqTemp < 200 -> "cold-rocky"
                !eqTemp.isNaN() && eqTemp > 350 -> "hot-rocky"
                else -> "temperate-rocky"
            }

            val sizeCategory = when {
                radius <= 1.2 -> "earth-like"
                radius <= 1.6 -> "super-earth"
                else -> "mini-neptune"
            }

            val imagePath = "$tempCategory-$sizeCategory.jpg"
            return ImageUtils.loadAndCompressImage(imagePath)
        }
    }
}