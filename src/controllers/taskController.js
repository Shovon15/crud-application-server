const db = require("../config/db");
const { successResponse, errorResponse } = require("./responseController");

const createTask = async (req, res) => {
    let connection;
    const { task_name, description, is_done } = req.body;

    if (!task_name) {
        return errorResponse(res, {
            statusCode: 400,
            message: "Task name cannot be empty.",
        });
    }

    try {
        connection = await db.getConnection();

        const query = 'INSERT INTO tasks (task_name, description, is_done) VALUES (?, ?, ?)';
        const [result] = await connection.execute(query, [task_name, description, is_done]);

        return successResponse(res, {
            statusCode: 200,
            message: "New Task Created",
            payload: {
                data: result.insertId
            },
        });
    } catch (error) {
        return next(error);

    } finally {
        connection.release();
    }
}

const getTasks = async (req, res, next) => {
    let connection;

    try {
        connection = await db.getConnection();

        const query = `SELECT * FROM tasks`;
        const [rows] = await connection.execute(query);

        return successResponse(res, {
            statusCode: 200,
            message: "tasks return successfully",
            payload: {
                data: rows
            },
        });
    } catch (error) {
        return next(error);

    } finally {
        connection.release();
    }
};

module.exports = {
    createTask,
    getTasks
};
