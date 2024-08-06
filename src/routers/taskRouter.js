const express = require("express");
const { getTasks, createTask } = require("../controllers/taskController");

const taskRouter = express.Router();

taskRouter.get("/", getTasks);
taskRouter.post("/create", createTask);

module.exports = taskRouter;
