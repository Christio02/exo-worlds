package com.exo.exoworldsbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories("com.exo.exoworldsbackend")
class ExoWorldsBackendApplication

fun main(args: Array<String>) {
    runApplication<ExoWorldsBackendApplication>(*args)
}
