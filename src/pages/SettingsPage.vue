<script setup>
import { ref, onMounted } from "vue";

// 供应商预设（OpenAI 兼容格式；key 存储位置见页面说明）
const PROVIDERS = {
  volc: {
    label: "火山方舟（豆包）",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    model: "",
    modelHint: "填写方舟推理接入点 ID（ep-xxx）或模型 ID",
  },
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    modelHint: "",
  },
  openai: {
    label: "OpenAI 兼容",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    modelHint: "",
  },
  custom: {
    label: "自定义（OpenAI 兼容）",
    baseUrl: "",
    model: "",
    modelHint: "任何兼容 /chat/completions 的服务",
  },
};

const STORE_KEY = "hub-ai-settings";

const provider = ref("volc");
const baseUrl = ref("");
const model = ref("");
const apiKey = ref("");
const dailyLimit = ref(50);
const showKey = ref(false);

const storageMode = ref("none"); // none | local | server
const savedMsg = ref("");
const testState = ref("idle"); // idle | testing | ok | fail
const testMsg = ref("");

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    provider.value = s.provider || "volc";
    baseUrl.value = s.baseUrl || "";
    model.value = s.model || "";
    apiKey.value = s.apiKey || "";
    dailyLimit.value = s.dailyLimit || 50;
    storageMode.value = "local";
  } catch {
    /* 忽略损坏的本地数据 */
  }
});

function pickProvider(id) {
  provider.value = id;
  const p = PROVIDERS[id];
  baseUrl.value = p.baseUrl;
  model.value = p.model;
}

function keyTail() {
  const k = apiKey.value.trim();
  return k ? "****" + k.slice(-4) : "—";
}

