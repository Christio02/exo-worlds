package com.exo.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories(basePackages = ["com.exo.backend.repository"])
@EntityScan(basePackages = ["com.exo.backend.model"])
class BackendApplication

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
}