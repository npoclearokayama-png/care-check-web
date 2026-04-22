# いまの育児負担セルフチェック

ブラウザでそのまま開ける、公開用完成版の静的サイトです。
ビルド不要で、ローカル直開きと GitHub Pages の両方で動きます。

## できること
- 24問のセルフチェック
- 4領域の簡易スコア表示
- 総合メッセージ表示
- AI相談用テキストのコピー
- ChatGPT / Gemini への導線
- localStorage による途中保存
- 印刷対応
- about / privacy / help / 404 ページ

## すぐ試す
Zipを展開して `index.html` をブラウザで開くだけで動作します。

## GitHub Pages 公開手順
1. GitHub に新規リポジトリを作成
2. この中身をそのまま push
3. Settings > Pages で Build and deployment を GitHub Actions に設定
4. `main` ブランチに push
5. 公開URLを確認

## 調整ポイント
- 設問本文: `assets/questions.js`
- 採点・結果文: `assets/app.js`
- デザイン: `assets/styles.css`
- AI相談導線: `assets/app.js` と `help.html`
- サイト情報: `manifest.webmanifest`

## 注意
- これは診断ではありません
- 個人情報は収集しません
- 外部送信はしません
- 実相談が必要な場合は、地域の支援機関等につないでください
