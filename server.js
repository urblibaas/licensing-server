const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS Configuration (Allows Shopify stores to talk to your server)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from any .myshopify.com domain or localhost
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

// 2. Mock Database (Replace with your actual store domains)
const authorizedStores = ["your-development-store.myshopify.com", "client-store.myshopify.com"];

// 3. Validation Route (Matches /api/validate used in Vercel)
app.post("/api/validate", (req, res) => {
  const { shop } = req.body;

  console.log(`Checking license for: ${shop}`);

  if (!shop) {
    return res.status(400).json({ valid: false, message: "No shop domain provided" });
  }

  if (authorizedStores.includes(shop)) {
    return res.status(200).json({
      valid: true,
      message: "License verified",
      // These are the features that only load if the license is valid
      features: [
        "https://your-vercel-project.vercel.app/features/mega-menu.js",
        "https://your-vercel-project.vercel.app/features/sticky-cart.js",
      ],
    });
  } else {
    return res.status(403).json({
      valid: false,
      message: "Theme license invalid for " + shop,
      action: "block_theme",
    });
  }
});

// 4. Start Server
module.exports = app;
