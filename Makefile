build: script/src/index.ts script/package.json
	if [ -d assets ]; then\
		rm -rf assets;\
	fi
	mkdir assets
	./script/node_modules/.bin/tsc script/src/* --outDir assets
	cp script/package.json assets
	cd assets && npm install --omit=dev

deploy:
	cd infra && npm run build
	cd infra && cdk deploy

destroy:
	cd infra && cdk destroy