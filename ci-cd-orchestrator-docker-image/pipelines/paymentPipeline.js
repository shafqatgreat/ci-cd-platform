const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
const ENVIRONMENT_ID = process.env.RAILWAY_ENVIRONMENT_ID;
const PROJECT_ID = process.env.RAILWAY_PROJECT_ID; // <--- Add this variable!
const PAYMENT_SERVICE_ID = "cfbeca31-d2ae-475e-bd9d-42c42364d23d"; 
const IMAGE_NAME = process.env.IMAGE_NAME || "ghcr.io/shafqatgreat/payment-service:latest";
export async function runPaymentPipeline() {
  // Step 1: Update the Service Instance configuration with the new Docker image URL
  const updateMutation = `
    mutation ServiceInstanceUpdate($serviceId: String!, $image: String!) {
      serviceInstanceUpdate(serviceId: $serviceId, input: {
        source: { image: $image }
      })
    }
  `;

  // Step 2: Force a redeploy of the instance using the updated configuration
  const redeployMutation = `
    mutation ServiceInstanceRedeploy($serviceId: String!, $environmentId: String!) {
      serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
    }
  `;
// Step 3: Tell Railway to START the service (The "Wake Up" call)
const deployMutation = `
  mutation serviceInstanceDeploy($serviceId: String!, $environmentId: String!) {
    serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId)
  }
`;
  try {
    console.log(`🚀 Orchestrator: Starting deployment for ${PAYMENT_SERVICE_ID}`);

    // --- EXECUTE STEP 1: Update Metadata ---
    const updateResponse = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: updateMutation.trim(),
        variables: { 
          serviceId: PAYMENT_SERVICE_ID, 
          image: IMAGE_NAME 
        },
      }),
    });

    const updateResult = await updateResponse.json();
    if (updateResult.errors) throw new Error(updateResult.errors[0].message);
    
    console.log("✅ Image metadata updated successfully.");

    // --- EXECUTE STEP 2: Trigger Redeploy ---
    console.log(`🔄 Triggering redeploy in environment: ${ENVIRONMENT_ID}...`);
    
    const redeployResponse = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: deployMutation.trim(),
        variables: { 
          serviceId: PAYMENT_SERVICE_ID, 
          environmentId: ENVIRONMENT_ID 
        },
      }),
    });

    const redeployResult = await redeployResponse.json();
    if (redeployResult.errors) throw new Error(redeployResult.errors[0].message);

    console.log("🚀 Railway: Redeploy signal sent! Check your dashboard for the spinning icons.");
    return redeployResult.data.serviceInstanceRedeploy;

  } catch (err) {
    console.error("❌ Orchestrator Pipeline Failed:", err.message);
    throw err;
  }
}


























export async function runPaymentPipelinenot(payload) {
  const branchName = payload.branch || "main";

  const updateMutation = `
    mutation ServiceInstanceUpdate($serviceId: String!, $image: String!) {
      serviceInstanceUpdate(serviceId: $serviceId, input: {
        source: { image: $image }
      })
    }
  `;

  // Added provider here
  const triggerMutation = `
    mutation DeploymentTriggerCreate($serviceId: String!, $branch: String!, $environmentId: String!, $projectId: String!, $provider: String!) {
      deploymentTriggerCreate(input: { 
        serviceId: $serviceId, 
        branch: $branch,
        environmentId: $environmentId,
        projectId: $projectId,
        provider: $provider
      }) {
        id
      }
    }
  `;

  try {
    // 1. Update Image Metadata
    await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: updateMutation.trim(),
        variables: { serviceId: PAYMENT_SERVICE_ID, image: IMAGE_NAME },
      }),
    });

    console.log(`✅ Metadata updated. Triggering for Project: ${PROJECT_ID} via DOCKER provider`);

    // 2. Trigger Deployment with Provider
    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: triggerMutation.trim(),
        variables: { 
          serviceId: PAYMENT_SERVICE_ID, 
          branch: branchName,
          environmentId: ENVIRONMENT_ID,
          projectId: PROJECT_ID,
          provider: "DOCKER" // <--- This tells Railway to pull the image
        },
      }),
    });

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);

    console.log("🚀 Railway: Deployment triggered successfully!");
    return result.data.deploymentTriggerCreate;

  } catch (err) {
    console.error("❌ Orchestrator Pipeline Failed:", err.message);
    throw err;
  }
}























