import Express from "express";
import cors from "cors";
import AppConstants from "./config/constants.js";
import dotenv from "dotenv";
dotenv.config();

const { PORT } = AppConstants;

const App = Express();
App.use(Express.json());
App.get("/", (req, res) => {
  res.send(`PORT IS ${PORT}`);
});

// App.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

App.use(cors());

/* Routes Setup */
import UserRouter from "./routes/user.routes.js";
App.use(`/${process.env.API_PREFIX}/user`, UserRouter);

App.listen(PORT, () => {  
  console.log(`Running on http://localhost:${PORT}`);
});