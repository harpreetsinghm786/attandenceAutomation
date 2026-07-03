import { runAutomationJob } from "../server/automation/automation.runner";

async function runAttendenceTest() {
  try {
    console.log("Starting attendance test...");

    await runAutomationJob("test-process-id");

    console.log("Attendance test completed successfully");
  } catch (error) {
    console.error("Error during attendance test", error);
  }
}

runAttendenceTest();