export async function runPaymentPipelineWorking() {
  const query = `
    mutation ServiceInstanceUpdate($serviceId: String!, $image: String!) {
      serviceInstanceUpdate(serviceId: $serviceId, input: {
        source: {
          image: $image
        }
      })
    }
  `;

  try {
    console.log(`🚀 Orchestrator: Updating ${PAYMENT_SERVICE_ID} to image ${IMAGE_NAME}...`);

    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query.trim(),
        variables: {
          serviceId: PAYMENT_SERVICE_ID, // Note: label changed to serviceId
          image: IMAGE_NAME
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    console.log("✅ Railway: Instance update successful!");
    return result.data.serviceInstanceUpdate;

  } catch (err) {
    console.error("❌ Orchestrator Pipeline Failed:", err.message);
    throw err;
  }
}

// const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
// const PAYMENT_SERVICE_ID = "cfbeca31-d2ae-475e-bd9d-42c42364d23d"; // from Railway Dashboard
// const ENVIRONMENT_ID = process.env.RAILWAY_ENVIRONMENT_ID;
// const IMAGE_NAME = process.env.IMAGE_NAME;

// export async function runPaymentPipeline() {
//   const query = `
//     mutation ServiceUpdate($id: String!, $image: String!) {
//       serviceUpdate(id: $id, input: {
//         source: {
//           dockerImage: $image
//         }
//       }) {
//         id
//         name
//       }
//     }
//   `;

//   try {
//     console.log(`🚀 Orchestrator: Updating ${PAYMENT_SERVICE_ID} to image ${IMAGE_NAME}...`);

//     const response = await fetch("https://backboard.railway.app/graphql/v2", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query: query.trim(),
//         variables: {
//           id: PAYMENT_SERVICE_ID,
//           image: IMAGE_NAME
//         },
//       }),
//     });

//     const result = await response.json();

//     if (result.errors) {
//       // This will now catch "Field not defined" or other schema errors
//       throw new Error(result.errors[0].message);
//     }

//     console.log("✅ Railway: Image update successful. Deployment triggered!");
//     return result.data.serviceUpdate;

//   } catch (err) {
//     console.error("❌ Orchestrator Pipeline Failed:", err.message);
//     throw err;
//   }
// }


// export async function runPaymentPipeline2() {
//   // 1. CLEAN QUERY: No JavaScript comments allowed inside this string!
//   const query = `
//     mutation ServiceUpdate($id: String!, $image: String!) {
//       serviceUpdate(id: $id, input: {
//         image: $image
//       }) {
//         id
//         name
//       }
//     }
//   `;

//   try {
//     console.log(`🚀 Orchestrator: Updating ${PAYMENT_SERVICE_ID} to image ${IMAGE_NAME}...`);

//     const response = await fetch("https://backboard.railway.app/graphql/v2", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query: query.trim(),
//         variables: {
//           id: PAYMENT_SERVICE_ID,
//           image: IMAGE_NAME
//         },
//       }),
//     });

//     // 2. BETTER DEBUGGING: Catch HTML error pages from Railway
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       const rawBody = await response.text();
//       console.error("❌ Railway returned non-JSON response. Check your RAILWAY_TOKEN.");
//       throw new Error(`Railway API Error: ${response.status} ${response.statusText}`);
//     }

//     const result = await response.json();

//     if (result.errors) {
//       throw new Error(result.errors[0].message);
//     }

//     console.log("✅ Railway: Image update successful. Deployment triggered!");
//     return result.data.serviceUpdate;

//   } catch (err) {
//     console.error("❌ Orchestrator Pipeline Failed:", err.message);
//     throw err;
//   }
// }


// export async function runPaymentPipelineOld() {
//   try {
//     console.log("Starting Payment Service pipeline...");

//     const response = await fetch("https://backboard.railway.app/graphql/v2", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${RAILWAY_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query: `
//           mutation DeployService($serviceId: String!, $environmentId: String!) {
//             serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
//           }
//         `,
//         variables: { 
//           serviceId: PAYMENT_SERVICE_ID,
//           environmentId: ENVIRONMENT_ID 
//         },
//       }),
//     });

//     const data = await response.json();

//     if (data.errors) {
//       // This will now catch any remaining permission or ID issues
//       throw new Error(`Railway API Error: ${data.errors[0].message}`);
//     }

//     console.log("Payment Service deployment triggered successfully!");
//   } catch (err) {
//     console.error("Pipeline failed:", err.message);
//   }
// }




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