using JioSaavanTrial.Services;

//var builder = WebApplication.CreateBuilder(args);
var options = new WebApplicationOptions
{
    Args = args
};

var builder = WebApplication.CreateBuilder(options);

// Remove default appsettings providers
builder.Configuration.Sources.Clear();

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: false)
    .AddEnvironmentVariables();

// Add services to the container.

builder.Services.AddControllers();

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
