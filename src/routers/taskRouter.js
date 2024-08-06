const express = require("express");
const { getTasks, createTask, getTasksById, updateTaskById, deleteTaskById } = require("../controllers/taskController");

const taskRouter = express.Router();

taskRouter.get("/", getTasks);
taskRouter.get("/:id", getTasksById);
taskRouter.post("/create", createTask);
taskRouter.put("/:id", updateTaskById);
taskRouter.delete("/:id", deleteTaskById);

module.exports = taskRouter;
