# UX Validation Report — PromptCraft IO
**Date:** 2026-02-22
**Scope:** `index.html`, `file-binder.html`, `prompt-generator.html`
**Validator:** Claude Code (`/ux-validate`) — Full audit (13 checks × 3 files = 39 instances)

---

## Severity Legend

| Level | Meaning |
|-------|---------|
| **FAIL** | WCAG 2.1 AA 違反または ARIA Authoring Practices 違反。一部ユーザーのアクセスを妨げる |
| **WARN** | UX・アクセシビリティを低下させるが、ハードブロッカーではない |
| **PASS** | 正しく実装されていることを確認済み |

---

## KPI スコアカード

### チェック結果マトリクス（13 項目 × 3 ファイル = 39 インスタンス）

| Check | index.html | prompt-generator.html | file-binder.html |
|-------|:----------:|:---------------------:|:----------------:|
| 1. ARIA Attributes Basic | ✅ PASS | ✅ PASS | ❌ FAIL |
| 2. ARIA Widget Keyboard Patterns | ✅ PASS | ✅ PASS | ✅ PASS |
| 3. Live Regions & Dynamic Content | ✅ PASS | ✅ PASS | ✅ PASS |
| 4. Semantic HTML | ✅ PASS | ✅ PASS | ⚠️ WARN |
| 5. Keyboard Navigation | ✅ PASS | ⚠️ WARN | ✅ PASS |
| 6. Color & Contrast | ✅ PASS | ❌ FAIL | ✅ PASS |
| 7. State Persistence | ✅ PASS | ✅ PASS | ✅ PASS |
| 8. Library Init Order | ✅ PASS | ⚠️ WARN | ✅ PASS |
| 9. Error Handling & Feedback | ✅ PASS | ✅ PASS | ✅ PASS |
| 10. Motion & Animation | ✅ PASS | ⚠️ WARN | ✅ PASS |
| 11. Mobile UX | ✅ PASS | ✅ PASS | ⚠️ WARN |
| 12. CSS Integrity | ✅ PASS | ✅ PASS | ✅ PASS |
| 13. Feature Discoverability | ✅ PASS | ✅ PASS | ❌ FAIL |

### スコアサマリー

| 判定 | 件数 | 割合 |
|------|-----:|-----:|
| ✅ PASS | 31 | 79.5% |
| ⚠️ WARN | 5 | 12.8% |
| ❌ FAIL | 3 | 7.7% |

### KPI スコア

| KPI | スコア | 計算式 |
|-----|-------:|--------|
| **Strict Pass Rate** | **79.5%** | 31 PASS ÷ 39 total |
| **Weighted Score** | **85.9%** | (31 + 0.5×5) ÷ 39 |
| **Accessibility KPI** (Checks 1–6) | **72.2% strict / 80.6% weighted** | Checks 1–6: 13P + 2W + 1F / 18 total |
| **UX/Experience KPI** (Checks 7–13) | **85.7% strict / 90.5% weighted** | Checks 7–13: 18P + 3W + 2F / 21 total |

### ファイル別スコア

| ファイル | PASS | WARN | FAIL | Weighted Score |
|----------|-----:|-----:|-----:|---------------:|
| `index.html` | 13 | 0 | 0 | **100.0%** |
| `prompt-generator.html` | 9 | 3 | 1 | **80.8%** |
| `file-binder.html` | 9 | 2 | 2 | **76.9%** |

---

## 詳細検証結果

### Check 1 — ARIA Attributes: Basic

#### `index.html` — ✅ PASS
- テーマトグルに `aria-label="Toggle dark mode"` + `aria-pressed`、JS内で動的更新（L466, L538）
- 検索入力に `aria-label="Search tools"`（L474）
- カテゴリグループに `role="group"` + `aria-label`（L477）
- 全装飾アイコンに `aria-hidden="true"`

#### `prompt-generator.html` — ✅ PASS
- テーマトグルに `aria-label`・`aria-pressed`、`applyTheme()` 内で更新（L1302–1303）
- タグに `role="checkbox"` + `aria-checked`、クリック時に更新（L1418）
- コンセプトカードに `role="radio"` + `aria-checked`、選択時に更新（L1442–1446）
- カラーオプションボタンに `aria-pressed`、JS内で更新（L1323–1325）
- コピーボタンに `aria-label="Copy generated prompt"`（L1180）、SVGに `aria-hidden`

