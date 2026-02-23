# Refactoring Plan — HTML/CSS/JS 分離
**作成日:** 2026-02-23
**対象:** PromptCraft IO 全ツールページ

---

## 背景と目的

現在の各HTMLファイルはCSS・JavaScriptがインライン混在し、関心のある部分にたどり着くのに
スクロールが必要な状態になっている。

| ファイル | 総行数 | CSS (inline) | JS (inline) | HTML構造 |
|---|---|---|---|---|
| `index.html` | 404 | ~214行 | ~110行 | ~80行 |
| `file-binder.html` | 3,175 | ~600行 | ~1,900行 | ~675行 |
| `prompt-generator.html` | 1,942 | ~724行 | ~850行 | ~368行 |
| `web-content-aggregator.html` | 1,264 | ~513行 | ~574行 | ~177行 |

`styles/base.css` / `styles/components.css` は既に外部化済み。これを足がかりに残りを分離する。

**目標:** HTMLファイルをマークアップ構造のみに絞り、CSS・JSを責務ごとに独立ファイルへ移動する。

---

## 目標ファイル構成

```
utility-tools/
├── index.html                             (~80行  — 構造のみ)
├── file-binder.html                       (~120行 — 構造のみ)
├── prompt-generator.html                  (~60行  — 構造のみ)
├── web-content-aggregator.html            (~50行  — 構造のみ)
│
├── styles/
│   ├── base.css                           (既存・変更なし — CSS変数・リセット)
│   ├── components.css                     (既存・変更なし — 共有UIコンポーネント)
│   ├── index.css                          (新規 ~214行 — ポータル専用)
│   ├── file-binder.css                    (新規 ~600行 — ファイルバインダー専用)
│   ├── prompt-generator.css               (新規 ~724行 — プロンプトジェネレーター専用)
│   └── web-content-aggregator.css         (新規 ~513行 — ウェブアグリゲーター専用)
│
└── js/
    ├── theme-init.js                      (新規 ~10行  — FOUC防止・同期スクリプト)
    ├── theme.js                           (新規 ~30行  — ダークモード共通 ESM export)
    ├── index.js                           (新規 ~110行 — ポータル検索・フィルタ ESM)
    ├── prompt-generator.js                (新規 ~850行 — プロンプト生成 ESM)
    ├── web-content-aggregator.js          (新規 ~574行 — Web取得 ESM)
    └── file-binder/
        ├── constants.js                   (新規 ~50行  — 定数定義 ESM export)
        ├── filters.js                     (新規 ~200行 — .loadignoreパターンマッチ ESM)
        ├── reader.js                      (新規 ~300行 — 非同期ファイル読み込み ESM)
        ├── markdown.js                    (新規 ~200行 — マークダウン生成 ESM)
        ├── ui.js                          (新規 ~500行 — DOM更新・プログレス表示 ESM)
        └── main.js                        (新規 ~650行 — エントリーポイント ESM)
```

---

## ES Modules 設計方針

### GitHub Pages での動作保証

GitHub Pages は HTTPS でホストされ、`.js` を `text/javascript` として配信するため
ES Modules (`import` / `export`) はそのまま動作する。

| 環境 | ES Modules 動作 |
|------|----------------|
| GitHub Pages (HTTPS) | **動作する** |
| `python -m http.server 8080` | **動作する** |
| `npx live-server` | **動作する** |
| ブラウザで直接 `file://` 起動 | 動作しない (CORS制限) |

`file://` 非対応は既存の開発手順 (`python -m http.server`) で回避済みのため問題なし。

### FOUC防止スクリプトの扱い

ダークモードのちらつき防止スクリプトは **ESMにできない**。
`type="module"` は自動で `defer` 扱いになり、DOMレンダリング後に実行されるため。
`theme-init.js` は `<head>` 内に **同期スクリプトとして** 配置する。

```html
<head>
  <!-- ...メタ情報・CDN... -->
  <!-- FOUC防止: defer/module 不可。同期実行必須 -->
  <script src="js/theme-init.js"></script>
</head>
```

```js
// js/theme-init.js — 同期・10行以内に収める
(function () {
    var s = localStorage.getItem('theme');
    var p = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (s === 'dark' || (s === null && p)) {
        document.body.classList.add('dark-mode', 'dark');
    }
}());
```

### テーマトグル共通モジュール

全ページで重複しているダークモード切替ロジックを `js/theme.js` に集約。
各ページのエントリーポイントから `import` して使用する。

