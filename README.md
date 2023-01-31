# Lambdaで定期実行用のスクリプトを作成する

## 初期手順

1. `script/src`直下に書きたいコードを書く
2. .envファイルにで環境変数を設定する。その他のLambdaと関数名が被らないように注意すること
3. `make init`
4. `make build`

## 更新手順

1. `make build`
2. `make deploy`
