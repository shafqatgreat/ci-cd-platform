const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
const PAYMENT_SERVICE_ID = "<payment-service-id>"; // from Railway Dashboard

export async function runPaymentPipeline() {
  try {
    console.log("Starting Payment Service pipeline...");

    console.log("Triggering Railway to deploy payment-service...");
    const response = await fetch("https://backboard.railway.app/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation DeployService($id: ID!) {
            deployService(serviceId: $id) { id status }
          }`,
        variables: { id: PAYMENT_SERVICE_ID },
      }),
    });

    const data = await response.json();
    console.log("Deploy response:", data);

    console.log("Payment Service deployment triggered successfully!");
  } catch (err) {
    console.error("Pipeline failed:", err);
  }
}









// import { exec } from "child_process";
// import util from "util";
// const runCommand = util.promisify(exec);

// const PAYMENT_SERVICE_PATH = "../payment-service"; // relative path from orchestrator

// export async function runPaymentPipeline() {
//     console.log("Starting Payment Service pipeline...");

//     console.log("Installing dependencies...");
//     await runCommand(`cd ${PAYMENT_SERVICE_PATH} && npm ci`);
    
//     console.log("Running tests...");
//     // await runCommand(`cd ${PAYMENT_SERVICE_PATH} && npm test`);

//     console.log("Deploying to Railway...");
//     await runCommand(`cd ${PAYMENT_SERVICE_PATH} && railway up`);    

//     console.log("Payment Service deployed successfully!");

// }