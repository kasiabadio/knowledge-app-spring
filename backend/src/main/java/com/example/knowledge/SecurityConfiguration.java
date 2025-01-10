// Copyright 2024 Ali Bouali
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Modified by Katarzyna Badio on 26.10.2024

package com.example.knowledge;
import com.example.knowledge.services.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    private final JwtFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults(""); // Remove the ROLE_ prefix requirement
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers(

                                        "/auth/**",
                                        "/api/auth/**",

                                        "/password-reset",
                                        "/register",
                                        "/activate-account",

                                        "/api/comments/add/**",

                                        "/api/users/getUserIdByEmail/**",
                                        "/api/users/getUserByEmail/**",
                                        "/api/users/allAuthors",

                                        "/api/knowledge/all",
                                        "/api/knowledge/getAuthorEmail/**",
                                        "/api/knowledge/getAllCategories/**",
                                        "/api/knowledge/getAllKnowledges/**",
                                        "/api/knowledge/getAllComments/**",
                                        "/api/knowledge/getById/**",
                                        "/api/knowledge/searchByPhrase/**",
                                        "/api/knowledge/searchAllByPhrase/**",

                                        "/api/roles/**",

                                        "/api/categories-knowledges/**",

                                        "/api/categories/all",
                                        "/api/categories",
                                        "/api/categories/searchAll/*"
                                ).permitAll()
                                .requestMatchers(
                                        "/api/knowledge/add/**",
                                        "/api/knowledge/update/**",
                                        "/api/knowledge/delete/**",

                                        "/api/users/deleteRole/**",
                                        "/api/users/addRole/**",
                                        "/api/users/changeNameAndSurname/**",
                                        "/api/users/all",

                                        "/api/comments/allCommentsForUser/**",
                                        "/api/comments/delete/**",

                                        "/api/categories/add/**",
                                        "/api/categories/delete/**"
                                )
                                .authenticated()
                                .anyRequest()
                                .authenticated()

                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // when we get a request we act on it as we don't know anything about this request
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // I want to check the authentication filter to check if user already has a token
                .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(customAuthenticationEntryPoint()));

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
            response.getOutputStream().println("{\"error\": \"Unauthorized access\"}");
        };
    }
}
