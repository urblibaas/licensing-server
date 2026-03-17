// We don't need 'express' here, Vercel provides req/res automatically
module.exports = async (req, res) => {
  // 1. Set CORS headers manually (Very important for Vercel)
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); // In production, replace '*' with your shopify domain
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // Handle Preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { shop } = req.body;

  // 2. Mock Database (Replace with your actual store domains)
  const authorizedStores = ["your-development-store.myshopify.com", "client-store.myshopify.com"];

  if (authorizedStores.includes(shop)) {
    return res.status(200).json({
      valid: true,
      features: [
        "https://your-server.com/assets/mega-menu.js", // We will host these later
      ],
    });
  } else {
    return res.status(403).json({
      valid: false,
      message: "License invalid for " + shop,
    });
  }
};
