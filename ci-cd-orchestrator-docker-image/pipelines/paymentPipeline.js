const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
const PAYMENT_SERVICE_ID = "cfbeca31-d2ae-475e-bd9d-42c42364d23d"; // from Railway Dashboard
const ENVIRONMENT_ID = process.env.RAILWAY_ENVIRONMENT_ID;
const IMAGE_NAME = process.env.IMAGE_NAME;
export async function runPaymentPipelineOld() {
  const query = `
    mutation ServiceUpdate($id: String!, $image: String!) {
      serviceUpdate(id: $id, input: {
        source: {
          image: $image
        }
      }) {
        id
        name
      }
    }
  `;

  try {
    console.log(`🚀 Orchestrator: Updating ${PAYMENT_SERVICE_ID} to image ${IMAGE_NAME}...`);

    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          id: PAYMENT_SERVICE_ID,
          image: IMAGE_NAME
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    console.log("✅ Railway: Image update successful. Deployment triggered!");
    return result.data.serviceUpdate;

  } catch (err) {
    console.error("❌ Orchestrator Pipeline Failed:", err.message);
    throw err;
  }
}
export async function runPaymentPipelineOld() {
  try {
    console.log("Starting Payment Service pipeline...");

    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation DeployService($serviceId: String!, $environmentId: String!) {
            serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
          }
        `,
        variables: { 
          serviceId: PAYMENT_SERVICE_ID,
          environmentId: ENVIRONMENT_ID 
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      // This will now catch any remaining permission or ID issues
      throw new Error(`Railway API Error: ${data.errors[0].message}`);
    }

    console.log("Payment Service deployment triggered successfully!");
  } catch (err) {
    console.error("Pipeline failed:", err.message);
  }
}




// export async function runPaymentPipeline() {
//   try {
//     console.log("Starting Payment Service pipeline...");

//     console.log("Triggering Railway to deploy payment-service...");
//     const response = await fetch("https://backboard.railway.app/graphql/v2", {
//       method: "POST",
//       headers: {
//         Authorization: RAILWAY_TOKEN,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query: `
//           mutation DeployService($id: ID!) {
//             deployService(serviceId: $id) { id status }
//           }`,
//         variables: { id: PAYMENT_SERVICE_ID },
//       }),
//     });

//     const data = await response.json();
//     console.log("Deploy response:", data);

//     console.log("Payment Service deployment triggered successfully!");
//   } catch (err) {
//     console.error("Pipeline failed:", err);
//   }
// }









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