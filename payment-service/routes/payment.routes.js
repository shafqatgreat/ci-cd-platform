import express from "express";
import {createPayment,getPaymentStatus} from "../services/payment.service.js";


const router = express.Router();

router.post("/", createPayment);
router.get("/:id", getPaymentStatus);

export default router;