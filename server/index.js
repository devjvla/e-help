import Express from "express";
import AppConstants from "./config/constants.js";
import dotenv from "dotenv";
dotenv.config();

const { PORT } = AppConstants;

const App = Express();
App.use(Express.json());
App.get("/", (req, res) => {
  res.send(`PORT IS ${PORT}`);
});

/* Routes Setup */
import UserRouter from "./routes/user.routes.js";
App.use(`/${process.env.API_PREFIX}/user`, UserRouter);

App.listen(PORT, () => {  
  console.log(`Running on http://localhost:${PORT}`);
});