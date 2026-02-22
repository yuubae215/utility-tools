# Sprint Plan — Phase 2 (Sprint 4–6)
**Created:** 2026-02-22
**Basis:** UX Validation Report 2026-02-22 (13 FAIL, 10 WARN)
**Preceding work:** Sprints 1–3 完了 (ux-improvement-plan.md 参照)

---

## KPI Framework (Phase 2 更新版)

| # | KPI | ベースライン(S3後) | Phase2目標 | 計測方法 |
|---|-----|------------------|-----------|---------|
| K1 | ARIA Coverage Rate | ~87% | 100% | インタラクティブ要素 + 装飾アイコンのaria属性カバー率 |
| K2 | Keyboard Accessibility Rate | ~88% | 100% | Tab到達可能 + radiogroup矢印キー対応率 |
| K3 | State Persistence (FOUC含) | 3/3 (FOUC回帰) | 3/3 + 0 FOUC | リロード後テーマ一致 + ページ読み込み時のチラツキなし |
| K4 | Focus Visibility Score | 0 violations | 0 (維持) | outline:none 無ガード件数 |
| K5 | Mobile Core-Flow | ~100% | 100% (維持) | 375px タッチ操作完遂率 |
| K6 | Feature Discoverability | ~74% | 90%+ | ドキュメント済みアフォーダンス / 全実装アフォーダンス |
| **K7** | **Motion Safety** | **0%** | **100%** | prefers-reduced-motion 対応ファイル数 / 3 |

---

## Sprint 4 — P0: Motion Safety & FOUC (K7, K3)
**目的:** アクセシビリティの最重要課題を解消。ユーザー環境設定の尊重。
**スコープ:** ~70行のCSS/HTML変更 (全3ファイル)

### タスク一覧

| ID | タスク | ファイル | 対象Issue | KPI |
|----|--------|---------|----------|-----|
| S4-1 | `@media (prefers-reduced-motion: reduce)` グローバルルール追加 (全ファイル) | 全3ファイル | F-13 | K7 |
| S4-2 | `index.html` `.tool-card { opacity: 1 }` フォールバック追加 | index.html | F-01, F-13 | K7 |
| S4-3 | `file-binder.html` 無限アニメーション5種の reduced-motion 停止 | file-binder.html | W-09, F-13 | K7 |
| S4-4 | `index.html` FOUC防止インラインスクリプト追加 | index.html | F-03 | K3 |
| S4-5 | `prompt-generator.html` FOUC防止インラインスクリプト追加 | prompt-generator.html | F-06 | K3 |

### 実装詳細

**S4-1: グローバル reduced-motion ルール (各ファイルの `</style>` 直前に追加)**
```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
    }
}
```

**S4-2: index.html 追加ルール (S4-1と同ブロック内)**
```css
@media (prefers-reduced-motion: reduce) {
    /* ... global rules above ... */
    .tool-card { opacity: 1 !important; }
}
```

**S4-4 / S4-5: FOUC防止スクリプト (`<body>` 開始直後に挿入)**
```html
<body>
<script>
(function(){
    var s = localStorage.getItem('theme');
    var p = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(s === 'dark' || (s === null && p)) document.body.classList.add('dark-mode');
})();
</script>
```

### 完了条件
- `grep -L 'prefers-reduced-motion' *.html` → 空 (K7 = 100%)
- `index.html` をダークモードで保存→リロードしてカードが即座にダークで表示 (K3 FOUC解消)
- `prompt-generator.html` 同上

---

## Sprint 5 — P1: ARIA & Keyboard Correctness (K1, K2)
**目的:** ARIA セマンティクスとキーボード操作パターンの完全準拠。
**スコープ:** ~120行のHTML/JS変更

### タスク一覧

