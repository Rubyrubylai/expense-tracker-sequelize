# 家庭記帳本
使用者可以新增、刪除、過濾及查看支出和收入的紀錄資訊，是管理財務的好幫手

## 環境
+ Node.js v10.15.0

## 安裝
1. 開啟終端機，cd到存放專案位置並執行:
```
git clone
```

2. 安裝套件
```
npm install
```

3. 在 https://developers.facebook.com/ 上創建一個專案

4. 在專案的根目錄新增.env檔，以存放第三方登入設定
```
FACEBOOK_ID=
FACEBOOK_SECRET=
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
```

5. 執行專案
```
npm run dev
```

6. 在本機端 http://localhost:3000 開啟網址

## 功能列表
+ 網站功能

|功能|URL|描述|
|----|---|----|
|首頁|/|查看當天的收入及支出，並從月份及類別選單篩選要查看的資料|
|新增|/incomes/new|點選右下角的加號，新增收入|
|新增|/records/new|點選右下角的加號，新增支出|
|編輯|/incomes/:id/edit|點選編輯按鈕，編輯收入的名稱、日期、類別及金額|
|編輯|/records/:id/edit|點選編輯按鈕，編輯支出的名稱、日期、類別及金額|

+ 使用者功能

|功能|URL|描述|
|----|---|----|
|登入|/users/login|使用者登入|
|登入|/auth/facebook|FB使用者登入|
|登出|/users/logout|登入後即可藉由右上角的登出按鈕登出|
|註冊|/users/register|填寫姓名、帳號及密碼註冊帳戶|