FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY . .
RUN mvn -q -pl application-service -am package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/application-service/target/application-service-1.0.0.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","/app/app.jar"]
