import { WebWorkerMLCEngineHandler } from "https://esm.sh/@mlc-ai/web-llm@0.2.83";
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg) => { handler.onmessage(msg); };
