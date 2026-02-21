# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/FRONTEND
COPY FRONTEND/package*.json ./
RUN npm install
COPY FRONTEND/ ./
RUN npm run build

# Stage 2: Build the Spring Boot backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/BACKEND
COPY BACKEND/pom.xml ./
RUN mvn dependency:go-offline -B
COPY BACKEND/src ./src
COPY --from=frontend-build /app/FRONTEND/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/BACKEND/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
