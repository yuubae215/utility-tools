import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm@0.2.83";
import { initTheme } from './theme.js';

initTheme();

// ── System prompt presets ──────────────────────────────────
const PRESETS = {
    engineer: `You are an expert prompt engineer. Help the user craft, refine, and optimize prompts for LLMs. Analyze their input, identify what makes a prompt effective or ineffective, and suggest concrete improvements. Be specific, practical, and concise.`,
    code: `You are an expert software engineer and code assistant. Help with debugging, code review, architecture decisions, and implementation. Write clean, well-structured code and explain your reasoning briefly.`,
    analyzer: `You are a document analysis assistant. When given text or file contents (such as output from File Binder), extract key insights, summarize structure, identify patterns, and answer questions about the content accurately and concisely.`,
    custom: ``,
};

const MODEL_INFO = {
    'Qwen2.5-0.5B-Instruct-q4f16_1-MLC': '~400 MB download · Fastest · Good for quick tasks',
    'Qwen2.5-1.5B-Instruct-q4f16_1-MLC': '~900 MB download · Balanced quality & speed · Recommended',
    'Llama-3.2-1B-Instruct-q4f16_1-MLC': '~700 MB download · Meta Llama 3.2 · Strong instruction-following',
};

// ── State ─────────────────────────────────────────────────
let engine = null;
let isGenerating = false;
let abortRequested = false;
let chatHistory = [];

// ── DOM refs ──────────────────────────────────────────────
const modelSelect  = document.getElementById('model-select');
const modelMeta    = document.getElementById('model-meta');
const btnLoad      = document.getElementById('btn-load');
const loadProgress = document.getElementById('load-progress');
const progressLabel = document.getElementById('progress-label');
const progressFill = document.getElementById('progress-fill');
const statusDot    = document.getElementById('status-dot');
const loadStatus   = document.getElementById('load-status');
const systemPromptEl = document.getElementById('system-prompt');
const chatHistoryEl  = document.getElementById('chat-history');
const chatEmptyEl    = document.getElementById('chat-empty');
const userInputEl    = document.getElementById('user-input');
const btnRun         = document.getElementById('btn-run');
const btnAbort       = document.getElementById('btn-abort');
const btnClear       = document.getElementById('btn-clear');
const tokenStatsEl   = document.getElementById('token-stats');
const presetBtns     = document.querySelectorAll('.preset-btn');
const webgpuWarn     = document.getElementById('webgpu-warn');

// ── WebGPU check ──────────────────────────────────────────
if (!navigator.gpu) {
    webgpuWarn.classList.add('visible');
    btnLoad.disabled = true;
}

// ── Init ──────────────────────────────────────────────────
systemPromptEl.value = PRESETS.engineer;
updateModelMeta();

modelSelect.addEventListener('change', () => {
    updateModelMeta();
    if (engine) {
        engine = null;
        btnRun.disabled = true;
        setStatus('', 'Model changed — reload to switch.');
        btnLoad.innerHTML = '<i class="fas fa-bolt" aria-hidden="true"></i> Load Model';
    }
});

function updateModelMeta() {
    modelMeta.textContent = MODEL_INFO[modelSelect.value] || '';
}

// ── Preset buttons ────────────────────────────────────────
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        presetBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        if (btn.dataset.preset !== 'custom') {
            systemPromptEl.value = PRESETS[btn.dataset.preset];
        }
    });
});

systemPromptEl.addEventListener('input', () => {
    presetBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    const customBtn = document.querySelector('[data-preset="custom"]');
    customBtn.classList.add('active');
    customBtn.setAttribute('aria-pressed', 'true');
});

// ── Load model ────────────────────────────────────────────
btnLoad.addEventListener('click', loadModel);

