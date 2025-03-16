# GitHub Pages ホスティングガイド

このガイドでは、設計支援ツールポータルをGitHub Pagesを使ってホスティングする方法について説明します。GitHub Pagesは静的ウェブサイトをホスティングするための無料サービスです。

## 目次

- [GitHub Pages ホスティングガイド](#github-pages-ホスティングガイド)
  - [目次](#目次)
  - [前提条件](#前提条件)
  - [リポジトリのクローン](#リポジトリのクローン)
  - [ファイルの追加とコミット](#ファイルの追加とコミット)
  - [GitHub Pagesの有効化](#github-pagesの有効化)
  - [サイトの確認](#サイトの確認)
    - [インデックスファイル](#インデックスファイル)
  - [更新の方法](#更新の方法)
  - [トラブルシューティング](#トラブルシューティング)
    - [サイトが表示されない](#サイトが表示されない)
    - [404エラーが表示される](#404エラーが表示される)
    - [CSSやJavaScriptが適用されない](#cssやjavascriptが適用されない)
    - [カスタムドメインの設定](#カスタムドメインの設定)
  - [GitHub Actionsの活用（オプション）](#github-actionsの活用オプション)

## 前提条件

- GitHubアカウント
- Git（ローカル環境にインストール済み）
- 基本的なコマンドラインの知識

## リポジトリのクローン

既存のリポジトリからプロジェクトをクローンします：

```bash
git clone https://github.com/yuubae215/utility-tools.git
cd utility-tools
```

または、新しくリポジトリを作成する場合は、GitHubウェブサイトで新しいリポジトリを作成し、以下のコマンドを実行します：

```bash
git init
git remote add origin https://github.com/yuubae215/utility-tools.git
```

## ファイルの追加とコミット

1. ローカル環境でHTML、CSS、JavaScriptファイルを作成します。

2. ファイルをステージングエリアに追加します：

```bash
git add .
```

3. 変更をコミットします：

```bash
git commit -m "初期ファイルをアップロード"
```

4. 変更をリモートリポジトリにプッシュします：

```bash
git push -u origin main
```

注意: GitHubの新しいリポジトリではデフォルトのブランチ名が `main` になっています。古いリポジトリでは `master` かもしれません。

## GitHub Pagesの有効化

1. GitHubの該当リポジトリページにアクセスします（https://github.com/yuubae215/utility-tools）。

2. リポジトリページの上部にある「Settings」タブをクリックします。

3. 左側のサイドバーから「Pages」をクリックします。

4. 「Source」セクションで、ブランチとフォルダを選択します：
   - Branch: `main`（または `master`）
   - Folder: `/ (root)`

5. 「Save」ボタンをクリックします。

6. 設定が保存されると、GitHub Pagesのサイトが公開されるURLが表示されます：
   ```
   https://yuubae215.github.io/utility-tools/
   ```

## サイトの確認

GitHub Pagesの設定が完了すると、サイトが公開されるまで数分かかることがあります。「Your site is published at https://yuubae215.github.io/utility-tools/」というメッセージが表示されたら、そのリンクをクリックしてサイトを確認できます。

### インデックスファイル

GitHub Pagesは自動的に `index.html` ファイルをホームページとして表示します。リポジトリのルートディレクトリに `index.html` ファイルがあることを確認してください。

## 更新の方法

サイトを更新するには、ローカル環境でファイルを編集し、変更をコミットしてプッシュします：

```bash
# ファイルを編集した後
git add .
git commit -m "サイトを更新"
git push
```

変更がプッシュされると、GitHub Pagesは自動的にサイトを再構築します。更新が反映されるまで数分かかることがあります。

## トラブルシューティング

### サイトが表示されない

- GitHub Pagesの設定が正しく行われているか確認する
- `index.html` ファイルがリポジトリのルートにあるか確認する
- 数分待って再度アクセスしてみる

### 404エラーが表示される

- ファイルのパス・リンクが正しいか確認する
- ファイル名の大文字・小文字が正しいか確認する（GitHub Pagesは大文字・小文字を区別します）

### CSSやJavaScriptが適用されない

- リンクのパスが正しいか確認する
- 相対パスを使用していることを確認する
- ブラウザの開発者ツールでエラーを確認する

### カスタムドメインの設定

カスタムドメインを使用したい場合は、GitHub Pagesの設定ページで「Custom domain」セクションにドメイン名を入力し、DNSプロバイダーで適切なCNAMEレコードを設定します。

1. GitHub Pagesの設定ページで「Custom domain」フィールドにドメイン名を入力
2. 「Save」ボタンをクリック
3. DNSプロバイダーで以下のCNAMEレコードを追加：
   - 名前: `www`（またはサブドメイン）
   - 値: `yuubae215.github.io`

DNSの変更が伝播するまで最大24時間かかることがあります。

## GitHub Actionsの活用（オプション）

より高度な自動化が必要な場合は、GitHub Actionsを使用して自動デプロイを設定できます。以下は基本的な例です：

1. リポジトリのルートに `.github/workflows/deploy.yml` ファイルを作成します：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      # ビルドステップ（必要に応じて）
      # - name: Build
      #   run: npm ci && npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: .  # または 'build'（ビルドステップを使用する場合）
```

このワークフローは、`main` ブランチにプッシュされるたびに自動的に実行され、サイトをデプロイします。

---

以上のガイドに従って、設計支援ツールポータルをGitHub Pagesで公開することができます。何か問題がある場合は、GitHubの公式ドキュメントも参照してください。