```js
// js/theme.js
export function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const icon   = toggle.querySelector('i');

    function apply(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('dark', isDark);
        icon.classList.toggle('fa-sun',  isDark);
        icon.classList.toggle('fa-moon', !isDark);
        toggle.setAttribute('aria-pressed', String(isDark));
    }

    toggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        apply(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}
```

### ページ側の読み込みパターン

```html
<!-- 例: file-binder.html -->
<head>
  <script src="js/theme-init.js"></script>           <!-- 同期: FOUC防止 -->
  <link rel="stylesheet" href="styles/base.css">
  <link rel="stylesheet" href="styles/components.css">
  <link rel="stylesheet" href="styles/file-binder.css">
</head>
<body>
  <!-- ...マークアップ... -->
  <script type="module" src="js/file-binder/main.js"></script>  <!-- ESM -->
</body>
```

```js
// js/file-binder/main.js
import { initTheme }       from '../theme.js';
import { MAX_FILE_SIZE, BINARY_EXTENSIONS } from './constants.js';
import { matchPattern }    from './filters.js';
import { readFiles }       from './reader.js';
import { generateMarkdown } from './markdown.js';
import { renderFileList, updateProgress } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    // ...イベントリスナー登録...
});
```

---

## 実施フェーズ

### Phase 1 — CSS分離（低リスク）✅ 完了 (2026-02-23)

各HTMLの `<style>` ブロックをそのまま対応する `.css` ファイルへ切り出す。
HTML側の `<style>` タグを削除し `<link>` に置き換えるだけ。
ロジックの変更なし。

**手順:**
1. `<style>...</style>` の全内容を `styles/{page}.css` にコピー
2. HTML側の `<style>` を `<link rel="stylesheet" href="styles/{page}.css">` に置換
3. ブラウザで全ページ目視確認（レイアウト崩れなし）

**コミット例:**
```
refactor: extract inline CSS to styles/file-binder.css
```

**完了コミット:**
- `074bc25` refactor: extract inline CSS to external stylesheets (Phase 1)
- `12140dd` docs: add refactoring plan for HTML/CSS/JS separation
- `4ef316b` fix: replace Unicode checkmark with Font Awesome icon for Windows compatibility

**成果物:**
- `styles/index.css` (~214行)
- `styles/file-binder.css` (~600行)
- `styles/prompt-generator.css` (~724行)
- `styles/web-content-aggregator.css` (~513行)

---

### Phase 2 — JS共通モジュール化（中リスク）✅ 完了 (2026-02-24)

**2-a. `js/theme-init.js` 作成** ✅
`file-binder.html` の `<body>` 直後にある同期スクリプト（FOUC防止）を
`js/theme-init.js` に切り出し、全ページの `<head>` から同期読み込みに統一。

**2-b. `js/theme.js` 作成** ✅
全ページで重複しているダークモードトグルロジックを ESM として抽出。

**2-c. 単一ファイルのJS外部化** ✅
`index.js`, `prompt-generator.js`, `web-content-aggregator.js` の
メイン `<script>` ブロックを外部ファイルへ移動。
`index.js` / `web-content-aggregator.js` は `import { initTheme }` を使用。
`prompt-generator.js` は Mermaid と統合したカスタム `applyTheme` を維持。

**成果物:**
- `js/theme-init.js` (~10行 — 同期FOUC防止)
- `js/theme.js` (~30行 — ESM共通ダークモード)
- `js/index.js` (~70行 — ポータル検索・フィルタ)
- `js/prompt-generator.js` (~580行 — プロンプト生成)
- `js/web-content-aggregator.js` (~330行 — Web取得)

**HTMLの変更:**
- 全4ページ: `<script src="js/theme-init.js">` を `<head>` に追加
- `index.html`: 97行（削減前 192行）
- `prompt-generator.html`: 328行（削減前 1242行）
- `web-content-aggregator.html`: 181行（削減前 753行）
- `file-binder.html`: body内FOUCスクリプトを除去（JS本体はPhase 3で対応）

**検証:** 各ページの全機能（テーマトグル・検索・フィルタ・保存）が正常動作すること

**コミット例:**
```
refactor: extract theme logic and split JS to external modules
```

---

### Phase 3 — `file-binder.js` モジュール分割（最後に実施）

`file-binder.js` は分離後も ~1,900行残るため、責務ごとにモジュール分割する。

