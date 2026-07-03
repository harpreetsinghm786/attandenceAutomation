import express, { Request, Response }  from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

import { runAutomationJob } from "./automation/automation.runner";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.post("/run-automation", (req: Request, res: Response)=>{
  const processId = uuidv4();
  const startTime = new Date();
  res.status(202).json({
    message: "Automation queued successfully",
    processId: processId,
    startedAt: startTime.toISOString(),
  });

   // Run automation in the background
  runAutomationJob(processId);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});     


export default app;