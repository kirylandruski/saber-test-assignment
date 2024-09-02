# Start all services (app, mongo, redis) in detached mode
start-all:
	docker compose up -d

# Start only mongo and redis in detached mode
start-db:
	docker compose up -d mongo redis

# Start the app on the host, while mongo and redis are in containers
start-host-app:
	docker compose up -d mongo redis
	DOT_ENV_PATH=.env.local npm start

# Stop all running services
stop-all:
	docker compose stop

# Stop only the mongo and redis services
stop-db:
	docker compose stop mongo redis

# Clean up containers, networks, and volumes created by docker-compose
clean-up:
	docker compose down --volumes

# Run the NestJS app on the host, connecting to mongo and redis containers
run-local-app:
	NODE_ENV=development PORT=3000 REDIS_HOST=localhost REDIS_PORT=6379 MONGODB_URL=mongodb://saber:saber@localhost:27017 npm start

# Build and run everything in containers (app, mongo, redis)
build-and-start:
	docker compose up --build -d

# Show logs of all running services
view-logs:
	docker compose logs -f

# Show logs of a specific service (usage: make view-logs-service SERVICE=app)
view-logs-service:
	docker compose logs -f $(SERVICE)
