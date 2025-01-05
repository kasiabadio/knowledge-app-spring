package pl.inwebit.knowledge;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;

@Controller
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class,
        SecurityAutoConfiguration.class,
        ManagementWebSecurityAutoConfiguration.class})
public class WebApplication implements ErrorController {
    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }

    private static final String PATH = "/error";

    @RequestMapping(value = PATH)
    public String error() {
        return "forward:/index.html";
    }
}
