FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["flyhigh-cs/API.csproj", "flyhigh-cs/"]
COPY ["Application/Application.csproj", "Application/"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]

RUN dotnet restore "flyhigh-cs/API.csproj"

COPY . .
WORKDIR "/src/flyhigh-cs"
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS base
WORKDIR /app
EXPOSE 5000

ENV ASPNETCORE_HTTP_PORTS=5000
ENV ASPNETCORE_ENVIRONMENT=Development

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "API.dll"]