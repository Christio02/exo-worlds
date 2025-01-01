package com.exo.exoworldsbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories(basePackages = ["com.exo.exoworldsbackend.repository"])
@EntityScan(basePackages = ["com.exo.exoworldsbackend.model"])
class ExoWorldsBackendApplication

fun main(args: Array<String>) {
    runApplication<ExoWorldsBackendApplication>(*args)
}