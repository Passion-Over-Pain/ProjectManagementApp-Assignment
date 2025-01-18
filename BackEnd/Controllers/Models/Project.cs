using Microsoft.EntityFrameworkCore.Metadata.Internal;

using System.ComponentModel.DataAnnotations;

namespace IT_ProjectManagementApp.Controllers.Models

{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(50)]
        public string ProjectName { get; set; }
        [Required]
        [StringLength(50)]
        public string ProjectStatus { get; set; }

        [Required]
        [StringLength(50)]
        public string ProjectDesc { get; set; }

        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public ICollection<AppTask> Tasks { get; set; } = new List<AppTask>(); // Navigation property
    }
}
