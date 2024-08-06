const express = require("express");
const cors = require("cors");
const { errorResponse } = require("./controllers/responseController");
const createHttpError = require("http-errors");
const taskRouter = require("./routers/taskRouter");
const { serverPort } = require("./secret");


const app = express();

// middleware--------------------
app.use(cors());
app.use(express.json());


app.use("/api/task", taskRouter);

//welcome route-------------
app.get("/", (req, res) => {
	res.status(200).send({
		message: "welcome to simple crud server!!!",
	});
});


//client error--------------------
app.use((req, res, next) => {
	next(createHttpError(404, "Route not found."));
});

//server error------------------
app.use((err, req, res, next) => {
	return errorResponse(res, {
		statusCode: err.status,
		message: err.message,
	});
});

app.listen(serverPort, async () => {
	console.log(`server running on ${serverPort}`);
});

module.exports = app;
