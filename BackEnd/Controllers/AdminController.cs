// Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
//using IT_ProjectManagementApp.Data;
using IT_ProjectManagementApp.Controllers.Models;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDBContext _context;

    public AdminController(AppDBContext context)
    {
        _context = context;
    }

    // Create an Employee (Project Manager, Systems Analyst, Web Developer)
    [HttpPost("create-employee")]
    public async Task<IActionResult> CreateEmployee([FromBody] Employee employee)
    {
        if (ModelState.IsValid)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Employee created successfully" });
        }

        return BadRequest(ModelState);
    }

    // Update Employee
    [HttpPut("update-employee/{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        employee.Name = updatedEmployee.Name;
        employee.Surname = updatedEmployee.Surname;
        employee.Email = updatedEmployee.Email;
        employee.Password = updatedEmployee.Password;
        employee.JobTitle = updatedEmployee.JobTitle;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Employee updated successfully" });
    }

    // Delete Employee
    [HttpDelete("delete-employee/{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        await _context.SaveChangesAsync();

        return Ok(new { message = "Employee deleted successfully" });
    }

    // Get list of all employees
    [HttpGet("employees")]
    public async Task<IActionResult> GetEmployees()
    {
        var employees = await _context.Employees.ToListAsync();
        return Ok(employees);
    }

    [HttpGet("get-employee-by-name")]
    public async Task<IActionResult> GetEmployeeByName(string name)
    {
        var employee = await _context.Employees
            .Where(e => e.Name.ToLower() == name.ToLower())
            .FirstOrDefaultAsync();
        return Ok(employee);
    }
    [HttpGet("get-employee-by-email")]
    public async Task<IActionResult> GetEmployeeByEmail(string email)
    {
        var employee = await _context.Employees
            .Where(e => e.Email.ToLower() == email.ToLower())
            .FirstOrDefaultAsync();
        return Ok(employee);
    }
}