async function loadModel() {
    if (!navigator.gpu) return;

    const modelId = modelSelect.value;
    btnLoad.disabled = true;
    loadProgress.hidden = false;
    progressFill.style.width = '0%';
    progressFill.classList.remove('done');
    setStatus('loading', 'Connecting to model cache...');

    try {
        const workerURL = new URL('./llm-worker.js', import.meta.url);
        engine = await CreateWebWorkerMLCEngine(
            new Worker(workerURL, { type: 'module' }),
            modelId,
            {
                initProgressCallback: (report) => {
                    progressLabel.textContent = report.text || '';
                    const pct = Math.round((report.progress || 0) * 100);
                    progressFill.style.width = pct + '%';
                    setStatus('loading', report.text?.includes('cache') ? 'Loading from cache...' : `Downloading... ${pct}%`);
                }
            }
        );

        progressFill.style.width = '100%';
        progressFill.classList.add('done');
        setTimeout(() => { loadProgress.hidden = true; }, 600);

        const shortName = modelId.split('-').slice(0, 2).join(' ');
        setStatus('ready', `Ready · ${shortName}`);
        btnLoad.disabled = false;
        btnLoad.innerHTML = '<i class="fas fa-rotate-right" aria-hidden="true"></i> Reload Model';
        btnRun.disabled = false;
        userInputEl.focus();
    } catch (err) {
        const errText = typeof err === 'string' ? err : (err?.message || String(err) || 'Unknown error');
        loadProgress.hidden = true;
        setStatus('error', errText.startsWith('Error') ? errText : 'Error: ' + errText);
        console.error('[Prompt Playground] Model load error:', err);
        btnLoad.disabled = false;
        btnLoad.innerHTML = '<i class="fas fa-bolt" aria-hidden="true"></i> Load Model';
        engine = null;
    }
}

function setStatus(state, text) {
    statusDot.className = 'status-dot' + (state ? ' ' + state : '');
    loadStatus.textContent = text;
}

// ── Send message ──────────────────────────────────────────
userInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!btnRun.disabled && !isGenerating) handleSend();
    }
});

btnRun.addEventListener('click', handleSend);

btnAbort.addEventListener('click', () => {
    if (engine && isGenerating) {
        abortRequested = true;
        engine.interruptGenerate();
    }
});

btnClear.addEventListener('click', () => {
    chatHistory = [];
    [...chatHistoryEl.querySelectorAll('.chat-msg')].forEach(el => el.remove());
    chatEmptyEl.hidden = false;
    tokenStatsEl.textContent = '';
});

async function handleSend() {
    if (!engine || isGenerating) return;
    const text = userInputEl.value.trim();
    if (!text) { userInputEl.focus(); return; }

    userInputEl.value = '';
    chatEmptyEl.hidden = true;

    chatHistory.push({ role: 'user', content: text });
    appendMessage('user', text);

    isGenerating = true;
    abortRequested = false;
    btnRun.disabled = true;
    btnAbort.hidden = false;
    tokenStatsEl.textContent = '';

    const messages = [];
    const sysText = systemPromptEl.value.trim();
    if (sysText) messages.push({ role: 'system', content: sysText });
    messages.push(...chatHistory);

    const assistantBubble = appendMessage('assistant', '');
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    assistantBubble.appendChild(cursor);

    let streamText = '';
    const startTime = Date.now();
    let completionTokens = 0;

    try {
        const reply = await engine.chat.completions.create({
            messages,
            stream: true,
            stream_options: { include_usage: true },
            temperature: 0.7,
            max_tokens: 2048,
        });

        for await (const chunk of reply) {
            const delta = chunk.choices[0]?.delta?.content || '';
            if (delta) {
                streamText += delta;
                cursor.remove();
                assistantBubble.textContent = streamText;
                assistantBubble.appendChild(cursor);

                assistantBubble.classList.add('streaming-active');
                clearTimeout(assistantBubble._glowTimer);
                assistantBubble._glowTimer = setTimeout(
                    () => assistantBubble.classList.remove('streaming-active'),
                    130
                );
                chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
            }
            if (chunk.usage?.completion_tokens) {
                completionTokens = chunk.usage.completion_tokens;
            }
        }
    } catch (err) {
        if (!abortRequested) {
            const errMsg = typeof err === 'string' ? err : (err?.message || String(err) || 'Unknown error');
            streamText += streamText ? '\n\n[Error: ' + errMsg + ']' : '[Error: ' + errMsg + ']';
        }
    }

    cursor.remove();
    assistantBubble.classList.remove('streaming-active');

    if (abortRequested && streamText) {
        assistantBubble.textContent = streamText;
        assistantBubble.insertAdjacentHTML('beforeend', '<span style="opacity:.5"> [stopped]</span>');
    } else {
        assistantBubble.textContent = streamText || '(no output)';
    }

    if (streamText) {
        chatHistory.push({ role: 'assistant', content: streamText });
        if (completionTokens > 0) {
            const elapsed = (Date.now() - startTime) / 1000;
            tokenStatsEl.textContent = `${completionTokens} tokens · ${(completionTokens / elapsed).toFixed(1)} tok/s`;
        }
    }

    chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    isGenerating = false;
    abortRequested = false;
    btnRun.disabled = false;
    btnAbort.hidden = true;
    userInputEl.focus();
}

function appendMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'user' ? 'You' : 'AI';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    if (text) bubble.textContent = text;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatHistoryEl.appendChild(msg);
    chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;

    return bubble;
}
