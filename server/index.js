const express = require("express");
const cors = require("cors");
const uploadQueryRoute = require("./routes/uploadRoute");
const webScrapRoute = require("./routes/webScrapRoute");
const signupRoute = require("./routes/authRoute"); // Import the signup route

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

// Use the new routes
app.use("/api", uploadQueryRoute);
app.use("/api", webScrapRoute);
app.use("/auth", signupRoute); // Register the signup route

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

