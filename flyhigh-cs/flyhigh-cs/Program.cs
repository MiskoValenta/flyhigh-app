
using API.Services.Teams;
using Application.Common.Interfaces;
using Application.Interfaces.Events;
using Application.Interfaces.Matches;
using Application.Interfaces.Services;
using Application.Interfaces.Teams;
using Application.Interfaces.Users;
using Application.Services.Events;
using Application.Services.Matches;
using Application.Services.Teams;
using Application.Services.Users;
using Domain.Entities.Matches.Rules;
using Domain.Repositories.Events;
using Domain.Repositories.Matches;
using Domain.Repositories.Teams;
using Domain.Repositories.Users;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories.Events;
using Infrastructure.Persistence.Repositories.Matches;
using Infrastructure.Persistence.Repositories.Teams;
using Infrastructure.Persistence.Repositories.Users;
using Infrastructure.Security;
using Infrastructure.Services.Emails;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var builder = WebApplication.CreateBuilder(args);

      builder.Services.AddDbContext<FlyHighDbContext>(options =>
          options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

      builder.Services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<FlyHighDbContext>());

      builder.Services.AddCors(options =>
      {
        options.AddPolicy("FrontendPolicy", policy =>
        {
          policy.WithOrigins("http://localhost:3000", "http://192.168.56.1:3000", "https://flyhigh.cz")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
      });
      builder.Services.AddSingleton<ISetRules, VolleyballSetRules>();
      builder.Services.AddSingleton<IMatchRules, VolleyballMatchRules>();

      builder.Services.AddScoped<IUserRepository, UserRepository>();
      builder.Services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
      builder.Services.AddScoped<IJwtProvider, JwtProvider>();
      builder.Services.AddScoped<IAuthService, AuthService>();
      builder.Services.AddScoped<ITeamAuthorizationService, TeamAuthorizationService>();
      builder.Services.AddScoped<ITeamService, TeamService>();
      builder.Services.AddScoped<ITeamRepository, TeamRepository>();
      builder.Services.AddScoped<IMatchRepository, MatchRepository>();
      builder.Services.AddScoped<IMatchService, MatchService>();
      builder.Services.AddScoped<IEventRepository, EventRepository>();
      builder.Services.AddScoped<IEventService, EventService>();
      builder.Services.AddScoped<IUserService, UserService>();

      builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
      builder.Services.AddScoped<IEmailService, EmailService>();

      builder.Services.AddHostedService<CleanupExpiredInvitesService>();

      builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
          options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        });

      builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddJwtBearer(options =>
          {
            options.TokenValidationParameters = new TokenValidationParameters
            {
              ValidateIssuer = true,
              ValidateAudience = true,
              ValidateLifetime = true,
              ValidateIssuerSigningKey = true,
              ValidIssuer = builder.Configuration["Jwt:Issuer"],
              ValidAudience = builder.Configuration["Jwt:Audience"],
              IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
              ClockSkew = TimeSpan.Zero
            };

            options.Events = new JwtBearerEvents
            {
              OnMessageReceived = context =>
              {
                var token = context.Request.Cookies["accessToken"];
                if (context.Request.Cookies.ContainsKey("accessToken"))
                {
                  context.Token = token;
                }
                return Task.CompletedTask;
              }
            };
          });

      builder.Services.AddAuthorization();

      var app = builder.Build();

      using (var scope = app.Services.CreateScope())
      {
        var services = scope.ServiceProvider;
        try
        {
          var context = services.GetRequiredService<FlyHighDbContext>();
          context.Database.Migrate();
          Console.WriteLine("Databáze byla úspěšně migrována!");
        }
        catch (Exception ex)
        {
          Console.WriteLine($"Chyba při migraci databáze: {ex.Message}");
        }
      }

      app.UseCors("FrontendPolicy");
      app.UseAuthentication();
      app.UseAuthorization();
      app.MapControllers();

      app.Run();
    }
  }
}
