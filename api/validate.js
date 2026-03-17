module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { shop } = body;

  const authorizedStores = [
    "your-development-store.myshopify.com",
    "urblibaas.myshopify.com",
    "client-store.myshopify.com",
  ];

  if (authorizedStores.includes(shop)) {
    return res.status(200).json({
      valid: true,
      features: ["https://your-server.com/assets/mega-menu.js"],
    });
  }

  return res.status(403).json({
    valid: false,
    message: "License invalid for " + shop,
  });
};
