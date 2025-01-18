using IT_ProjectManagementApp.Controllers.Models; // Your custom namespaces
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Ensure that the connection string exists in appsettings.json as "DbConn"
builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConn"))
);

// Remove Identity services as you are not using Identity anymore
// Commented out since we're not using Identity
// builder.Services.AddIdentity<Employee, IdentityRole>()
//     .AddEntityFrameworkStores<AppDBContext>()
//     .AddDefaultTokenProviders();

// Configure your own authentication here if needed
// For example, you might use JWT tokens or session management

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000") // Your React app's URL
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});


// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Remove authentication middleware since Identity is not used
// app.UseAuthentication(); // Comment or remove this line
app.UseAuthorization();

// Map the controller endpoints
app.MapControllers();

// Run the application
app.Run();
