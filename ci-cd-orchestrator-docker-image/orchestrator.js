import { runPaymentPipeline } from "./pipelines/paymentPipeline.js";

class Orchestrator {
 constructor() {
    this.pipelines = {};
  }

   registerPipeline(branch, steps) {
    this.pipelines[branch] = steps;
  }

  async trigger(branch, payload) {
    const steps = this.pipelines[branch] || this.pipelines["main"];
    if (!steps) return console.log(`No pipeline for branch: ${branch}`);

    console.log(`Starting pipeline for branch: ${branch}`);
    for (const step of steps) {
      try {
        await step(payload);
      } catch (err) {
        console.error("Pipeline step failed:", err);
        break;
      }
    }
    console.log("Pipeline completed");
  }
}   // Class Ends here

export const orchestrator = new Orchestrator();

// Register payment service pipeline
orchestrator.registerPipeline("main", [runPaymentPipeline]);