#### `file-binder.html` — ❌ FAIL
- **[F-1]** `renderSizeAnalysis()` で動的生成されるフォルダー折りたたみボタン（L2487–2493）に `aria-label` も可視テキストもない。アイコンのみのボタンでスクリーンリーダーが目的を伝えられない
- **[F-2]** 同関数内の `folderCheckbox`（L2483–2485）に `aria-label` または `<label>` の関連付けがない
- **[W-1]** ファイルリスト内検索エリアのSVGアイコン（L1429–1435）に `aria-hidden="true"` がない
- **[W-2]** 装飾SVG 3箇所（L1452–1456, L1481–1489, L1503–1507）に `aria-hidden="true"` がない

---

### Check 2 — ARIA Widget Keyboard Patterns

#### 全ファイル — ✅ PASS
- **index.html:** カテゴリボタンは `aria-pressed` トグルパターンで実装。`<button>` ネイティブ動作
- **prompt-generator.html:**
  - Radiogroup pattern: `role="radiogroup"` + `role="radio"` + roving tabindex（`makeRoving()`）をコンセプトカードとカラーテーマ両方に適用（L1272–1293, L1376, L1458）✅
  - Tab panel pattern: ArrowLeft/ArrowRight ナビゲーション、`aria-selected`・`aria-controls`・`aria-labelledby` 完備（L1488–1500）✅
  - Tags（checkbox group）: `role="checkbox"` + `aria-checked` + Enter/Space handler（L1429–1434）✅
- **file-binder.html:** ファイルリストボタンに `aria-pressed`、クリック時に更新（L2336, L2375–2381）✅。Sort ボタンに `aria-pressed` 更新（L3329–3344）✅

---

### Check 3 — Live Regions & Dynamic Content

#### 全ファイル — ✅ PASS
- **index.html:** `#filter-status` に `aria-live="polite"` + `aria-atomic="true"`（L485）、フィルター件数を毎回アナウンス
- **prompt-generator.html:** `#result` に `aria-live="polite"`（L1189）、`#toast` に `role="alert"` + `aria-live="assertive"`（L1201）。バリデーションエラーも toast 経由でアナウンス
- **file-binder.html:** `#operationStatus` に `role="status"` + `aria-live="polite"`（L1523）、結合完了・コピー完了後に更新（L2878–2879, L2908）。エラーに `role="alert"`（L1116）。プログレスバーに `role="progressbar"` + `aria-valuenow` 動的更新（L1037, L1921）

---

### Check 4 — Semantic HTML

#### `index.html` — ✅ PASS
- 見出し階層: h1 → h2（sr-only "Available Tools"）→ h3（カード見出し）✅
- `<main role="main">` あり（L484）✅

#### `prompt-generator.html` — ✅ PASS
- 見出し階層: h1 → h2（4セクション）→ h3（コンセプトカード内）✅
- 全 input/select/textarea に `<label>` あり ✅

#### `file-binder.html` — ⚠️ WARN
- **[W-3]** 「Project Files」が `h3`（L1186）なのに対し、同じ深さの兄弟「File List」が `h2`（L1425）。同レベルのセクションで見出し階層が不一致
- `<main role="main">` あり（L1028）✅。モーダルタイトルは `aria-labelledby` で関連付け ✅

---

### Check 5 — Keyboard Navigation

#### `index.html` — ✅ PASS
- 全インタラクティブ要素に `:focus-visible` スタイル（L137–150）
- `outline: none` の裸の削除なし ✅

#### `prompt-generator.html` — ⚠️ WARN
- **[W-5]** ツールチップ（L689–731）が `:hover` のみでトリガーされ、`:focus-within` がない。キーボードユーザーがツールチップを表示できない
- `.btn`・`.theme-toggle`・`.tab`・`.concept-card`・`.color-theme`・`.tag` に `:focus-visible` スタイルあり ✅

#### `file-binder.html` — ✅ PASS
- ドロップゾーンに `tabindex="0"` + Enter/Space handler（L1032, L3293–3298）✅
- モーダルの focus trap 実装（L2997–3015）、クローズ時にトリガーへフォーカスリターン（L3026–3030）✅
- Escape でモーダル・ポップオーバーを閉じ、フォーカスリターン（L3370–3372, L3393–3399）✅
- ツールチップに `:focus-within` トリガーあり（L700–704）✅

