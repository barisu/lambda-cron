include .env

build: script/src/index.ts script/package.json
	if [ -d script/build ]; then\
		rm -rf script/build;\
	fi
	mkdir script/build
	./script/node_modules/.bin/tsc script/src/* --outDir script/build
	cp script/package.json script/build
	cd script/build && npm install --omit=dev
	if [ -d build.zip ]; then\
		rm -f build.zip;\
	fi
	cd script/build && zip -r ../../build.zip  *

init:
	aws cloudformation describe-stacks --stack-name $(FUNCTION_NAME)-bucket --stack-status-filter CREATE_COMPLETE >/dev/null 2>&1; \
	if [ $$? -ne "0" ]; then \
		aws cloudformation deploy \
		--template-file ./create-backet.yaml \
		--stack-name $(FUNCTION_NAME)-bucket  \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides BacketName=$(FUNCTION_NAME)-source-bucket; \
	fi

	aws s3 cp build.zip "s3://$(FUNCTION_NAME)-source-bucket"

	aws cloudformation describe-stacks --stack-name $(FUNCTION_NAME)-function --stack-status-filter CREATE_COMPLETE >/dev/null 2>&1; \
	if [ $$? -ne "0" ]; then \
		aws cloudformation deploy \
			--template-file ./create-lambda-function.yaml \
			--stack-name $(FUNCTION_NAME)-function  \
			--capabilities CAPABILITY_IAM \
			--parameter-overrides BacketName=$(FUNCTION_NAME)-source-bucket FunctionName=$(FUNCTION_NAME); \
	fi

deploy:
	aws s3 cp build.zip "s3://$(FUNCTION_NAME)-source-bucket"
	aws lambda update-function-code \
		--function-name $(FUNCTION_NAME) \
		--s3-bucket $(FUNCTION_NAME)-source-bucket \
		--s3-key build.zip 