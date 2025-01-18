using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

using System.ComponentModel.DataAnnotations;
namespace IT_ProjectManagementApp.Controllers.Models
{
    public class Employee
    {
        [Key]
        public int  EmployeeId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string Surname { get; set; }

        [Required]
        [StringLength(50)]
        public string JobTitle { get; set; }

        [Required]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(50)]
        public string Password { get; set; }

        public ICollection<AppTask> Tasks { get; set; } = new List<AppTask>(); // Navigation property
    }
}
