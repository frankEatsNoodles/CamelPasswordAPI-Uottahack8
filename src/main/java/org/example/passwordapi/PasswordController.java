package org.example.passwordapi;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {

    private final int SHIFT = 3;

    @GetMapping("/get/{username}")
    public String getPassword(){


        return "Password provided!";
    }

    @PostMapping("/post")
    public String savePassword(@RequestBody Map<String, Object> passwordData) {

        String password = (String) passwordData.get("password");
        if (password != null) {
            String encryptedPassword = EncryptionUtil.caesarEncrypt(password, SHIFT);
            System.out.println("Encrypted password: " + encryptedPassword);
            return "Password received and encrypted!";
        }
        return "No password provided!";
    }
}