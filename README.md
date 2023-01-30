# Lambdaで定期実行用のスクリプトを作成する

## 手順

1. `index.ts`を書く
2. `./script/node_modules/.bin/tsc src/index.ts`として`script/src/index.js`を作成
3. `script/index.js`に移動
4. scripディレクトリに移動してzipファイルを作成する
5. `aws cloudformation deploy --template-file ./create-backet.yaml --stack-name ${STACK_NAME} --capabilities CAPABILITY_IAM --parameter-overrides BacketName=${BACKET_NAME}`を利用してバケットを作成する
6. `aws s3 cp build.zip s3://backet-name`としてs3にアップロードする
7. `aws cloudformation deploy --template-file create-lambda-function.yaml   --stack-name ${STACK_NAME}  --capabilities CAPABILITY_IAM --parameter-overrides BacketName=${BACKET_NAME} ObjName=${ObjName}`としてデプロイ
