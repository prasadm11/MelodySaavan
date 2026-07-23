using JioSaavanTrial.Database;
using JioSaavanTrial.Repositories;
using JioSaavanTrial.Services;
using Dapper;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
builder.Services.AddControllers();
builder.Services.AddSingleton<DatabaseConnection>();
builder.Services.AddScoped<PersonalizationRepository>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();

builder.Services.AddHttpClient<JioSaavnService>(client =>
{
    client.BaseAddress = new Uri("https://www.jiosaavn.com/api.php");
});

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PublicApi", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<CryptoService>();
builder.Services.AddScoped<MusicProfileService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    //app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.RoutePrefix = string.Empty;
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MelodySaavan API v1");
    });
//}

app.UseHttpsRedirection();

app.UseCors("PublicApi");

app.UseAuthorization();

app.MapControllers();

app.Run();
