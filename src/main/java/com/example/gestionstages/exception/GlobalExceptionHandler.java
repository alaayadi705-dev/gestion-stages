package com.example.gestionstages.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        e.printStackTrace(); // Log to console for the user to see in their terminal
        Map<String, Object> error = new HashMap<>();
        String message = e.getMessage();
        if (message == null) message = e.getClass().getName();
        
        error.put("message", "BACKEND ERROR: " + message);
        error.put("type", e.getClass().getSimpleName());
        
        // Optional: include the first few lines of stack trace for easier debugging
        if (e.getStackTrace().length > 0) {
            error.put("location", e.getStackTrace()[0].toString());
        }
        
        return ResponseEntity.status(500).body(error);
    }
}
