# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["JioSaavanTrial.csproj", "."]
RUN dotnet restore "JioSaavanTrial.csproj"

COPY . .

RUN dotnet publish "JioSaavanTrial.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "JioSaavanTrial.dll"]