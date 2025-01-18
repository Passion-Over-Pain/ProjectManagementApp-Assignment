using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace IT_ProjectManagementApp.Controllers.Models
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {

        }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer();

        //}

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<AppTask> Tasks { get; set; }

        

        protected override void OnModelCreating(ModelBuilder builder)
        {
          // Relationship: One Employee -> Many AppTasks
        builder.Entity<AppTask>()
            .HasOne(t => t.AssignedToEmployee)
            .WithMany(e => e.Tasks)
            .HasForeignKey(t => t.AssignedToEmployeeId)
            .OnDelete(DeleteBehavior.Restrict);  // Optional: Prevent cascade delete

        // Relationship: One Project -> Many AppTasks
        builder.Entity<AppTask>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);  // Optional: Allow cascading delete of tasks when project is deleted

        base.OnModelCreating(builder);

        }
    }

}
