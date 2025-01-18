import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TaskManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [newTask, setNewTask] = useState({
    taskStatus: "To Start",
  });
  const navigate = useNavigate();

  // Get the logged-in employee's ID from local storage or session
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  // Fetch tasks assigned only to the logged-in employee
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5220/api/projectmanager/get-tasks-by-employee/${employeeId}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching tasks");
    }
  };

  // Fetch tasks by status
  const fetchTasksByStatus = async (status) => {
    try {
      if (status === "") {
        fetchTasks();
        toast.success("Displaying all tasks.");
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

  // Fetch employees for task assignment display
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

  // Save task changes
  const handleSaveTask = async () => {
    if (!newTask.taskStatus) {
      toast.error("Please select a task status.");
      return;
    }

    try {
      if (editTask) {
        await axios.put(
          `http://localhost:5220/api/projectmanager/update-task/${editTask.taskId}`,
          newTask
        );
        toast.success("Task updated successfully!");
      }
      fetchTasks();
      handleCloseTaskModal();
    } catch (error) {
      console.error(error);
      toast.error("Error saving task");
    }
  };

  // Logout function
  const handleLogout = () => {
    navigate("/"); // Redirect to login page
    toast.success("Logged out successfully");
  };

  return (
    <div className="container mt-5">
      <h2 className="heading">
        Task Management Dashboard
      </h2>
      <Button variant="danger" className="mb-3" onClick={handleLogout}>
        Logout
      </Button>

      <h6 className="heading6">Filter Tasks by Status</h6>
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
                <Button
                  className="btnedit"
                  variant="warning"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showTaskModal} onHide={handleCloseTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editTask ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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

export default TaskManagerDashboard;
