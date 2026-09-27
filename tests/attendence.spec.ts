import { runAutomationJob } from "../server/automation/automation.runner";
import {test} from '@playwright/test'


async function runAttendanceTest() {
  try {
    console.log("Starting attendance test...");

    await runAutomationJob("test-process-id");

    console.log("Attendance test completed successfully");
  } catch (error) {
    console.error("Error during attendance test", error);
  }
}


test.describe("greythr",()=>{
  test("mark attendance",async ()=>{
   await runAttendanceTest();
  })
})
