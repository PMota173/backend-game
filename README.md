# Hidden Question (Backend)

This repository hosts the backend services for a real-time multiplayer social deduction game designed for mobile devices. The backend is built to handle game logic, real-time communication, and data persistence, providing a robust and scalable foundation for an engaging gaming experience.

## 🎯 Project Overview

"Hidden Question" is a social deduction game where players answer a question while an impostor receives a slightly different question and tries to blend in during the discussion and voting phase. This backend is responsible for managing game states, player interactions, and ensuring seamless real-time communication between clients.

## ✨ Features


- **Real-time Game State Management:** Handles dynamic game states, including player roles, turns, and game progression.

- **Player Authentication & Authorization:** Securely manages user accounts and access control.

- **Real-time Communication:** Utilizes WebSockets for low-latency communication between the server and connected mobile clients.

- **Game Logic Implementation:** Enforces game rules, processes player actions, and determines game outcomes.

- **Data Persistence:** Stores game data, user profiles, and other relevant information.

- **Scalable Architecture:** Designed with a modular approach using NestJS to support future growth and increased player concurrency.

## 🛠️ Technologies Used

  - **TypeScript:** Primary language for robust and scalable backend development.
  - **NestJS:** A progressive Node.js framework for building efficient and scalable server-side applications.
  - **Docker:** For containerization, ensuring consistent development, testing, and deployment environments.
  - **Prisma:** A modern database toolkit (ORM) for efficient and type-safe database access.
  - **PostgreSQL:** As the relational database for data persistence.
  - **WebSockets:** For real-time, bidirectional communication.

## 🏗️ Architecture

The backend follows a modular, layered architecture, leveraging NestJS's capabilities for dependency injection and clear separation of concerns. Key architectural considerations include:

  - **Monorepo Structure:** The backend is part of a larger project, with a clear separation of concerns between frontend and backend.
  - **API-driven:** Provides a RESTful API for standard client-server interactions and WebSocket endpoints for real-time game updates.
  - **Database Abstraction with Prisma:** Prisma ORM is used to interact with the database, providing a type-safe query builder and simplifying database migrations and schema management. This abstracts away direct SQL commands, allowing for more efficient and less error-prone data operations.
  - **Containerized Deployment:** Docker is used to package the application and its dependencies, ensuring portability and ease of deployment across different environments.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

  - [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
  - [npm](https://www.npmjs.com/get-npm)
  - [Docker](https://www.docker.com/get-started)
  - [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/PMota173/backend-game.git
    cd backend-game
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root of the project based on `.env.example`. For example:

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/hidden_question_db"
    # Add other environment variables as needed (e.g., JWT secrets, API keys)
    ```

3.  **Build and run the Docker containers:**
    This will build the Docker images, set up the database (PostgreSQL), and start the backend service.

    ```bash
    docker-compose up --build
    ```

4.  **Run database migrations (if any):**
    If you have Prisma migrations, you'll need to apply them to your database. You can run this command from inside the backend service container or directly if you have Prisma CLI installed globally.

    ```bash
    # From inside the backend-game container (e.g., after docker-compose up)
    docker exec -it <backend-service-container-name> npx prisma migrate dev --name init
    # Or if you have Prisma CLI installed globally and your .env is configured
    npx prisma migrate dev --name init
    ```

## 🤝 Contributing

Contributions are welcome\! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For any questions or inquiries, please reach out to [Pedro Mota](https://github.com/PMota173).