async function save() {
  if (!baseUrl.value.trim() || !apiKey.value.trim() || !model.value.trim()) {
    savedMsg.value = "Base URL / API Key / 模型名都要填";
    return;
  }
  const payload = {
    provider: provider.value,
    baseUrl: baseUrl.value.trim().replace(/\/$/, ""),
    model: model.value.trim(),
    apiKey: apiKey.value.trim(),
    dailyLimit: Number(dailyLimit.value) || 50,
    savedAt: new Date().toISOString(),
  };
  // 后端接入后此 POST 生效（key 只存服务端，永不下发全文）
  try {
    const res = await fetch("/api/ai/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    storageMode.value = "server";
    savedMsg.value = "✅ 已保存到服务端";
  } catch {
    localStorage.setItem(STORE_KEY, JSON.stringify(payload));
    storageMode.value = "local";
    savedMsg.value = "已本地暂存（后端未接入）——key 仅保存在此浏览器";
  }
  testState.value = "idle";
}

async function testConn() {
  testState.value = "testing";
  testMsg.value = "";
  try {
    const res = await fetch("/api/ai/test", { method: "POST" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json().catch(() => ({}));
    testState.value = data.ok ? "ok" : "fail";
    testMsg.value = data.ok
      ? "连接成功，模型可用"
      : data.message || "模型返回异常";
  } catch {
    testState.value = "fail";
    testMsg.value = "后端未接入，无法在线验证（当前仅本地暂存）";
  }
}

function clearAll() {
  localStorage.removeItem(STORE_KEY);
  provider.value = "volc";
  baseUrl.value = "";
  model.value = "";
  apiKey.value = "";
  dailyLimit.value = 50;
  storageMode.value = "none";
  savedMsg.value = "已清除配置";
  testState.value = "idle";
  testMsg.value = "";
}
</script>

<template>
  <div class="container settings-page">
    <section class="head card">
      <p class="eyebrow">SETTINGS / AI SERVICE</p>
      <h1>AI 服务配置</h1>
      <p>
        配置用于生成小游戏的模型服务。当前后端尚未接入，保存时会将配置和 API Key
        <b>暂存于此浏览器</b>。
      </p>
    </section>

    <!-- 当前状态 -->
    <section class="status card">
      <span class="dot" :class="storageMode === 'none' ? 'off' : 'on'"></span>
      <template v-if="storageMode === 'none'">
        <b>未配置</b
        ><span class="muted">创作页的「开始生成」将始终进入演示模式</span>
      </template>
      <template v-else>
        <b>{{ PROVIDERS[provider].label }}</b>
        <span class="muted"
          >{{ model || "—" }} · key {{ keyTail() }} ·
          {{ storageMode === "local" ? "本地暂存" : "服务端已保存" }}</span
        >
      </template>
    </section>

    <!-- 供应商 -->
    <section>
      <h2 class="section-title">供应商</h2>
      <div class="prov-grid">
        <button
          v-for="(p, id) in PROVIDERS"
          :key="id"
          class="prov-tile card"
          :class="{ active: provider === id }"
          @click="pickProvider(id)"
        >
          {{ p.label }}
        </button>
      </div>
    </section>

    <!-- 表单 -->
    <section class="form card">
      <label>
        <span>Base URL</span>
        <input
          v-model="baseUrl"
          type="url"
          placeholder="https://…（OpenAI 兼容格式）"
        />
      </label>
      <label>
        <span>API Key</span>
        <span class="key-row">
          <input
            v-model="apiKey"
            :type="showKey ? 'text' : 'password'"
            placeholder="sk-… / ep-…"
            autocomplete="off"
          />
          <button class="btn-mini" @click="showKey = !showKey">
            {{ showKey ? "隐藏" : "显示" }}
          </button>
        </span>
      </label>
      <label>
        <span
          >模型{{
            PROVIDERS[provider].modelHint
              ? "（" + PROVIDERS[provider].modelHint + "）"
              : ""
          }}</span
        >
        <input
          v-model="model"
          type="text"
          :placeholder="PROVIDERS[provider].modelHint || '模型名'"
        />
      </label>
      <label>
        <span>每日生成上限（次）</span>
        <input v-model.number="dailyLimit" type="number" min="1" max="1000" />
      </label>

      <div class="actions">
        <button class="btn btn-primary" @click="save">保存配置</button>
        <button
          class="btn"
          :disabled="storageMode === 'none'"
          @click="testConn"
        >
          {{ testState === "testing" ? "测试中…" : "测试连接" }}
        </button>
        <button class="btn btn-danger" @click="clearAll">清除</button>
      </div>

      <p v-if="savedMsg" class="msg">{{ savedMsg }}</p>
      <p v-if="testState === 'ok'" class="msg ok">✅ {{ testMsg }}</p>
      <p v-if="testState === 'fail'" class="msg warn">⚠️ {{ testMsg }}</p>
    </section>

    <section class="note card">
      <b>关于当前演示模式</b>
      <p>
        保存模型配置不会开启真实生成。当前创作页使用内置游戏展示预览；生成和发布服务将在后续接入。
      </p>
    </section>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 760px;
}

.head {
  padding: 24px 28px;
}

.head h1 {
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 2px;
  text-shadow: none;
}

.head p {
  margin: 0;
  font-size: 14px;
  line-height: 1.9;
  color: var(--muted);
}

.head b {
  color: var(--blue);
}

.status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  font-size: 14px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--ink);
  flex: none;
}

.dot.on {
  background: var(--ok);
}

.dot.off {
  background: var(--paper);
}

.prov-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.prov-tile {
  padding: 16px 10px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  border: var(--border);
  transition: transform 0.12s ease;
}

.prov-tile:hover {
  transform: translateY(-2px);
  box-shadow: none;
}

.prov-tile.active {
  background: var(--blue);
  color: #fff;
  transform: none;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form label > span:first-child {
  font-size: 13px;
  font-weight: 900;
}

.form input {
  font-family: inherit;
  font-size: 14px;
  padding: 10px 12px;
  border: var(--border);
  border-radius: 6px;
  background: #fff;
  color: var(--ink);
}

.form input:focus {
  outline: 2px solid var(--blue);
  outline-offset: -2px;
}

.key-row {
  display: flex;
  gap: 8px;
}

.key-row input {
  flex: 1;
  min-width: 0;
}

.btn-mini {
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  padding: 0 14px;
  border: var(--border);
  border-radius: 6px;
  background: var(--paper);
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.btn-danger {
  background: var(--danger);
  color: #fff;
}

.msg {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.msg.warn {
  color: #b3620a;
}

.msg.ok {
  color: var(--ok);
}

.note {
  padding: 18px 22px;
  font-size: 13px;
  line-height: 1.8;
}

.note ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.note code {
  background: var(--paper);
  border: 1px solid var(--grid);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 12px;
}

@media (max-width: 640px) {
  .prov-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
