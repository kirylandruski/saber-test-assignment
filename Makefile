env-up:
	docker compose up -d

env-stop:
	docker compose stop

env-clean:
	docker compose down --volumes
