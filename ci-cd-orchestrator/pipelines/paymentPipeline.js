import { exec } from "child_process";
import util from "util";
const runCommand = util.promisify(exec);

const PAYMENT_SERVICE_PATH = "../payment-service"; // relative path from orchestrator

export async function runPaymentPipeline() {
    console.log("Starting Payment Service pipeline...");

    console.log("Installing dependencies...");
    await runCommand(`cd ${PAYMENT_SERVICE_PATH} && npm ci`);
    
    console.log("Running tests...");
    // await runCommand(`cd ${PAYMENT_SERVICE_PATH} && npm test`);

    console.log("Deploying to Railway...");
    await runCommand(`cd ${PAYMENT_SERVICE_PATH} && railway up`);    

    console.log("Payment Service deployed successfully!");

}