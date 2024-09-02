# Transactions Service

This project is a Node.js application using NestJS, connected to MongoDB and Redis. The following instructions will guide you on how to start, stop, and manage the services using the provided Makefile.

## Prerequisites

- Docker and Docker Compose installed on your system.
- Node.js and npm installed for running the application locally.

## Makefile Commands

### Start All Services

To start the application along with MongoDB and Redis in detached mode (running in the background), use:

```sh
make start-all
```

### Start Only Database Services

If you want to start only MongoDB and Redis, use the following command:

```sh
make start-db
```

### Start the App Locally with Containers for MongoDB and Redis

To run the application on your local host while MongoDB and Redis run in containers, use:

```sh
make start-host-app
```

This will start MongoDB and Redis in containers and run the Node.js application locally, using the environment variables from `.env.local`.

### Stop All Services

To stop all running services (app, MongoDB, and Redis):

```sh
make stop-all
```

### Stop Only Database Services

To stop only the MongoDB and Redis services:

```sh
make stop-db
```

### Clean Up Docker Containers, Networks, and Volumes

To clean up and remove all containers, networks, and volumes created by Docker Compose:

```sh
make clean-up
```

### Run the App Locally for Development

For local development, you can run the NestJS application on your host machine while connecting to MongoDB and Redis containers:

```sh
make run-local-app
```

This will run the app in development mode with the specified environment variables.

### Build and Start All Services in Containers

To build the Docker images and start the application along with MongoDB and Redis in containers:

```sh
make build-and-start
```

### View Logs of All Running Services

To view logs for all running services:

```sh
make view-logs
```

### View Logs of a Specific Service

To view logs of a specific service (e.g., the app service), use:

```sh
make view-logs-service SERVICE=app
```

Replace `app` with `mongo` or `redis` to view logs for those services instead.

## Additional Information

- The application is designed to work seamlessly with Docker for easy setup and management.
- Make sure Docker is running before executing any of the `make` commands that involve Docker Compose.
