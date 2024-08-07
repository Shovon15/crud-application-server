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
        if (connection) {
            connection.release();
        }
    }
}

const getTasks = async (req, res, next) => {
    let connection;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    try {
        connection = await db.getConnection();

        // Query to fetch tasks with pagination
        const query = `SELECT * FROM tasks LIMIT ?, ?`;
        const [rows] = await connection.execute(query, [skip, limit]);

        // Query to fetch total count of tasks (for pagination metadata)
        const countQuery = `SELECT COUNT(*) AS count FROM tasks`;
        const [countRows] = await connection.execute(countQuery);
        const count = countRows[0].count;

        return successResponse(res, {
            statusCode: 200,
            message: "Tasks returned successfully",
            payload: {
                data: rows,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        });
    } catch (error) {
        return next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


const getTasksById = async (req, res, next) => {
    let connection;
    const id = parseInt(req.params.id);

    try {
        connection = await db.getConnection();

        const query = `SELECT * FROM tasks WHERE id=${id}`;
        const [rows] = await connection.execute(query);

        if (!rows || rows.length === 0) {
            return errorResponse(res, {
                statusCode: 404,
                message: "Data not found",
            });
        }

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
        if (connection) {
            connection.release();
        }
    }
};

const updateTaskById = async (req, res, next) => {
    let connection;
    const id = parseInt(req.params.id);
    const { task_name, description, is_done } = req.body;
    const updateFields = [];
    const params = [];

    if (task_name) {
        updateFields.push('task_name=?');
        params.push(task_name);
    }
    if (description) {
        updateFields.push('description=?');
        params.push(description);
    }
    if (typeof is_done !== 'undefined') {
        updateFields.push('is_done=?');
        params.push(is_done);
    }

    if (updateFields.length === 0) {
        return errorResponse(res, {
            statusCode: 400,
            message: "No valid fields to update.",
        });
    }

    try {
        connection = await db.getConnection();

        const query = `UPDATE tasks SET ${updateFields.join(', ')}, updated_at=? WHERE id=?`;
        params.push(new Date(), id);

        const [result] = await connection.execute(query, params);

        if (!result.affectedRows) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Could not update task.",
            });
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Task updated successfully.",
            payload: {},
        });
    } catch (error) {
        return next(error);
    } finally {
        if (connection) {
            connection.release();
        }
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
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    createTask,
    getTasks,
    getTasksById,
    updateTaskById,
    deleteTaskById
};
