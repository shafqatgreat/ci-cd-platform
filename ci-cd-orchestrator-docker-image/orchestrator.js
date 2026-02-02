import { runPaymentPipeline } from "./pipelines/paymentPipeline.js";

class Orchestrator {
  constructor() {
    // Change: Store pipelines by service name instead of just branch
    this.pipelines = {
      "payment-service": runPaymentPipeline,
      // "inventory-service": runInventoryPipeline, <--- future proofing
    };
  }

  async trigger(branch, payload) {
    // 1. Identify which service sent the trigger (from our GitHub Action curl)
    const serviceName = payload.service; 
    const pipeline = this.pipelines[serviceName];

    if (!pipeline) {
      return console.log(`⚠️ No pipeline registered for service: ${serviceName}`);
    }

    console.log(`🚀 Starting pipeline for service: ${serviceName} on branch: ${branch}`);

    try {
      // 2. Execute the specific service pipeline
      await pipeline(payload);
      console.log(`✅ Pipeline for ${serviceName} completed`);
    } catch (err) {
      console.error(`❌ Pipeline step failed for ${serviceName}:`, err.message);
    }
  }
}

export const orchestrator = new Orchestrator();