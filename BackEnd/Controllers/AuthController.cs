// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using IT_ProjectManagementApp.Controllers.Models;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDBContext _context;

    public AuthController(AppDBContext context)
    {
        _context = context;
    }

    // Login action
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == loginDto.Email && e.Password == loginDto.Password);

        if (employee == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // You can set a session or a token here if needed
        return Ok(new { message = "Login successful", employeeId = employee.EmployeeId });
    }

    // Logout action (if needed, otherwise just handle session/token clearing on the client-side)
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Handle logout (e.g., clear session or token)
        return Ok(new { message = "Logout successful" });
    }
}

// DTO for login
public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}
