const express  = require("express");
const app      = express();
const { PORT } = require("./constants.js");

app.use(express.json());
app.get("/", (req, res) => {
  res.send(`PORT IS ${PORT}`);
});

/* Auth Routes */
const UserRoutes = require("./routes/user.routes.js");
app.use("/user", UserRoutes);

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});