| ID | タスク | ファイル | 対象Issue | KPI |
|----|--------|---------|----------|-----|
| S5-1 | `getFileIcon()` 全SVGに `aria-hidden="true"` 追加 | file-binder.html | F-11 | K1 |
| S5-2 | 選択ファイルボタンに `aria-pressed` 動的設定 | file-binder.html | F-12 | K1 |
| S5-3 | `progressBar` に `role="progressbar"` + aria-value属性追加 + JS更新 | file-binder.html | F-07 | K1 |
| S5-4 | `loadignorePopover` を `role="dialog"` → `role="region"` に変更 | file-binder.html | F-08 | K1, K2 |
| S5-5 | コンセプトカード radiogroup にローリングtabindex + Arrow キーハンドラ追加 | prompt-generator.html | F-04 | K2 |
| S5-6 | カラーテーマ radiogroup にローリングtabindex + Arrow キーハンドラ追加 | prompt-generator.html | F-05 | K2 |
| S5-7 | ツールチップに `:focus-within` トリガー追加 (全ファイル) | file-binder.html | F-09 | K2 |
| S5-8 | `#result` div に `aria-live="polite"` 追加 | prompt-generator.html | W-06 | K1 |
| S5-9 | Combine/Copy 完了後の `aria-live` 通知追加 | file-binder.html | W-10 | K1 |

### 実装詳細

**S5-2: 選択ファイルの aria-pressed (renderFileList 内)**
```js
// 前のアクティブ解除
if (activeFileItem) {
    activeFileItem.classList.remove('active');
    activeFileItem.setAttribute('aria-pressed', 'false');
}
// 新規選択
button.classList.add('active');
button.setAttribute('aria-pressed', 'true');
activeFileItem = button;
```

**S5-3: progressBar ARIA**
```html
<!-- HTML -->
<div id="progressBar" class="progress-bar" style="width: 0%"
     role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
     aria-label="File processing progress"></div>
```
```js
// JS: updateProgress 関数内
function updateProgress(percent) {
    const p = Math.round(percent);
    progressBar.style.width = p + '%';
    progressBar.setAttribute('aria-valuenow', p);
    progressText.textContent = p;
}
```

**S5-4: role="dialog" → role="region"**
```html
<!-- Before -->
<div id="loadignorePopover" role="dialog" aria-label="Loadignore pattern filtering help" hidden>
<!-- After -->
<div id="loadignorePopover" role="region" aria-label="Loadignore pattern filtering help" hidden>
```
> `role="region"` はフォーカス管理不要。情報提示に適切。

**S5-5 / S5-6: makeRoving ユーティリティ (scriptタグ内に追加)**
```js
function makeRoving(items) {
    items.forEach((item, i) => {
        const isChecked = item.getAttribute('aria-checked') === 'true';
        item.setAttribute('tabindex', isChecked ? '0' : '-1');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const next = items[(i + 1) % items.length];
                items.forEach(t => t.setAttribute('tabindex', '-1'));
                next.setAttribute('tabindex', '0');
                next.focus();
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = items[(i - 1 + items.length) % items.length];
                items.forEach(t => t.setAttribute('tabindex', '-1'));
                prev.setAttribute('tabindex', '0');
                prev.focus();
            }
        });
    });
}
// 呼び出し (DOMContentLoaded 内)
const conceptCards = document.querySelectorAll('.concept-card');
const themeItems = document.querySelectorAll('.color-theme');
makeRoving(Array.from(conceptCards));
makeRoving(Array.from(themeItems));
// selectCard / selectTheme 実行時にもローリングtabindex を再適用すること
```

**S5-7: ツールチップ :focus-within (file-binder.html CSS)**
```css
/* Before */
.tooltip:hover .tooltip-text { visibility: visible; opacity: 1; }
/* After */
.tooltip:hover .tooltip-text,
.tooltip:focus-within .tooltip-text { visibility: visible; opacity: 1; }
```

**S5-9: Combine完了通知**
```html
<!-- footer直前に追加 -->
<div id="operationStatus" role="status" aria-live="polite" aria-atomic="true"
     class="sr-only"></div>
```
```js
// combineFiles() 完了後
document.getElementById('operationStatus').textContent =
    `Files combined: ${files.length} files, ${formatFileSize(totalBytes)}`;
// copyCombinedFile() 成功後
document.getElementById('operationStatus').textContent = 'Copied to clipboard';
```

