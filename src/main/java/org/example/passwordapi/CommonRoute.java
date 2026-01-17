package org.example.passwordapi;

import org.apache.camel.Exchange;
import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.rest.RestBindingMode;
import org.springframework.stereotype.Component;


import java.util.Map;

@Component
public class CommonRoute extends RouteBuilder {


    @Override
    public void configure() throws Exception {
        restConfiguration()
                .bindingMode(RestBindingMode.json)
                .dataFormatProperty("prettyPrint", "true")
                .enableCORS(true);



        rest("/v1/pass/vault")
                .post("/entries")
                .consumes("application/json")
                .produces("application/json")
                .to("direct:storeEntry");


        from("direct:storeEntry")
                .routeId("store-vault-entry")

                // Log request metadata (SAFE)
                .log(LoggingLevel.INFO,
                        "Incoming vault entry request from ${header.CamelHttpRemoteAddress}")

                // Validate required fields
                .validate().jsonpath("$.service")
                .validate().jsonpath("$.username")
                .validate().jsonpath("$.ciphertext")
                .validate().jsonpath("$.iv")
                .validate().jsonpath("$.salt")

                // Log minimal info only
                .log(LoggingLevel.DEBUG,
                        "Storing vault entry for service=${body[service]}, username=${body[username]}")

                // Example: store encrypted blob (replace with real persistence)
                .process(exchange -> {
                    Map<String, Object> body =
                            exchange.getIn().getBody(Map.class);

                    // TODO: persist to DB or file
                    // NEVER log ciphertext in production

                    exchange.getMessage().setBody(
                            Map.of(
                                    "status", "success",
                                    "message", "Vault entry stored"
                            )
                    );
                })

                .setHeader(Exchange.HTTP_RESPONSE_CODE, constant(201));
    }
}
