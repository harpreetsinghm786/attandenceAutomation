"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const automation_runner_1 = require("./automation/automation.runner");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.post("/run-automation", (req, res) => {
    const processId = (0, uuid_1.v4)();
    const startTime = new Date();
    res.status(202).json({
        message: "Automation queued successfully",
        processId: processId,
        startedAt: startTime.toISOString(),
    });
    // Run automation in the background
    (0, automation_runner_1.runAutomationJob)(processId);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map