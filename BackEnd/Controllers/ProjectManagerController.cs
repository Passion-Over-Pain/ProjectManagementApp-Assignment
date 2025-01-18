using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using IT_ProjectManagementApp.Controllers.Models;

[ApiController]
[Route("api/projectmanager")]
public class ProjectManagerController : ControllerBase
{
    private readonly AppDBContext _context;

    public ProjectManagerController(AppDBContext context)
    {
        _context = context;
    }

    // Create a Project
    [HttpPost("create-project")]
    public async Task<IActionResult> CreateProject([FromBody] Project project)
    {
        if (ModelState.IsValid)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Project created successfully" });
        }

        return BadRequest(ModelState);
    }

    // Create and assign a task to an employee
    [HttpPost("create-task")]
    public async Task<IActionResult> CreateTask([FromBody] AppTask task)
    {
        if (ModelState.IsValid)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Task created and assigned successfully" });
        }

        return BadRequest(ModelState);
    }

    // Get tasks by status
    [HttpGet("get-tasks-by-status/{status}")]
    public async Task<IActionResult> GetTasksByStatus(string status)
    {
        var tasks = await _context.Tasks
            .Where(t => t.TaskStatus == status)
            .ToListAsync();

        return Ok(tasks);
    }

    // Get tasks assigned to a specific employee
    [HttpGet("get-tasks-by-employee/{employeeId}")]
    public async Task<IActionResult> GetTasksByEmployee(int employeeId)
    {
        var tasks = await _context.Tasks
            .Where(t => t.AssignedToEmployeeId == employeeId)
            .ToListAsync();

        return Ok(tasks);
    }

    // Get all projects
    [HttpGet("get-projects")]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _context.Projects.ToListAsync();
        return Ok(projects);
    }

    // Get a specific project by ID
    [HttpGet("get-project/{id}")]
    public async Task<IActionResult> GetProjectById(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    // Update a project
    [HttpPut("update-project/{id}")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
    {
       

        // Check if the project exists
        var existingProject = await _context.Projects.FindAsync(id);
        if (existingProject == null)
        {
            return NotFound();
        }

        // Update the properties
        existingProject.ProjectName = project.ProjectName;
        existingProject.ProjectStatus = project.ProjectStatus;
        existingProject.ProjectDesc = project.ProjectDesc;
        existingProject.StartDate = project.StartDate;
        existingProject.EndDate = project.EndDate;

        // Save changes
        await _context.SaveChangesAsync();

        return Ok(new { message = "Project updated successfully" });
    }

    // Delete a project
    [HttpDelete("delete-project/{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound();
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Project deleted successfully" });
    }

    // Get all tasks
    [HttpGet("get-tasks")]
    public async Task<IActionResult> GetTasks()
    {
        var tasks = await _context.Tasks.ToListAsync();
        return Ok(tasks);
    }

    // Get a specific task by ID
    [HttpGet("get-task/{id}")]
    public async Task<IActionResult> GetTaskById(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    // Update a task
    [HttpPut("update-task/{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] AppTask task)
    {
            var existingTask = await _context.Tasks.FindAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            // Update the properties
            existingTask.TaskName = task.TaskName;
            existingTask.TaskStatus = task.TaskStatus;
            existingTask.TaskDesc = task.TaskDesc;
            existingTask.AssignedTime = task.AssignedTime;
            existingTask.CompletedTime = task.CompletedTime;
            existingTask.AssignedToEmployeeId = task.AssignedToEmployeeId;
            existingTask.ProjectId = task.ProjectId;

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task updated successfully" });
    }

    // Delete a task
    [HttpDelete("delete-task/{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Task deleted successfully" });
    }
}
