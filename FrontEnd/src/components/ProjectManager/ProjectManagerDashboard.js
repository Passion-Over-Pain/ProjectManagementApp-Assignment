   import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProjectManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]); // Added for employees list
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchedEmployee, setSearchedEmployee] = useState(null);
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectDesc: "",
    projectStatus: "To Start", // Default status
    startDate: "", // Added field
    endDate: "", // Added field
  });
  const [newTask, setNewTask] = useState({
    taskName: "",
    taskDesc: "",
    taskStatus: "To Start", // Default status
    projectId: null,
    assignedToEmployeeId: null,
    assignedTime: "",
    completedTime: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchEmployees(); // Fetch employees when the dashboard loads
  }, []);

  // Fetch projects from the API
  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5220/api/projectmanager/get-projects"
      );
      setProjects(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching projects");
    }
  };

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5220/api/projectmanager/get-tasks"
      );
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching tasks");
    }
  };

  // Fetch employees for task assignment
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5220/api/admin/employees"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching employees");
    }
  };

  // Fetch tasks by employee ID
  const fetchTasksByEmployee = async (employeeId) => {
    try {
      if (employeeId == "") {
        fetchTasks();
        toast.success("Displaying All tasks.");
      } else {
        const response = await axios.get(
          `http://localhost:5220/api/projectmanager/get-tasks-by-employee/${employeeId}`
        );
        setTasks(response.data);
        toast.success("Tasks filtered by employee");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching tasks by employee");
    }
  };

  const fetchTasksByStatus = async (status) => {
    try {
      if (status == "") {
        fetchTasks();
        toast.success("Displaying All tasks.");
      } else {
        const response = await axios.get(
          `http://localhost:5220/api/projectmanager/get-tasks-by-status/${status}`
        );
        setTasks(response.data);
        toast.success("Tasks filtered by status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching tasks by status");
    }
  };
  const handleSearchEmployee = async () => {
    if (!searchName.trim()) {
      toast.error("Please enter an employee name to search");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5220/api/admin/get-employee-by-name?name=${searchName}`
      );
      setSearchedEmployee(response.data);
      document.getElementById(`allEmployees`).style.display = "none";
      toast.success("Employee found!");
    } catch (error) {
      console.error(error);
      toast.error("Employee not found");
    }
  };

  // Handle Add or Edit Project
  const handleSaveProject = async () => {
    // Validation
    if (!newProject.projectName || !newProject.projectDesc) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (editProject) {
        // Update Project
        await axios.put(
          `http://localhost:5220/api/projectmanager/update-project/${editProject.projectId}`,
          newProject
        );
        toast.success("Project updated successfully!");
      } else {
        // Add Project (ID generated server-side)
        await axios.post(
          "http://localhost:5220/api/projectmanager/create-project",
          newProject
        );
        toast.success("Project added successfully!");
      }
      fetchProjects();
      handleCloseProjectModal();
    } catch (error) {
      console.error(error);
      toast.error("Error saving project");
    }
  };

  // Handle Add or Edit Task
  const handleSaveTask = async () => {
    // Validation
    if (
      !newTask.taskName ||
      !newTask.taskDesc ||
      !newTask.projectId ||
      !newTask.assignedToEmployeeId
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (editTask) {
        // Update Task
        await axios.put(
          `http://localhost:5220/api/projectmanager/update-task/${editTask.taskId}`,
          newTask
        );
        toast.success("Task updated successfully!");
      } else {
        // Add Task (ID generated server-side)
        await axios.post(
          "http://localhost:5220/api/projectmanager/create-task",
          newTask
        );
        toast.success("Task added successfully!");
      }
      fetchTasks();
      handleCloseTaskModal();
    } catch (error) {
      console.error(error);
      toast.error("Error saving task");
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5220/api/projectmanager/delete-project/${id}`
      );
      toast.success("Project deleted successfully!");
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting project");
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5220/api/projectmanager/delete-task/${id}`
      );
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting task");
    }
  };

  // Open modal for editing project
  const handleEditProject = (project) => {
    setEditProject(project);
    setNewProject({
      projectName: project.projectName,
      projectDesc: project.projectDesc,
      projectStatus: project.projectStatus,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
    });
    setShowProjectModal(true);
  };

  // Open modal for editing task
  const handleEditTask = (task) => {
    setEditTask(task);
    setNewTask({
      taskName: task.taskName,
      taskDesc: task.taskDesc,
      taskStatus: task.taskStatus,
      projectId: task.projectId,
      assignedToEmployeeId: task.assignedToEmployeeId,
      assignedTime: task.assignedTime || "",
      completedTime: task.completedTime || "",
    });
    setShowTaskModal(true);
  };

  // Handle close modal for projects
  const handleCloseProjectModal = () => {
    setEditProject(null);
    setNewProject({
      projectName: "",
      projectDesc: "",
      projectStatus: "To Start",
      startDate: "",
      endDate: "",
    });
    setShowProjectModal(false);
  };

  // Handle close modal for tasks
  const handleCloseTaskModal = () => {
    setEditTask(null);
    setNewTask({
      taskName: "",
      taskDesc: "",
      taskStatus: "To Start",
      projectId: null,
      assignedToEmployeeId: null,
      assignedTime: "",
      completedTime: "",
    });
    setShowTaskModal(false);
  };

  // Logout function
  const handleLogout = () => {
    navigate("/"); // Redirect to login page
    toast.success("Logged out successfully");
  };

  return (
    <div className="container mt-5">
      <h2 className="heading">
        Project Manager Dashboard
      </h2>
      <Button variant="danger" className="mb-3" onClick={handleLogout}>
        Logout
      </Button>

      {/* Add Project */}
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowProjectModal(true)}
      >
        Add New Project
      </Button>

      {/* Project Table */}
      <h3 className="heading2">Projects</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.projectId}>
              <td>{index + 1}</td>
              <td>{project.projectName}</td>
              <td>{project.projectDesc}</td>
              <td>{project.projectStatus}</td>
              <td>
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                <Button className="btnedit" /*Button classes */
                  variant="warning"
                  onClick={() => handleEditProject(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteProject(project.projectId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Task Table */}
      <h3 className="heading2">Tasks</h3>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowTaskModal(true)}
      >
        Add New Task
      </Button>
      <h6 className="heading6">Filter Tasks by Employee</h6>
      {/* Filter by Employee */}
      <Form.Select
        className="mb-3"
        onChange={(e) => fetchTasksByEmployee(e.target.value)}
      >
        <option value="">None</option>
        {employees.map((employee) => (
          <option key={employee.employeeId} value={employee.employeeId}>
            {employee.name} {employee.surname}
          </option>
        ))}
      </Form.Select>
      <h6 className="heading6">Filter Tasks by Status</h6>
      {/* Filter by Task Status */}
      <Form.Select
        className="mb-3"
        onChange={(e) => fetchTasksByStatus(e.target.value)}
      >
        <option value="">None</option>
        <option value="To Start">To Start</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </Form.Select>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assigned Employee</th>
            <th>Project</th>
            <th>Assigned Time</th>
            <th>Completed Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.taskId}>
              <td>{index + 1}</td>
              <td>{task.taskName}</td>
              <td>{task.taskDesc}</td>
              <td>{task.taskStatus}</td>
              <td>
                {
                  employees.find(
                    (employee) =>
                      employee.employeeId === task.assignedToEmployeeId
                  )?.name
                }
              </td>
              <td>
                {projects.find(
                  (project) => project.projectId === task.projectId
                )?.projectName || "N/A"}
              </td>
              <td>
                {task.assignedTime
                  ? new Date(task.assignedTime).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {task.completedTime
                  ? new Date(task.completedTime).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                <Button className="btnedit"
                  variant="warning"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteTask(task.taskId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="heading2">Current Employees</h2>
      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search employee by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Button className="mt-2" onClick={handleSearchEmployee}>
          Search Employee
        </Button>
        {searchedEmployee && (
          <div className="mt-4">
            <h4>Employee Details:</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Job Title</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchedEmployee.name}</td>
                  <td>{searchedEmployee.surname}</td>
                  <td>{searchedEmployee.jobTitle}</td>
                  <td>{searchedEmployee.email}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Job Title</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.employeeId}>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.surname}</td>
              <td>{employee.jobTitle}</td>
              <td>{employee.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Project Modal */}
      <Modal show={showProjectModal} onHide={handleCloseProjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editProject ? "Edit Project" : "Add Project"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={newProject.projectName}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter project description"
                value={newProject.projectDesc}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectDesc: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Project Status</Form.Label>
              <Form.Control
                as="select"
                value={newProject.projectStatus}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    projectStatus: e.target.value,
                  })
                }
              >
                <option>To Start</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newProject.startDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, startDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newProject.endDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, endDate: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProjectModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveProject}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Task Modal */}
      <Modal show={showTaskModal} onHide={handleCloseTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editTask ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task name"
                value={newTask.taskName}
                onChange={(e) =>
                  setNewTask({ ...newTask, taskName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter task description"
                value={newTask.taskDesc}
                onChange={(e) =>
                  setNewTask({ ...newTask, taskDesc: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Task Status</Form.Label>
              <Form.Control
                as="select"
                value={newTask.taskStatus}
                onChange={(e) =>
                  setNewTask({ ...newTask, taskStatus: e.target.value })
                }
              >
                <option>To Start</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Assign to Employee</Form.Label>
              <Form.Control
                as="select"
                value={newTask.assignedToEmployeeId}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    assignedToEmployeeId: e.target.value,
                  })
                }
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.name} {employee.surname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Assign to Project</Form.Label>
              <Form.Control
                as="select"
                value={newTask.projectId}
                onChange={(e) =>
                  setNewTask({ ...newTask, projectId: e.target.value })
                }
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Assigned Time</Form.Label>
              <Form.Control
                type="date"
                value={newTask.assignedTime}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignedTime: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Completed Time</Form.Label>
              <Form.Control
                type="date"
                value={newTask.completedTime}
                onChange={(e) =>
                  setNewTask({ ...newTask, completedTime: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTaskModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectManagerDashboard;
