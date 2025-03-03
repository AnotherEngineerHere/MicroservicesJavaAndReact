# Etapa de construcción
FROM jelastic/maven:3.9.5-openjdk-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/productcatalog-1.0.0.jar app.jar
EXPOSE 9001
ENTRYPOINT ["java", "-jar", "app.jar"]
