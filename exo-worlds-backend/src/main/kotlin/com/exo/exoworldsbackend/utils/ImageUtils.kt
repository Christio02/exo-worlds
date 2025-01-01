package com.exo.exoworldsbackend.utils

import org.springframework.core.io.ClassPathResource
import java.io.ByteArrayOutputStream
import java.util.*
import javax.imageio.IIOImage
import javax.imageio.ImageIO
import javax.imageio.plugins.jpeg.JPEGImageWriteParam

class ImageUtils {
    companion object {
        fun loadAndCompressImage(path: String): Pair<ByteArray, String> {
            try {
                val resource = ClassPathResource("images/$path")
                println("Loading image from: ${resource.path}")

                ByteArrayOutputStream().use { output ->
                    resource.inputStream.use { input ->
                        val bufferedImage = ImageIO.read(input)
                            ?: throw IllegalStateException("Could not read image: $path")

                        val writer = ImageIO.getImageWritersByFormatName("jpg").next()
                        val ios = ImageIO.createImageOutputStream(output)
                        writer.output = ios

                        val writeParam = JPEGImageWriteParam(Locale.getDefault()).apply {
                            compressionMode = javax.imageio.ImageWriteParam.MODE_EXPLICIT
                            compressionQuality = 0.8f
                        }

                        writer.write(null, IIOImage(bufferedImage, null, null), writeParam)
                        ios.flush()
                        writer.dispose()

                        return Pair(output.toByteArray(), "image/jpeg")
                    }
                }
            } catch (e: Exception) {
                println("Error loading image: ${e.message}")
                e.printStackTrace()
                throw e
            }
        }
    }
}