### 完了条件
- 全SVG icon に aria-hidden ✅ (grep確認)
- 選択ファイル: キーボードでTab→Enter選択後、aria-pressed="true" が設定される
- progressBar: DevTools で role/aria-valuenow 確認
- コンセプトカード: Tab→フォーカス→Arrow右 で次カードへ移動
- カラーテーマ: 同様の動作

---

## Sprint 6 — P2: Polish, Contrast & Discoverability (K5, K6)
**目的:** コントラスト修正、CSS整合性、フィーチャー発見性の向上。
**スコープ:** ~80行のCSS/HTML変更

### タスク一覧

| ID | タスク | ファイル | 対象Issue | KPI |
|----|--------|---------|----------|-----|
| S6-1 | "Layout" カテゴリボタン削除 | index.html | F-02 | K6 |
| S6-2 | カテゴリボタン全ブレークポイントで `min-height: 44px` | index.html | W-01 | K5 |
| S6-3 | `--secondary-600` 定義追加 または `var(--secondary-color)` に置換 | file-binder.html | F-10, W-08 | CSS整合 |
| S6-4 | `.result-card { position: relative; }` 追加 | prompt-generator.html | W-04 | CSS整合 |
| S6-5 | ダークモード toast/copy-status コントラスト修正 | prompt-generator.html | W-05 | コントラスト |
| S6-6 | color-option-btn / tab の min-height: 44px 対応 | prompt-generator.html | W-02, W-03 | K5 |
| S6-7 | キーボードショートカット Tips パネル追加 (file-binder) | file-binder.html | K6計画 | K6 |
| S6-8 | Combine/Download ボタンに title 属性でショートカット表示 | file-binder.html | K6計画 | K6 |
| S6-9 | Mermaid プレビュー自動更新のヒントテキスト追加 | prompt-generator.html | K6計画 | K6 |
| S6-10 | Mermaid 初期化タイミング修正 (FOUC後に依存するよう再配置) | prompt-generator.html | W-07 | 初期化順 |

### 実装詳細

**S6-1: Layout カテゴリ削除 (index.html)**
```html
<!-- 削除する行 -->
<button class="category-btn" data-category="layout" aria-pressed="false">Layout</button>
```

**S6-2: min-height 全ブレークポイント (index.html CSS)**
```css
/* Before: min-height が 480px のみ */
.category-btn { padding: 6px 12px; }
@media (max-width: 480px) { .category-btn { min-height: 44px; } }

/* After: 常に min-height を保証 */
.category-btn { padding: 6px 12px; min-height: 44px; }
```

**S6-3: --secondary-600 修正 (file-binder.html)**
```css
/* :root に追加 */
:root {
    --secondary-600: #059669; /* Tailwind emerald-600 相当 */
}
body.dark-mode {
    --secondary-600: #34d399; /* Tailwind emerald-400 相当 */
}
```

**S6-5: ダークモードコントラスト修正 (prompt-generator.html CSS)**
```css
:root {
    --toast-bg: #2c3e50;
    --toast-color: #f8fafc;
}
body.dark-mode {
    --toast-bg: #1e293b;   /* contrast with #f1f5f9: ~14.7:1 ✅ */
    --toast-color: #f1f5f9;
}
.toast {
    background-color: var(--toast-bg);
    color: var(--toast-color);
}
.copy-status {
    background-color: var(--toast-bg);
    color: var(--toast-color);
}
```

**S6-7: キーボードショートカット Tips (file-binder.html)**

ヘッダー右端に "?" ボタンを追加し、`role="region"` のパネルを表示:
```html
<!-- ヘッダーの action buttons 内 -->
<button id="shortcutHelpBtn" aria-label="Show keyboard shortcuts"
        aria-expanded="false" aria-controls="shortcutPanel"
        class="... (既存ボタンと同スタイル)">?</button>

<!-- main直前 -->
<div id="shortcutPanel" role="region" aria-label="Keyboard shortcuts" hidden
     class="card mx-4 p-4 text-sm">
    <table class="w-full">
        <caption class="text-left font-semibold mb-2">Keyboard Shortcuts</caption>
        <tr><td class="py-1 pr-4"><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>Combine files</td></tr>
        <tr><td class="py-1 pr-4"><kbd>Ctrl</kbd>+<kbd>D</kbd></td><td>Download as .md</td></tr>
        <tr><td class="py-1 pr-4"><kbd>Escape</kbd></td><td>Close dialog / popover</td></tr>
    </table>
</div>
```

