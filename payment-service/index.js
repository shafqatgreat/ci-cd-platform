import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "payment-service",
    status: "UP",
    time: new Date().toISOString()
  });
});

app.use("/api/payments", paymentRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`💳 Payment Service running on port ${PORT}`);
});