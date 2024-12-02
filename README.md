Youth Media 24 News Portal

A modern news portal built with Next.js, Express.js, and MongoDB.

## Prerequisites

Before running this project, make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running backend locally)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local database)

## Quick Start

1. Start your local backend server and MongoDB first

2. Clone the frontend repository:

```bash
git clone <your-frontend-repo-url>
cd youth-media-24-fe
```

3. Create a `.env` file in the frontend directory:

```env
# For local development without Docker
NEXT_PUBLIC_API_URL=http://localhost:1337

# For Docker environment (will be overridden by docker-compose.yml)
# NEXT_PUBLIC_API_URL=http://host.docker.internal:1337
```

4. Build and run the frontend using Docker:

```bash
# For Linux users
docker-compose up --build

# For Windows/Mac users (if the above doesn't work)
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:1337 (your local backend)

## Development

To run the frontend in development mode (without Docker):

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## Docker Commands

Common Docker commands for managing the frontend:

```bash
# Start the frontend
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop the frontend
docker-compose down

# Remove unused images
docker system prune

# Restart the container
docker-compose restart

# View running containers
docker ps
# View logs
docker-compose logs -f

# Rebuild the frontend
docker-compose up --build

# If you encounter any issues, try cleaning Docker cache
docker system prune -a
docker-compose build --no-cache
```

## CI/CD Status
This project is configured with GitHub Actions for CI/CD and automatically deploys to Vercel.

## Troubleshooting

1. If the frontend can't connect to the backend:

   - Ensure your backend server is running on port 1337
   - Check if the NEXT_PUBLIC_API_URL in .env matches your backend URL
   - For Docker: Make sure host.docker.internal resolves correctly
   - Verify that your backend allows CORS requests from the frontend

2. For Docker permission issues:

   - Run Docker commands with sudo (Linux)
   - Ensure Docker Desktop is running (Windows/Mac)

3. For platform-specific issues:
   - On M1/M2 Macs: Use DOCKER_DEFAULT_PLATFORM=linux/amd64
   - On Windows: Ensure WSL2 is properly configured
   - On Linux: Make sure docker and docker-compose are up to date

## Project Structure

```
youth-media-24/
├── frontend/                # Next.js frontend application
│   ├── src/                # Source code
│   ├── public/             # Static files
│   └── Dockerfile         # Frontend Docker configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
