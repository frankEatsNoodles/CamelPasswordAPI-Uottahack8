package org.example.passwordapi;

import org.springframework.web.bind.annotation.*;
import java.net.URL;
import java.net.HttpURLConnection;

import java.io.OutputStream;
import java.util.Map;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {

    DBManager dbManager;


    public PasswordController() {
        this.dbManager = DBManager.getInstance();
    }


    @GetMapping("/get/{username}")
    public String getPassword(@PathVariable String username){

        boolean existence = dbManager.userExist(username);

        if (existence) {
            String password = dbManager.getPassword(username);

            System.out.println("Username: " + username);
            System.out.println("Password: " + password);

            return "Success";
        }
        return "No Success";
    }

    @PostMapping("/post")
    public String savePass(@RequestBody Map<String, Object> passwordData) {

        String password = (String) passwordData.get("password");
        String username = (String) passwordData.get("username");
        if (password != null) {

            dbManager.savePassword(username, password);

            return "Password received and encrypted!";
        }
        return "No password provided!";
    }
}