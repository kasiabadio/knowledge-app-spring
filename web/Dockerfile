FROM amazoncorretto:17

WORKDIR /app

COPY target/web-1.jar app.jar

EXPOSE 8099

CMD ["java", "-jar", "app.jar"]
