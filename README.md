# Healthcare demo application

## 1. Overview

- Nuxt, PWA, Firebase の学習用に作成したアプリケーションです。
  <br>
  https://hcdemoapp.web.app
- 健康管理アプリケーションをイメージしています

### 1. 食事管理

- カメラで食品を撮影すると、そのカロリーを AI が判定します。

<img src="capture/meal.png" width="200">

### 1.2 Excercise management

- ランニングした距離と時間を計測できます。
- ランニングで消費したカロリーと同量の食品を楽天から検索できます

<img src="capture/running.jpg" width="200">

### 1.3 Singin/Signout

- ユーザー/パスワードによるログイン以外に、Google と Github のアカウントでのログインも可能です

<img src="capture/login.png" width="200">

## 2. Architecure

<img src="capture/architect.jpg" width="400">

### 2.1 Frontend

- Nuxt/Vue2 の SPA として実装しています。

### 2.2 Backend

- Firebase の認証機能(Authentication)やデータストア(Firestore)を利用しています。
- 画像の物体検知は Google の VisionAPI を利用しています。
