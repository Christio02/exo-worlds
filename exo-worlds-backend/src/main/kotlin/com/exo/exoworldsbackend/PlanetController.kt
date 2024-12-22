package com.exo.exoworldsbackend

import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.graphql.data.method.annotation.SchemaMapping
import org.springframework.stereotype.Controller

@Controller
class PlanetController {
    @QueryMapping
    public Planet planetById(@Argument String id) {
        return;
    }

    @SchemaMapping

}


