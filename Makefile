.PHONY: start-dev

start:
	npm run start

start-dev:
	npm run start:dev

start-prod:
	npm run start:prod

docker-build:
	sudo docker compose build

docker-run:
	sudo docker compose up

docker-down:
	sudo docker compose down

.DEFAULT_GOAL := start-dev