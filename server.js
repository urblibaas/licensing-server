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
  "client-store.myshopify.com",
];

// Route
app.post("/api/validate", (req, res) => {
  console.log("Received request body:", req.body);
  const { shop } = req.body;

  console.log(`Checking license for: ${shop}`);

  if (!shop) {
    return res.status(400).json({
      valid: false,
      message: "No shop domain provided",
    });
  }

  if (authorizedStores.includes(shop)) {
    return res.status(200).json({
      valid: true,
      message: "License verified",
      features: [
        "https://your-vercel-project.vercel.app/features/mega-menu.js",
        "https://your-vercel-project.vercel.app/features/sticky-cart.js",
      ],
    });
  }

  return res.status(403).json({
    valid: false,
    message: "Theme license invalid for " + shop,
    action: "block_theme",
  });
});

// IMPORTANT: export for Vercel
module.exports = app;
