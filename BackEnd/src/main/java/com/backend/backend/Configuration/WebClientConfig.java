package com.backend.backend.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
//CONFIGURE WEBCLIENT
public class WebClientConfig
{
    @Bean
    public WebClient.Builder webClient()
    {
        return WebClient.builder();
    }

}
