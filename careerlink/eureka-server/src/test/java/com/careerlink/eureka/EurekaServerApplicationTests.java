package com.careerlink.eureka;

import org.junit.jupiter.api.Test;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

class EurekaServerApplicationTests {
    @Test
    void applicationIsAnnotatedAsEurekaServer() {
        org.assertj.core.api.Assertions.assertThat(EurekaServerApplication.class)
                .hasAnnotation(EnableEurekaServer.class);
    }
}
