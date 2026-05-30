import { WebWorkerMLCEngineHandler } from "https://esm.sh/@mlc-ai/web-llm";
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg) => { handler.onmessage(msg); };
