package org.example.passwordapi;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;

import java.util.Map;

public class SaveProcess implements Processor {



    @Override
    public void process(Exchange exchange) throws Exception {
        Map<String, Object> body =
                exchange.getIn().getBody(Map.class);

        // add mongo db connection
        // NEVER log ciphertext in production

        exchange.getMessage().setBody(
                Map.of(
                        "status", "success",
                        "message", "Vault entry stored"
                )
        );
    }
}