**S6-8: title 属性でショートカット表示 (file-binder.html)**
```html
<!-- Before -->
<button id="combineButton" aria-label="Combine files" ...>
<!-- After -->
<button id="combineButton" aria-label="Combine files (Ctrl+C)" title="Combine files (Ctrl+C)" ...>

<button id="downloadButton" aria-label="Download as markdown file (Ctrl+D)" title="Download (Ctrl+D)" ...>
```

**S6-9: Mermaid ヒントテキスト (prompt-generator.html)**
```html
<!-- プレビューパネルのヘッダー下 -->
<p class="text-xs text-light mt-1" aria-live="off">
    <i class="fas fa-sync-alt" aria-hidden="true"></i>
    Preview updates automatically as you change options
</p>
```

**S6-10: Mermaid 初期化タイミング修正 (prompt-generator.html)**

`mermaid.initialize()` を DOMContentLoaded 内の `applyTheme()` 呼び出し後のみに移動し、スクリプトトップレベルでの呼び出しを削除。

### 完了条件
- `index.html`: Layout ボタン削除 + 全カテゴリボタンで44px確認
- `file-binder.html`: `var(--secondary-600)` が定義され、スクロールバーグラデーションが正常表示
- `prompt-generator.html`: ダークモードでトーストのコントラスト ≥ 4.5:1
- キーボードショートカットが "?" ボタンから発見できる
- K6: ≥ 90% (アフォーダンス文書化率)

---

## KPI 目標値 ダッシュボード

```
KPI              S3後(前回) Sprint4  Sprint5  Sprint6  目標
─────────────────────────────────────────────────────────────
K1 ARIA %           ~87%      87%      100%     100%    100%
K2 Keyboard %       ~88%      88%      100%     100%    100%
K3 Persist+FOUC   3/3+FOUC  3/3✅     3/3✅    3/3✅   3/3✅
K4 Focus Viol.        0        0         0        0       0
K5 Mobile %        ~100%    ~100%     ~100%    100%    100%
K6 Discov. %        ~74%     ~74%      ~74%     90%+    90%
K7 Motion Safety      0%     100%      100%     100%    100%
```

---

## セッション開始チェックリスト

次のセッションでスプリントを開始する際は、以下の順序で実行してください:

```bash
# 1. 開発ブランチ作成
git checkout master
git pull origin master
git checkout -b claude/ux-sprint4-<session-id>

# 2. 実装 (各スプリントのタスクIDに従う)

# 3. 回帰チェック (実装後)
grep -L 'prefers-reduced-motion' *.html        # K7: 空であること
grep -L 'localStorage' file-binder.html prompt-generator.html  # K3: 空であること
grep -rn 'var(--secondary-600)' *.html         # F-10: 変数定義後に再チェック
grep -rn 'outline: none\|outline:0' *.html     # K4: 空であること

# 4. コミット & プッシュ
git add <changed-files>
git commit -m "fix: Sprint 4 — prefers-reduced-motion + FOUC prevention"
git push -u origin claude/ux-sprint4-<session-id>
```

---

## 参照ドキュメント

| ドキュメント | 場所 | 内容 |
|------------|------|------|
| Phase 1 計画 | `.claude/ux-improvement-plan.md` | Sprint 1–3 KPI・タスク・完了条件 |
| Phase 1 検証レポート | `.claude/reports/ux-validation-2026-02-21.md` | Sprint 1–3 実施後の計測結果 |
| Phase 2 検証レポート | `.claude/reports/ux-validation-2026-02-22.md` | 今回の全発見事項 (13 FAIL, 10 WARN) |
| Phase 2 計画 (本書) | `.claude/sprint-plan-2026-02-22.md` | Sprint 4–6 タスク・実装詳細 |
| UX バリデートコマンド | `.claude/commands/ux-validate.md` | 検証チェックリスト (毎スプリント後実行) |
| デザインレビューコマンド | `.claude/commands/design-review.md` | ビジュアル一貫性チェック |