---

### Check 6 — Color & Contrast

#### `index.html` — ✅ PASS
- `--text-light` (#636e72) on `--bg-color` (#f8fafc): 約 4.6:1 ✅ WCAG AA 通過

#### `prompt-generator.html` — ❌ FAIL
- **[F-4]** `.tooltip-icon`（L696–707）: 白テキスト on `--text-tertiary`（#9CA3AF）背景
  - コントラスト比: **2.47:1**（必要: 4.5:1 通常テキスト、12px/bold は大テキスト不該当）
  - WCAG 1.4.3 AA **FAIL**

#### `file-binder.html` — ✅ PASS
- エラー表示 `text-red-700` on `bg-red-50`: 約 6.5:1 ✅
- Tailwind カラーシステムで適切なコントラスト管理

---

### Check 7 — State Persistence

#### 全ファイル — ✅ PASS
- **index.html:** FOUC 防止インラインスクリプトが `<body>` 先頭（L458–464）。カテゴリフィルターを `sessionStorage` で保存・復元（L555, L592, L614）。検索とカテゴリを `filterCards()` で連動 ✅
- **prompt-generator.html:** FOUC スクリプトあり（L899–905）。フォーム全状態（topic・description・tags・concept・colors・tab 等）を `localStorage` に保存・復元（L1954–1975, L2078–2085）✅
- **file-binder.html:** FOUC スクリプトあり（L913–922）、`dark` + `dark-mode` 両クラスを適用 ✅

---

### Check 8 — Third-Party Library Initialization Order

#### `index.html` — ✅ PASS
- ダークモード依存のサードパーティライブラリなし

#### `prompt-generator.html` — ⚠️ WARN
- **[W-6]** `updateMermaidPreviews()` が L1655 でスクリプト評価時（`DOMContentLoaded` 前）に呼ばれる。`mermaid.initialize()` は DOMContentLoaded 内の `applyTheme()` で呼ばれる（L2072）。初回レンダリングは mermaid デフォルト（ライトテーマ）で行われ、ダークモードユーザーに一瞬フラッシュが発生する

#### `file-binder.html` — ✅ PASS
- `mermaid.initialize()` は L1543 で実行。FOUC スクリプト（L913–922）が先に `dark` クラスを付与しており、正しいテーマが読み取られる ✅

---

### Check 9 — Error Handling & Feedback

#### 全ファイル — ✅ PASS
- **index.html:** 検索結果ゼロ時に `#no-results` パネルと「reset filters」ボタン（L486–489）。`aria-live` で件数アナウンス ✅
- **prompt-generator.html:** 必須フィールド未入力時に `role="alert"` toast（L1665–1668）。コピー失敗時も descriptive メッセージ（L1939）✅
- **file-binder.html:** `role="alert"` エラーコンテナ（L1116）。`skippedFiles`/`ignoredFiles` サマリーを結合ドキュメントに出力 ✅

---

### Check 10 — Motion & Animation

#### `index.html` — ✅ PASS
- `@media (prefers-reduced-motion: reduce)` あり（L446–453）
- `opacity: 0` で始まる `.tool-card` アニメーションに対し、reduced-motion 時に `opacity: 1 !important` を明示設定（L452）✅

#### `prompt-generator.html` — ⚠️ WARN
- `@media (prefers-reduced-motion: reduce)` あり（L887–893）
- **[W-7]** `.form-section` の `fadeIn` アニメーション（L763–781）は `opacity: 0` スタートで `animation-fill-mode: forwards`。`animation-duration: 0.01ms` では即完了するが、一部ブラウザで `forwards` 最終状態が確実に適用されないリスクがある。明示的なセーフティネットなし

#### `file-binder.html` — ✅ PASS
- `@media (prefers-reduced-motion: reduce)` あり（L901–907）
- `gradientShift`・`shimmer`・`headerShine`・`pulse-glow`・`float` はすべて reduced-motion で抑制 ✅

---

### Check 11 — Mobile UX

#### `index.html` — ✅ PASS
- カテゴリボタンに `min-height: 44px`（L172）、480px でも維持（L443）✅

#### `prompt-generator.html` — ✅ PASS
- `.color-option-btn` に `min-height: 44px`（L457）✅
- `.tab` に `min-height: 44px`（L551）、768px でパディング変更されても `min-height` は維持 ✅

#### `file-binder.html` — ⚠️ WARN
- **[W-4]** アクションボタン群（combineButton 等）は Tailwind の `py-2` クラスを使用。font-size 0.875rem + padding 0.5rem×2 ≈ **約30–34px** で 44px 未満のタッチターゲットになる可能性。`.btn` に `min-height` の定義なし

---

### Check 12 — CSS Integrity

#### 全ファイル — ✅ PASS
- **index.html:** `body.dark-mode` で使用するカラー変数が再定義済み。`position: absolute` の `.theme-toggle` は `position: relative` の `header` 内 ✅
- **prompt-generator.html:** `--toast-bg`/`--toast-color` が dark-mode でも再定義（L62–63）。`--shadow-lg` は `:root` で定義（L29）✅
- **file-binder.html:** `--glass-bg`・`--glass-border`・`--secondary-600` が dark-mode で再定義（L159, L177–178）。モーダルは `z-50` で適切なスタッキング ✅

---

### Check 13 — Feature Discoverability

#### `index.html` — ✅ PASS
- 検索ゼロ時に空状態メッセージとリセットボタン ✅

#### `prompt-generator.html` — ✅ PASS
- 番号付きセクション見出しで構造が明確。ツールチップで各項目の説明提供 ✅

#### `file-binder.html` — ❌ FAIL
- **[F-3a]** キーボードショートカットパネル（L1020）は **`Ctrl+Enter` でファイル結合** と表示しているが、実際の JS ハンドラー（L3364）は **`Ctrl+C` でファイル結合** を実装。ドキュメントと実装が不一致
- **[F-3b]** `Ctrl+C` をファイル結合にバインドすることで**システム標準のコピー操作を上書き**。ファイル読み込み後にテキスト選択コピーができなくなる

---

## FAIL / WARN 全件サマリー

| # | 重篤度 | ファイル | 行 | 説明 |
|---|--------|----------|----|------|
| F-1 | **FAIL** | file-binder.html | L2487–2493 | 動的生成フォルダートグルボタンに aria-label なし（アイコンのみ） |
| F-2 | **FAIL** | file-binder.html | L2483–2485 | 動的生成フォルダーチェックボックスに label/aria-label なし |
| F-3 | **FAIL** | file-binder.html | L3364, L1020 | Ctrl+C をファイル結合に使用→システムコピーを上書き、かつショートカットパネル（Ctrl+Enter）と不一致 |
| F-4 | **FAIL** | prompt-generator.html | L703–706 | tooltip-icon: 白テキスト on #9CA3AF → コントラスト比 2.47:1（必要: 4.5:1） |
| W-1 | WARN | file-binder.html | L1429–1435 | ファイルリスト内検索アイコンSVGに aria-hidden="true" なし |
| W-2 | WARN | file-binder.html | L1452–1507 | 装飾SVG 3箇所（selectedFile/combined/noFileSelected）に aria-hidden="true" なし |
| W-3 | WARN | file-binder.html | L1186, L1425 | "Project Files" h3 と "File List" h2 が同レベルに共存→見出し階層不一致 |
| W-4 | WARN | file-binder.html | （各ボタン） | アクションボタンのタッチターゲット高さが 44px 未満になる可能性（min-height 未設定） |
| W-5 | WARN | prompt-generator.html | L728 | ツールチップが :hover のみ → :focus-within がなくキーボード非対応 |
| W-6 | WARN | prompt-generator.html | L1655 | updateMermaidPreviews() が mermaid.initialize() 前に呼ばれ→ダークモードで初回テーマフラッシュ |
| W-7 | WARN | prompt-generator.html | L763–781 | form-section の fadeIn は opacity:0 スタート。reduced-motion 時の opacity:1 セーフティネットなし |

---

## ギャップ解消プラン（次セッション以降）

### Priority 1 — FAIL 修正（即時対応推奨）

#### [F-1 / F-2] file-binder.html: 動的生成要素の aria-label 追加
**対象:** `renderSizeAnalysis()` 関数 L2487–2493, L2483–2485
**工数:** XS（30分未満）

```js
// folderToggle ボタン
folderToggle.setAttribute('aria-label', `${folder.path || 'Root'} フォルダーを展開/折りたたむ`);
folderToggle.setAttribute('aria-expanded', 'true');
// フォルダーヘッダーのクリックハンドラー内で aria-expanded も更新する

// folderCheckbox
folderCheckbox.setAttribute('aria-label', `${folder.path || 'Root'} 内のファイルを全選択`);
```

#### [F-3] file-binder.html: Ctrl+C ショートカット修正
**対象:** keydown handler L3364 とショートカットパネル L1020
**工数:** XS（15分）

```js
// 修正前
if ((e.ctrlKey || e.metaKey) && e.key === 'c' && files.length > 0 && !isCombining)
// 修正後（パネルと一致させる）
if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && files.length > 0 && !isCombining)
```

#### [F-4] prompt-generator.html: tooltip-icon コントラスト改善
**対象:** `.tooltip-icon` CSS L703
**工数:** XS（10分）

```css
.tooltip-icon {
    background-color: var(--text-secondary); /* #636e72 → コントラスト ~4.5:1 */
}
```

---

### Priority 2 — WARN 修正（次セッション）

| ID | 対象 | 修正内容 | 工数 |
|----|------|----------|------|
| W-1 / W-2 | file-binder.html L1429–1507 | 装飾SVG 4箇所に `aria-hidden="true"` を追加 | XS |
| W-3 | file-binder.html L1186 | "Project Files" を `h3` → `h2` に変更（または階層整理） | XS |
| W-4 | file-binder.html `.btn` | `.btn { min-height: 44px; }` を CSS に追加 | XS |
| W-5 | prompt-generator.html L728 | `.tooltip:focus-within .tooltip-text { visibility: visible; opacity: 1; }` を追加 | XS |
| W-6 | prompt-generator.html L1655前 | `mermaid.initialize()` を `updateMermaidPreviews()` の前に移動 | S |
| W-7 | prompt-generator.html L887–893 | reduced-motion ブロックに `.form-section { opacity: 1 !important; }` を追加 | XS |

---

### セッション別ロードマップ

| セッション | 対象 | 期待スコア（Weighted） |
|------------|------|----------------------:|
| 現在（Session 1） | — | **85.9%** |
| **Session 2** | FAIL 全件（F-1〜F-4） | **91.0%** |
| **Session 3** | WARN 全件（W-1〜W-7） | **100.0%** |

---

## 合格ポイント（PASS 確認済み）

| チェック内容 | 対象ファイル |
|-------------|------------|
| FOUC 防止インラインスクリプトが `<body>` 先頭にあり | 全ファイル |
| Dark mode が `localStorage` から復元される | 全ファイル |
| `prefers-color-scheme: dark` も尊重 | 全ファイル |
| `<main role="main">` が存在する | 全ファイル |
| `@media (prefers-reduced-motion: reduce)` が定義済み | 全ファイル |
| カテゴリフィルターと検索が連動して動作（独立上書きなし） | index.html |
| カテゴリフィルター状態が `sessionStorage` で保存・復元 | index.html |
| フォーム全状態が `localStorage` で保存・復元 | prompt-generator.html |
| Radiogroup + roving tabindex パターン（コンセプトカード・カラーテーマ） | prompt-generator.html |
| Tab panel の ArrowKey ナビゲーション（ARIA APG 準拠） | prompt-generator.html |
| モーダルの focus trap + トリガーへのフォーカスリターン | file-binder.html |
| Escape でモーダル・ポップオーバーを閉じ、フォーカスリターン | file-binder.html |
| プログレスバーに `role="progressbar"` + `aria-valuenow` 動的更新 | file-binder.html |
| ドロップゾーンがキーボードでも操作可能（tabindex + Enter/Space） | file-binder.html |
| mermaid.initialize() が FOUC スクリプト後に実行（正しいテーマ） | file-binder.html |
| 装飾SVG（getFileIcon()）に `aria-hidden="true"` | file-binder.html |
| 結合完了・コピー完了が `aria-live` でアナウンス | file-binder.html |

---

*Generated by `/ux-validate` — PromptCraft IO Full UX Audit v2 (2026-02-22)*
