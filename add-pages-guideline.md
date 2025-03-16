# 設計支援ツールポータル - ページ追加ガイドライン

このガイドラインでは、設計支援ツールポータルに新しいツールページを追加する方法について説明します。ガイドラインに従うことで、一貫したデザインとユーザーエクスペリエンスを維持できます。

## 目次

1. [ファイル構造](#ファイル構造)
2. [新しいツールページの作成](#新しいツールページの作成)
3. [ランディングページへの追加](#ランディングページへの追加)
4. [アイコンとカラー](#アイコンとカラー)
5. [カテゴリー](#カテゴリー)
6. [テスト](#テスト)

## ファイル構造

プロジェクトのファイル構造は以下のようになっています：

```
utility-tools/
├── index.html             # ランディングページ
├── color-palette.html     # カラーパレット生成ツール
├── layout-tool.html       # レイアウト設計ツール
├── size-calculator.html   # サイズ計算ツール
├── font-pairing.html      # フォント組み合わせツール
└── [your-new-tool].html   # 新しいツールページ
```

## 新しいツールページの作成

1. **テンプレートを使用する**

既存のツールページ（例：`color-palette.html`）をコピーして新しいファイルを作成します。ファイル名は機能を表す英語の小文字とハイフンを使用してください。

2. **基本構造を維持する**

新しいツールページには以下の基本構造を維持してください：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ツール名 - 設計支援ツール</title>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        /* スタイル設定 */
    </style>
</head>
<body>
    <header>
        <h1>ツール名</h1>
        <p class="description">このツールの説明文...</p>
        <a href="index.html" class="home-link">← ホームに戻る</a>
    </header>

    <main>
        <!-- ツールの内容 -->
    </main>

    <footer>
        <p>&copy; 2025 設計支援ツールポータル｜<a href="https://github.com/yuubae215/utility-tools">GitHub</a></p>
    </footer>

    <script>
        // JavaScriptコード
    </script>
</body>
</html>
```

3. **スタイル**

基本的なスタイル（色、フォント、ボタンのデザインなど）は一貫性を保つために既存のツールページから流用してください。以下の変数は共通で使用されています：

```css
:root {
    --primary-color: #3498db;
    --primary-dark: #2980b9;
    --text-color: #2c3e50;
    --text-light: #636e72;
    --bg-color: #f8f9fa;
    --card-color: #fff;
    --shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

4. **「ホームに戻る」リンク**

すべてのツールページには、ランディングページに戻るためのリンクを含めてください：

```html
<a href="index.html" class="home-link">← ホームに戻る</a>
```

5. **フッター**

フッターに正しいGitHubリポジトリのリンクを含めてください：

```html
<footer>
    <p>&copy; 2025 設計支援ツールポータル｜<a href="https://github.com/yuubae215/utility-tools">GitHub</a></p>
</footer>
```

## ランディングページへの追加

新しいツールを作成したら、ランディングページ（`index.html`）に追加する必要があります。

1. **`tools-grid` に新しいカードを追加**

`index.html` の `<div class="tools-grid" id="tools-grid">` 内に新しいツールカードを追加します：

```html
<!-- 新しいツールカード -->
<div class="tool-card" data-category="[カテゴリー]">
    <div class="tool-icon">
        <i class="fas fa-[アイコン名]"></i>
    </div>
    <div class="tool-content">
        <h3>[ツール名]</h3>
        <p>[ツールの説明]</p>
        <a href="[ファイル名].html" class="button">ツールを使用する</a>
    </div>
</div>
```

2. **カスタムスタイルの追加**

必要に応じて、新しいツールカードのアイコン背景色を定義します：

```css
.tool-card:nth-child([番号]) .tool-icon {
    background: linear-gradient(135deg, #[色1], #[色2]);
}
```

## アイコンとカラー

1. **Font Awesomeアイコンの選択**

[Font Awesome Icons](https://fontawesome.com/icons) から適切なアイコンを選択してください。アイコンはツールの機能を直感的に表現するものを選びましょう。

例：
- `fa-palette`: カラー関連のツール
- `fa-font`: タイポグラフィ関連のツール
- `fa-ruler-combined`: 測定関連のツール
- `fa-th-large`: レイアウト関連のツール

2. **グラデーションカラーの設定**

各ツールカードには固有のグラデーション背景色を設定します。推奨される色の組み合わせ：

- 青系: `#3498db` → `#2980b9`
- 赤系: `#e74c3c` → `#c0392b`
- 緑系: `#2ecc71` → `#27ae60`
- 紫系: `#9b59b6` → `#8e44ad`
- 黄系: `#f1c40f` → `#f39c12`
- ティール系: `#1abc9c` → `#16a085`

## カテゴリー

各ツールには以下のいずれかのカテゴリーを割り当ててください：

- `color`: 色に関するツール
- `layout`: レイアウトやデザイン構成に関するツール
- `typography`: フォントやテキストに関するツール
- `measure`: 測定、計算、変換に関するツール

カテゴリーは `data-category` 属性に設定します：

```html
<div class="tool-card" data-category="color">
```

## テスト

新しいページを追加した後は、以下の点をテストしてください：

1. ランディングページから新しいツールページにアクセスできるか
2. 新しいツールページからランディングページに戻れるか
3. ツールの機能が正しく動作するか
4. ランディングページの検索機能で新しいツールが検索できるか
5. カテゴリーフィルタで正しくフィルタリングされるか
6. レスポンシブデザインが正しく機能するか（スマートフォン、タブレット、デスクトップ）

以上のガイドラインに従うことで、一貫性のあるデザインと使いやすいユーザーエクスペリエンスを維持できます。