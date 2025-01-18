using System.ComponentModel.DataAnnotations;

namespace IT_ProjectManagementApp.Controllers.Models
{
    public class AppTask
    {
        //Named AppTask instead of task because of conflict with resreved system keyword "Task"
        [Key]
        public int TaskId { get; set; }

        [Required]
        [StringLength(50)]
        public string TaskName { get; set; }
        [Required]
        [StringLength(50)]
        public string TaskDesc { get; set; }

        [Required]
        [StringLength(50)]
        public string TaskStatus { get; set; } = "To Start"; // "To Start", "In Progress", "Complete"

        [Required]
        public DateTime? AssignedTime { get; set; }

        [Required]
        public DateTime? CompletedTime { get; set; }
        [Required]
        public int AssignedToEmployeeId { get; set; } // Foreign Key to User
       
        public Employee AssignedToEmployee { get; set; } // Navigation Property
        [Required]
        public int ProjectId { get; set; } // Foreign Key to Project
        
        public Project Project { get; set; } // Navigation property to Project
    }
}
