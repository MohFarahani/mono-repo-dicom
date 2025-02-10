# DICOM Viewer Application

This is a project with DICOM viewing capabilities, using MySQL for data storage.

## Project Structure
```
next/
├── public/               # Static files
├── python_env/          # Python environment and scripts
│   ├── requirements.txt
│   └── scripts/
│       └── python/
│           └── process_dicom.py
├── scripts/             # Setup and initialization scripts
│   ├── init-db.ts
│   └── start-db.sh
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── api/        # API routes
│   │   ├── page.tsx    # Root page
│   │   ├── home/
│   │   │   └── page.tsx
│   │   ├── preview/
│   │   │   └── multi/
│   │   │       └── page.tsx
│   │   └── ...
│   ├── components/     # React components
│   ├── db/            # Database configuration
│   ├── graphql/       # GraphQL schema and resolvers
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Utility functions
├── .env                # Environment variables (create this)
├── docker-compose.yml  # Docker composition
├── Dockerfile         # Docker build instructions
└── package.json       # Project dependencies
```

## Running with Docker

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Node.js 20.x or later
   - Python 3.x

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=db
   DB_PORT=3306
   DB_NAME=dicom_db
   DB_USER=dicom_user
   DB_PASS=dicom_password
   ```

3. **Start the Application**
   ```bash
   # Build and start all services
   docker-compose up -d

   # Initialize the database (first time only)
   yarn init-db
   ```

4. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Stop the Application**
   ```bash
   docker-compose down
   ```

## Development Without Docker

First, run the development server:

```bash
# Install dependencies
yarn install

# Start MySQL database
yarn start-db

# Run the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/material-ui/)
- [GraphQL Documentation](https://graphql.org/learn/)


