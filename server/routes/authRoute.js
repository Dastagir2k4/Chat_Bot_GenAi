// routes/signupRoute.js
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // Load environment variables from .env file
const router = express.Router();

// Supabase initialization
const supabaseUrl = "https://hqqljqflmtgbstsbpuoq.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Name, email, and password are required.");
    }

    // Check if the user already exists in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user from Supabase:", fetchError);
      return res.status(500).send("Error checking user in the database.");
    }

    if (existingUser) {
      if (existingUser.password !== password) {
        console.log("Incorrect password for user:", email);
        return res.status(400).json({ check: "falseP", message: "Incorrect password." });
      }

      console.log("User already exists and logged in successfully:", email);
      return res.status(200).json({ check: "true", message: "User logged in successfully.", data: existingUser });
    }

    // If the user does not exist, create a new user
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select(); // Use `.select()` to return the inserted data

    if (error) {
      console.error("Error storing user in Supabase:", error);
      return res.status(500).send("Error storing user.");
    }

    console.log("User signed up successfully:", data);
    return res.status(201).json({ check: "true", message: "User signed up successfully.", user: data[0] });
  } catch (error) {
    console.error("Error handling signup:", error);
    return res.status(500).send("Internal server error.");
  }
});

module.exports = router;
