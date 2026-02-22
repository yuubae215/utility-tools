# UX Validation Report — PromptCraft IO
**Date:** 2026-02-22
**Auditor:** Claude Code (automated, full-source inspection)
**Scope:** `index.html`, `prompt-generator.html`, `file-binder.html`
**Baseline reference:** `ux-validation-2026-02-21.md` (Sprint 1–3 完了後)

---

## KPI Scorecard (Re-measurement)

| KPI | Sprint3後 (前回) | 今回 | Δ | 原因 |
|-----|----------------|------|---|------|
| K1 ARIA Coverage | ~100% | ~87% | ▼ | getFileIcon SVGs / 選択ファイル aria-pressed 未実装 |
| K2 Keyboard Accessibility | ~100% | ~88% | ▼ | radiogroup 矢印キー・ローリングtabindex 未実装 |
| K3 State Persistence | 3/3 | 3/3 (FOUC 回帰) | ⚠ | index.html / prompt-generator.html で FOUC 防止スクリプト欠落 |
| K4 Focus Violations | 0 | 0 | = | 維持 ✅ |
| K5 Mobile Completion | ~100% | ~100% | = | 維持 ✅ |
| K6 Discoverability | ~86% | ~74% | ▼ | ツールチップがキーボードでトリガーされない |
| **K7 Motion Safety** | 未計測 | **0%** | NEW | prefers-reduced-motion 未対応 (全ファイル) |

> **K7 Motion Safety** を新KPIとして追加。全ファイルで `@media (prefers-reduced-motion)` が未実装、`index.html` ではアニメーション無効環境でツールカードが不可視になる致命的バグを確認。

---

## 発見事項一覧

### FAIL (13件)

| # | File | Line | 説明 |
|---|------|------|------|
| F-01 | index.html | 328 | `.tool-card { opacity: 0 }` + no reduced-motion override → カード不可視 |
| F-02 | index.html | 463 | "Layout" カテゴリが常に0件 (対応ツールなし) |
| F-03 | index.html | 507 | FOUC防止スクリプトなし (ダークモードがDOMContentLoaded後に適用) |
| F-04 | prompt-generator.html | 946 | radiogroup にArrowキーナビゲーション・ローリングtabindex なし (コンセプトカード) |
| F-05 | prompt-generator.html | 988 | radiogroup にArrowキーナビゲーション・ローリングtabindex なし (カラーテーマ) |
| F-06 | prompt-generator.html | 2013 | FOUC防止スクリプトなし |
| F-07 | file-binder.html | 1006 | progressBar に role="progressbar" / aria-valuenow / aria-valuemin / aria-valuemax なし |
| F-08 | file-binder.html | 1029 | loadignorePopover が role="dialog" だがフォーカス管理なし |
| F-09 | file-binder.html | 664 | ツールチップがホバー専用 (WCAG 2.1 SC 1.4.13 違反) |
| F-10 | file-binder.html | 337 | `--secondary-600` CSS変数が未定義 (スクロールバー・フッターグラデーション破損) |
| F-11 | file-binder.html | 2307 | getFileIcon() の SVGに aria-hidden="true" なし |
| F-12 | file-binder.html | 2340 | 選択中ファイルボタンに aria-pressed/aria-current なし |
| F-13 | 全ファイル | — | `@media (prefers-reduced-motion: reduce)` ブロックなし |

### WARN (10件)

| # | File | Line | 説明 |
|---|------|------|------|
| W-01 | index.html | 364 | カテゴリボタン 481–768px でタッチターゲット < 44px |
| W-02 | prompt-generator.html | 450 | color-option-btn タッチターゲット < 44px |
| W-03 | prompt-generator.html | 544 | tab タッチターゲット < 44px (モバイル) |
| W-04 | prompt-generator.html | 777 | .copy-status が position:absolute だが親 .result-card に position:relative なし |
| W-05 | prompt-generator.html | 664 | copy/toast ダークモードでコントラスト不足 (~1.1:1 vs WCAG AA 4.5:1) |
| W-06 | prompt-generator.html | 1159 | #result div に aria-live なし (生成完了をスクリーンリーダーが検知できない) |
| W-07 | prompt-generator.html | 1177 | Mermaid が FOUC防止スクリプトより先に初期化 (テーマ常にdefault) |
| W-08 | file-binder.html | 723 | footer グラデーションも --secondary-600 参照 (F-10と同根) |
| W-09 | file-binder.html | 761 | 無限アニメーション5種に prefers-reduced-motion 対応なし |
| W-10 | file-binder.html | 2824 | Combine/Copy 完了後にスクリーンリーダー通知なし |

### PASS (13件) — 前スプリント成果の継続確認

| Check | Pages | 確認内容 |
|-------|-------|---------|
| FOUC防止インラインスクリプト | file-binder.html | `<body>` 冒頭で同期適用 ✅ |
| モーダルフォーカストラップ | file-binder.html | Tab/Shift+Tab, Escape, フォーカス復帰 ✅ |
| role="dialog" + aria-modal + aria-labelledby | file-binder.html | Size Analysis モーダル ✅ |
| toggleFilterPanel aria-expanded 動的更新 | file-binder.html | JS内で正確に更新 ✅ |
| sortByName/sortBySize aria-pressed 動的更新 | file-binder.html | JS内で正確に更新 ✅ |
| タブパネル Arrow キーナビゲーション | prompt-generator.html | ArrowLeft/ArrowRight ✅ |
| role="alert" トースト | prompt-generator.html | aria-live="assertive" + aria-atomic ✅ |
| 全フォームに label 関連付け | prompt-generator.html | for/id または aria-label ✅ |
| フォーム状態 localStorage 永続化 | prompt-generator.html | 全入力フィールド ✅ |
| category+search AND ロジック | index.html | 同時フィルタリング ✅ |
| Font Awesome 6.4.0 統一 | 全ファイル | CDN バージョン一致 ✅ |
| フィルター結果 aria-live 通知 | index.html | aria-live="polite" ✅ |
| Select Files ボタン + keyboard drop zone | file-binder.html | Enter/Space でファイル選択 ✅ |

---

## 新KPI 定義: K7 Motion Safety

### K7 ✅ when:
- 全ファイルに `@media (prefers-reduced-motion: reduce)` ブロックが存在する
- `animation-duration: 0.01ms !important` + `animation-iteration-count: 1 !important` が設定されている
- `opacity: 0` を持ちアニメーションで表示される要素は、reduced-motion 時に `opacity: 1` へフォールバックする
- 無限アニメーション (`infinite`) は reduced-motion 時に静止状態になる

**計測方法:** `grep -L 'prefers-reduced-motion' *.html` の出力が空になること

---

## Regression Guard 更新版

```bash
# K3: FOUC防止スクリプトの存在確認
grep -c 'localStorage.*theme.*prefersDark\|stored.*prefersDark' index.html prompt-generator.html
# Expected: 各ファイルで 1以上

# K7: reduced-motion ブロックの存在確認
grep -L 'prefers-reduced-motion' *.html
# Expected: 空 (全ファイルに存在)

# F-10: --secondary-600 未定義変数の確認
grep -n 'var(--secondary-600)' *.html
# Expected: 空 (変数定義済みか参照削除)

# F-11: getFileIcon SVGs aria-hidden 確認
grep -A2 'function getFileIcon' file-binder.html | grep 'aria-hidden'
# Expected: SVGマップの全エントリに aria-hidden="true"
```
