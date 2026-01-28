import { v4 as uuid } from "uuid";
const payments = new Map();


export const createPayment = (req, res) => {
  const { orderId, amount, method } = req.body;

  if (!orderId || !amount || !method) {
    return res.status(400).json({
      message: "orderId, amount and method are required"
    });
  }

  const paymentId = uuid();

  payments.set(paymentId, {
    id: paymentId,
    orderId,
    amount,
    method,
    status: "PENDING",
    createdAt: new Date()
  });

  res.status(201).json({
    paymentId,
    status: "PENDING"
  });
};


export const getPaymentStatus = (req, res) => {
  const payment = payments.get(req.params.id);

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  res.json(payment);
};