const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin.includes("myshopify.com") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
// Mock database
const authorizedStores = [
  "your-development-store.myshopify.com",
  "urblibaas.myshopify.com",
  "fa7181.myshopify.com",
  "client-store.myshopify.com",
];

// Route
app.post("/api/validate", (req, res) => {
  const { shop } = req.body;
  const baseUrl = "https://licensing-server-six.vercel.app";

  if (authorizedStores.includes(shop)) {
    return res.status(200).json({
      valid: true,
      // Send the URL to the CSS file only if authorized
      css_url: `${baseUrl}/css/base.css`,
    });
  }

  return res.status(403).json({
    valid: false,
    message: "License invalid",
  });
});

// IMPORTANT: export for Vercel
module.exports = app;
