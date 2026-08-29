# 読書離脱率記録アプリ

読書中の面白さを記録し、全ユーザーの離脱率を可視化するWebアプリです。
作家や読者が「どのページで読むのをやめたか」を共有・分析できます。

## デモ

https://my-portfolio-orpin-beta-85.vercel.app

## 技術スタック

**フロントエンド**
- React + Vite
- Chakra UI
- Recharts
- Firebase Authentication（Googleログイン）
- React Router

**バックエンド**
- Node.js + Express
- MongoDB Atlas（Mongoose）
- Render（デプロイ）

**外部API**
- Google Books API

## 主な機能

- Googleアカウントでログイン
- タイトル・著者名で本を検索して追加
- 読書進捗と面白さ（5段階）を記録
- 途中でやめた・読了の記録
- 自分の記録グラフ表示
- 全ユーザーの記録グラフ表示
- 本ごとの離脱率統計表示
- レスポンシブデザイン（PC・スマホ対応）

## ローカル起動方法

### バックエンド
```bash
cd backend
npm install
node server.js
```

### フロントエンド
```bash
cd my-portfolio
npm install
npm run dev
```

## 環境変数

**フロントエンド（.env）**
```
VITE_GOOGLE_BOOKS_API_KEY=your_api_key
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**バックエンド（.env）**
```
MONGO_URI=your_mongodb_uri
PORT=3001
```