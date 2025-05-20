# Barter-Buddy

"A free web app that connects users who wish to exchange knowledge"

User stories:

- A user can create an account with a profile that lists the skills they are willing to teach and their proficiency, and what they are looking to learn (optional).
- A user can view others users based on their skills and proficiency (or at random), and request to "connect".
- A user can see connect requests, which displays requester's offered skills, and choose to accept or decline the request.
- Connected users can send each-other messages once connected (simple messaging).
- Users should be able to disconnect (one-way).
- A user should be able to rate others (after being connected) (stretch).
- Users should be able to specify availability (stretch?).

## Setup

### The database

The included docker-compose file will run a Postgres database server. The
following command will start the docker container and database server:

```bash
docker compose up -d
```

If you want to absolutely, positively make sure that you don't have any
problems with previous docker containers, databases, etc, run the
following commands **before** running the command above.

```bash
# kill all running containers
docker kill $(docker ps -q)

# remove all artifacts for all stopped containers
docker system prune -af
```

To connect to the psql shell on the database server:

```bash
docker exec -it postgres_db psql -U postgres
```

Create a new database for this project:

```bash
postgres=# create database barterbuddy;
```

Connect to our database:

```bash
postgres=# \c barterbuddy
```

Load the database schema:

```bash
barterbuddy=# \i data/barterbuddy.sql;
```

### The FastAPI app (/backend)

Navigate to the /backend directory:

```bash
cd backend
```

This project requires these libraries:

- "fastapi[standard]"
- psycopg
- sqlalchemy

This command will run the FastAPI server:

```bash
fastapi dev main.py
```

### The React app (/frontend)

Navigate to the /frontend directory:

```bash
cd frontend
```

Install dependencies using the following command:

```bash
npm install
```

Once the dependencies are installed, you can start the development server using the following command:

```bash
npm run dev
```

You can now open your browser and go to http://localhost:5173 to see the app running!

In order to build the app for production, you can run the following command:

```bash
npm run build
```

Now you can run the app in production mode using the following command:

```bash
npm run preview
```

This will start a local server that serves the files in the dist folder, and you can open your browser and go to http://localhost:4173 to see the app running in production mode.

### Docs (/docs)

This folder includes:

- README.md : Initial app concept and user stories
- ERDs for key models and relationships
- Wireframes for how the app was initially meant to look
