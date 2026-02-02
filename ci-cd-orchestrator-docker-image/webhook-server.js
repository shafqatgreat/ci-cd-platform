import express from "express";
import crypto from "crypto";
import { orchestrator } from "./orchestrator.js";

const app = express();
const PORT = process.env.PORT || 4000;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

// 1. Keep the rawBody middleware but make it safer
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (buf && buf.length) {
        req.rawBody = buf;
      }
    },
  })
);

function verifySignature(req) {
  const sig = req.headers['x-hub-signature-256'];
  // If no signature header exists (like in a curl), return false gracefully
  if (!sig || !req.rawBody) return false;
  
  const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
  const digest = "sha256=" + hmac.update(req.rawBody).digest('hex');
  
  const sigBuffer = Buffer.from(sig);
  const digestBuffer = Buffer.from(digest);

  // timingSafeEqual CRASHES if lengths aren't identical. This check prevents the crash.
  if (sigBuffer.length !== digestBuffer.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(sigBuffer, digestBuffer);
}

app.post("/webhook", async (req, res) => {
  // 2. Logic to detect if it's a GitHub Action vs GitHub Webhook
  const isGitHubAction = req.headers['user-agent']?.includes('curl');
  const hasSignature = req.headers['x-hub-signature-256'];

  // Only verify signature if it looks like a standard GitHub Webhook
  if (hasSignature && !verifySignature(req)) {
    console.error("❌ Invalid signature detected");
    return res.status(401).send("Invalid signature");
  }

  // 3. Extract branch safely (GitHub Webhooks use req.body.ref, Action uses req.body.branch)
  const branch = req.body.branch || req.body.ref?.split("/").pop() || "main";
  
  console.log(`🚀 Trigger received. Source: ${isGitHubAction ? 'Action' : 'Webhook'}. Branch: ${branch}`);
  
  try {
    // Pass the payload to your orchestrator
    await orchestrator.trigger(branch, req.body);
    res.status(200).send("Pipeline triggered");
  } catch (err) {
    console.error("❌ Pipeline failed:", err.message);
    res.status(500).send("Pipeline failed");
  }
});

app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));



// import express from "express";
// import crypto from "crypto";
// import { orchestrator } from "./orchestrator.js";




// const app = express();
// const PORT = process.env.PORT || 4000;
// const GITHUB_SECRET = process.env.GITHUB_SECRET;

// // Middleware to get raw body
// app.use(
//   express.json({
//     verify: (req, res, buf) => {
//       req.rawBody = buf; // Save raw bytes for signature verification
//     },
//   })
// );

// function verifySignature(req) {
//   const sig = req.headers['x-hub-signature-256'];
//   if (!sig) return false;
//   const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
//   const digest = "sha256=" + hmac.update(req.rawBody).digest('hex'); // use raw body
//   return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
// }

// app.post("/webhook", async (req, res) => {
//   // if (!verifySignature(req)) return res.status(401).send("Invalid signature");

//   const branch = req.body.ref?.split("/").pop() || "main";
//   console.log(`Trigger received for branch: ${branch}`);
  
//   try {
//     await orchestrator.trigger(branch, req.body);
//     res.status(200).send("Pipeline triggered");
//   } catch (err) {
//     console.error("Pipeline failed:", err);
//     res.status(500).send("Pipeline failed");
//   }
// });

// app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));








// // import express from "express";
// // import bodyParser from "body-parser";
// // import crypto from "crypto";
// // import { orchestrator } from "./orchestrator.js";

// // const app = express();
// // app.use(bodyParser.json());

// // const PORT = process.env.PORT || 4000;
// // const GITHUB_SECRET = process.env.GITHUB_SECRET;

// // function verifySignature(req) {
// //   const sig = req.headers['x-hub-signature-256'];
// //   if (!sig) return false;
// //   const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
// //   const digest = "sha256=" + hmac.update(JSON.stringify(req.body)).digest('hex');
// //   return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
// // }

// // app.post("/webhook", async (req, res) => {
// //     if (!verifySignature(req)) return res.status(401).send("Invalid signature");
    
// //     const branch = req.body.ref?.split("/").pop() || "main";
// //     console.log(`Trigger received for branch: ${branch}`);
// //     await orchestrator.trigger(branch, req.body);
// //     res.status(200).send("Pipeline triggered");
// // });

// // app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));