| ファイル | 責務 | 主な内容 |
|---|---|---|
| `constants.js` | 定数定義 | `MAX_FILE_SIZE`, `BINARY_EXTENSIONS`, `CHUNK_SIZE` |
| `filters.js` | パターンマッチ | `.loadignore` パース・マッチング・キャッシュ |
| `reader.js` | ファイル読み込み | 非同期読み込み・チャンク処理・タイムアウト |
| `markdown.js` | 出力生成 | マークダウン結合・ヘッダー生成・フォーマット |
| `ui.js` | DOM更新 | ファイルリスト描画・プログレスバー・エラー表示 |
| `main.js` | エントリーポイント | DOMContentLoaded・イベントリスナー・`initTheme()` 呼び出し |

**コミット例:**
```
refactor: split file-binder into ES module components
```

---

## 実施順序

```
Phase 1 (CSS分離)
  → 全ページ目視確認
    → Phase 2-a (theme-init.js)
      → Phase 2-b (theme.js)
        → Phase 2-c (index / prompt / web-aggregator)
          → 全機能テスト
            → Phase 3 (file-binder モジュール分割)
              → 全機能テスト
```

各Phaseを独立したPRとし、問題発生時に切り戻しやすくする。

---

## 検証チェックリスト（各Phase後）

### CSS分離後
- [ ] 全ページのレイアウト・カラーが変わっていない
- [ ] ダークモード切替でスタイルが正しく切り替わる
- [ ] レスポンシブ（480px・768px）が崩れていない

### JS外部化後
- [ ] テーマトグルが全ページで動作し localStorage に保存される
- [ ] リロード後にテーマが復元される（FOUC なし）
- [ ] 検索・カテゴリフィルタが動作する（index.html）
- [ ] ファイルドロップ・結合・ダウンロードが動作する（file-binder.html）
- [ ] プロンプト生成・コピーが動作する（prompt-generator.html）
- [ ] URL取得・マークダウン出力が動作する（web-content-aggregator.html）

### file-binder モジュール分割後
- [ ] ファイルドロップ（単ファイル・フォルダ）が動作する
- [ ] `.loadignore` パターンが正しく機能する
- [ ] チャンク処理・プログレスバーが正常に動作する
- [ ] Mermaid ダイアグラムが描画される
- [ ] ダウンロード・クリップボードコピーが動作する
- [ ] キーボードショートカット（Ctrl+Enter・Ctrl+D）が動作する

---

## 制約・注意事項

### `type="module"` の挙動
- 自動的に `defer` 扱い → `DOMContentLoaded` イベントで初期化するパターンがそのまま使える
- 厳格モード (`'use strict'`) が自動適用される
- トップレベルの変数がグローバルスコープに漏れなくなる（意図的なグローバルは `window.xxx` に明示）

### CDN読み込みライブラリとの連携
`mermaid`, `hljs`, `saveAs` 等のCDNライブラリは `window` オブジェクト経由でアクセス可能。
ESMモジュール内からも `window.mermaid` として呼び出せる。
ただしCDNスクリプトの読み込み完了を待つ必要があるため、
Mermaid初期化は `DOMContentLoaded` 内に置くこと。

```js
// ESMモジュール内でのCDNライブラリ利用
import { initTheme } from '../theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    // mermaid は CDN から window.mermaid として利用可能
    window.mermaid.initialize({ startOnLoad: true, theme: 'default' });
});
```

### Tailwind CDN と ESM の共存
`file-binder.html` は `<script src="https://cdn.tailwindcss.com">` を使用している。
TailwindのCDN版はグローバルに動作するため、ESMへの移行後も影響なし。

### ローカル開発
`file://` プロトコルでの直接開放は Phase 2 以降で動作しなくなる。
必ず HTTP サーバーを使用すること。

```bash
python -m http.server 8080
# または
npx live-server
```

---

## 参照ドキュメント

| ドキュメント | 場所 | 内容 |
|------------|------|------|
| プロジェクト規約 | `CLAUDE.md` | HTML構造・CSS変数・ダークモードパターン |
| ツール追加ガイド | `add-pages-guideline.md` | 新ツール追加手順 |
| UX改善計画 (Phase 2) | `.claude/sprint-plan-2026-02-22.md` | Sprint 4–6 タスク |
| UX検証レポート | `.claude/reports/ux-validation-2026-02-22.md` | 既知の問題一覧 |
