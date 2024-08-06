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

        if (!result.insertId) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Failed to create task.",
            });
        }

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

const getTasksById = async (req, res, next) => {
    let connection;
    const id = parseInt(req.params.id);

    try {
        connection = await db.getConnection();

        const query = `SELECT * FROM tasks WHERE id=${id}`;
        const [rows] = await connection.execute(query);

        return successResponse(res, {
            statusCode: 200,
            message: "tasks return successfully",
            payload: {
                data: rows[0]
            },
        });
    } catch (error) {
        return next(error);

    } finally {
        connection.release();
    }
};

const updateTaskById = async (req, res, next) => {
    let connection;
    const id = parseInt(req.params.id);
    const { task_name, description, is_done } = req.body;

    if (!task_name) {
        return errorResponse(res, {
            statusCode: 400,
            message: "Task name cannot be empty.",
        });
    }

    try {
        connection = await db.getConnection();

        const query =
            'UPDATE tasks SET task_name=?, description=?, is_done=?, updated_at=? WHERE id=?';
        const [result] = await connection.execute(query,
            [task_name, description, is_done, new Date(), id]);

        if (!result.affectedRows) {
            return errorResponse(res, {
                statusCode: 400,
                message: "could not Update task",
            });
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Task Updated",
            payload: {},
        });
    } catch (error) {
        return next(error);

    } finally {
        connection.release();
    }
};

const deleteTaskById = async (req, res, next) => {
    let connection;
    const id = parseInt(req.params.id);

    try {
        connection = await db.getConnection();

        const query = 'DELETE FROM tasks WHERE id = ?';
        const [result] = await connection.execute(query, [id]);

        if (!result.affectedRows) {
            return errorResponse(res, {
                statusCode: 400,
                message: "can not delete task",
            });
        }

        return successResponse(res, {
            statusCode: 201,
            message: "Task Deleted",
            payload: {},
        });
    } catch (error) {
        return next(error);

    } finally {
        connection.release();
    }
};

module.exports = {
    createTask,
    getTasks,
    getTasksById,
    updateTaskById,
    deleteTaskById
};
