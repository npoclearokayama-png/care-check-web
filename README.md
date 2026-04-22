# いまの育児負担セルフチェック

育児中の保護者が、今の負担感を簡単に整理するためのセルフチェックWebアプリです。
このツールは診断ではなく、自己理解と相談のきっかけづくりを目的としています。
回答はブラウザ内で処理され、個人情報は収集しません。

## このツールについて
- 診断ではありません
- 回答は端末内で処理されます
- 個人情報は収集しません
- 相談が必要な場合は、地域の支援機関や信頼できる相談先につながってください

## 技術構成
- React
- TypeScript
- Vite
- React Router
- localStorage
- GitHub Pages
- GitHub Actions

## 開発手順
```bash
npm install
npm run dev
```

## ビルド
```bash
npm run build
npm run preview
```

## 公開手順
1. GitHub に `care-check-web` リポジトリを作成
2. 本プロジェクトを push
3. GitHub の Settings > Pages で Build and deployment を GitHub Actions に設定
4. `main` ブランチへの push で自動デプロイ
5. `vite.config.ts` の `base` を実際の公開パスに合わせて確認

## 設問や結果文の編集方法
- 設問: `src/data/questions.ts`
- 結果文: `src/data/resultRules.ts`
- 相談先リンク: `src/data/resources.ts`

## 注意
- これは医学的・心理学的診断を行うものではありません
- 結果が高く出た場合でも、それだけで何かが確定するものではありません
- 生活の維持が難しい、気持ちの落ち込みが強い、安全面の不安がある場合は、地域の医療・行政・支援機関等に早めにつながってください
