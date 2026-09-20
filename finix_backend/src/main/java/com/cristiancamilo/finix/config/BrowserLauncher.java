package com.cristiancamilo.finix.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import java.awt.Desktop;
import java.net.URI;

@Component
public class BrowserLauncher {

    @EventListener(ApplicationReadyEvent.class)
    public void launchBrowser() {
        String url = "http://localhost:8080";
        try {
            // Intentar con Desktop API primero (funciona bien en Windows/Mac con GUI)
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
                return;
            }
            
            // Fallback usando comandos del sistema operativo
            String os = System.getProperty("os.name").toLowerCase();
            Runtime rt = Runtime.getRuntime();
            if (os.contains("win")) {
                rt.exec("rundll32 url.dll,FileProtocolHandler " + url);
            } else if (os.contains("mac")) {
                rt.exec("open " + url);
            } else if (os.contains("nix") || os.contains("nux")) {
                // Prevenir fallos en servidores headless Linux
                String[] browsers = { "xdg-open", "google-chrome", "firefox", "mozilla", "epiphany", "konqueror", "netscape", "opera", "links", "lynx" };
                for (String browser : browsers) {
                    try {
                        if (rt.exec(new String[] { "which", browser }).waitFor() == 0) {
                            rt.exec(new String[] { browser, url });
                            break;
                        }
                    } catch (Exception e) {
                        // Ignorar y probar el siguiente
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("No se pudo abrir el navegador automáticamente: " + e.getMessage());
        }
    }
}
