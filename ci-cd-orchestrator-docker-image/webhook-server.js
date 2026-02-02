import express from "express";
import crypto from "crypto";
import { orchestrator } from "./orchestrator.js";




const app = express();
const PORT = process.env.PORT || 4000;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

// Middleware to get raw body
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; // Save raw bytes for signature verification
    },
  })
);

function verifySignature(req) {
  const sig = req.headers['x-hub-signature-256'];
  if (!sig) return false;
  const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
  const digest = "sha256=" + hmac.update(req.rawBody).digest('hex'); // use raw body
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
}

app.post("/webhook", async (req, res) => {
  if (!verifySignature(req)) return res.status(401).send("Invalid signature");

  const branch = req.body.ref?.split("/").pop() || "main";
  console.log(`Trigger received for branch: ${branch}`);
  
  try {
    await orchestrator.trigger(branch, req.body);
    res.status(200).send("Pipeline triggered");
  } catch (err) {
    console.error("Pipeline failed:", err);
    res.status(500).send("Pipeline failed");
  }
});

app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));








// import express from "express";
// import bodyParser from "body-parser";
// import crypto from "crypto";
// import { orchestrator } from "./orchestrator.js";

// const app = express();
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 4000;
// const GITHUB_SECRET = process.env.GITHUB_SECRET;

// function verifySignature(req) {
//   const sig = req.headers['x-hub-signature-256'];
//   if (!sig) return false;
//   const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
//   const digest = "sha256=" + hmac.update(JSON.stringify(req.body)).digest('hex');
//   return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
// }

// app.post("/webhook", async (req, res) => {
//     if (!verifySignature(req)) return res.status(401).send("Invalid signature");
    
//     const branch = req.body.ref?.split("/").pop() || "main";
//     console.log(`Trigger received for branch: ${branch}`);
//     await orchestrator.trigger(branch, req.body);
//     res.status(200).send("Pipeline triggered");
// });

// app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));