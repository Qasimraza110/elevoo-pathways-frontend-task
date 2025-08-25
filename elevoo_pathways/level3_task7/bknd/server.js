import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Schema
const SearchSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now },
});
const Search = mongoose.model("Search", SearchSchema);

// Fetch weather from OpenWeather
app.post("/api/weather", async (req, res) => {
  const { city } = req.body;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_KEY}&units=metric`
    );

    // Save search in MongoDB
    await new Search({ city }).save();

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "City not found or API error" });
  }
});

// Get recent searches
app.get("/api/history", async (req, res) => {
  const history = await Search.find().sort({ date: -1 }).limit(5);
  res.json(history);
});

app.delete("/api/history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const deleted = await Search.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Search not found" });
    }

    res.json({ message: "Search deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

 app.get("/", (req, res) => {
  res.send("🌦️ Weather API is running...");
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;   // ✅ Railway port support
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log("Connected to MongoDB");
  })
  .catch(err => console.log(err));

 
