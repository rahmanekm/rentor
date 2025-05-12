# Room Rental Platform

This is a full-stack web application designed to facilitate room rentals, allowing landlords to list rooms and tenants to search and apply for them.

## Project Structure

-   `/database`: Contains SQL scripts for database schema (`schema.sql`) and sample data (`sample_data.sql`).
-   `/backend`: Contains the Node.js (Express.js) backend API.
-   `/frontend`: Contains the React (Vite) frontend application.

## Technology Stack

-   **Frontend**: React, Vite, Axios, React Router DOM, React-Bootstrap
-   **Backend**: Node.js, Express.js, MySQL2, JWT, bcryptjs, dotenv, cors, multer
-   **Database**: MySQL

## Features Implemented

-   **User Management**:
    -   User registration (Landlord/Tenant) with distinct profiles.
    -   Secure login with JWT authentication.
    -   User profile viewing and updating (including profile pictures, bio, flatmate preferences).
-   **Room Listing Management (Landlord)**:
    -   Create detailed room listings (title, description, address, room type, rent, deposit, availability, amenities, multiple images, lease terms, policies).
    -   View, edit, and delete own room listings.
    -   Manage listing status (Available, Rented, Pending).
-   **Room Search and Discovery (Tenant/Public)**:
    -   Search listings by location (city, address), price range, room type, availability, amenities.
    -   Filter and sort search results.
    -   View detailed room information including images, amenities, and landlord contact (via messaging).
    -   Pagination for search results.
-   **Flatmate Search (Tenant/Public)**:
    -   Tenants can list their profile as "actively looking for a room/flatmate".
    -   Search for flatmates based on location preference, budget, move-in date.
    -   View flatmate profiles.
    -   Pagination for search results.
-   **Messaging System**:
    -   Authenticated users can send direct messages to each other (e.g., tenant to landlord, user to flatmate seeker).
    -   View a list of personal conversations with last message preview and unread count.
    -   View full message history within a conversation.
    -   Unread message count notification badge in Navbar.
-   **Static Content Pages**:
    -   Advice page.
    -   Blog page (listing posts).
    -   Individual blog post detail page.
-   **User Interface & Experience**:
    -   Responsive design for mobile-friendliness.
    -   Clear navigation and intuitive user flows.
    -   Toast notifications for user feedback.
    -   Conditional UI elements based on user authentication and type.

*(Note: Application and Favorites features from the original requirements are also substantially covered by the messaging and general listing interactions, though a formal "application" object separate from messages was not explicitly built out in this iteration.)*

## Setup and Installation

### Prerequisites

-   Node.js (v16 or later recommended)
-   npm (or yarn)
-   MySQL Server (See Step 1 below for installation notes)

### 1. Database Setup

**Step 1: Install MySQL Server (if not already installed)**

*   If you don't have MySQL Server installed on your system, you'll need to install it first.
*   **Windows & macOS:** Download the MySQL Community Server installer from the official website: [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
*   **Linux (Ubuntu/Debian):** You can typically install it using the package manager:
    ```bash
    sudo apt update
    sudo apt install mysql-server
    ```
*   **Linux (Fedora/CentOS/RHEL):**
    ```bash
    sudo dnf install mysql-community-server 
    # or sudo yum install mysql-community-server
    ```
*   After installation, ensure the MySQL service is started and running. You might also want to run `mysql_secure_installation` (on Linux) to set a root password and secure your installation.

**Step 2: Create the Database**

1.  Connect to your MySQL server as a user with privileges to create databases (e.g., the `root` user or another admin user). You can use a command-line client or a GUI tool like MySQL Workbench or DBeaver.
    *   Using the `mysql` command-line client:
        ```bash
        mysql -u root -p
        ```
        (Enter your MySQL root password when prompted.)

2.  Once connected, create the database. We'll use `room_rental_db` as the example name (you can change this, but remember to update your `.env` file for the backend).
    ```sql
    CREATE DATABASE room_rental_db;
    ```
3.  (Optional but Recommended) Create a dedicated MySQL user for this application and grant it privileges on the `room_rental_db` database. Replace `your_app_user` and `your_strong_password` with your desired credentials.
    ```sql
    CREATE USER 'your_app_user'@'localhost' IDENTIFIED BY 'your_strong_password';
    GRANT ALL PRIVILEGES ON room_rental_db.* TO 'your_app_user'@'localhost';
    FLUSH PRIVILEGES;
    ```
4.  Exit the MySQL client if you used the command line:
    ```sql
    EXIT;
    ```

**Step 3: Create Database Schema (Tables)**

1.  Navigate to the root directory of this project in your terminal if you're not already there.
2.  Use the MySQL command-line client to execute the `database/schema.sql` script. This script contains the `CREATE TABLE` statements.
    *   Replace `your_app_user` with the user you created (or `root` if you skipped that step) and `room_rental_db` with your database name.
    ```bash
    mysql -u your_app_user -p room_rental_db < database/schema.sql
    ```
    (Enter the password for `your_app_user` when prompted.)

**Step 4: (Optional) Populate with Sample Data**

1.  If you want to add some initial sample data for testing, execute the `database/sample_data.sql` script:
    ```bash
    mysql -u your_app_user -p room_rental_db < database/sample_data.sql
    ```
    (Enter the password for `your_app_user` when prompted.)

Your database should now be set up and ready for the backend application to connect. Remember to configure the backend's `.env` file with the correct database name, user, and password.

### 2. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a `.env` file in the `backend` directory (you can copy `backend/.env.example` if it exists, or create one manually) and fill in your database credentials and JWT secret:
    ```env
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=room_rental_db
    PORT=5000
    JWT_SECRET=a_very_strong_and_secret_key_for_jwt_please_change_me
    # FRONTEND_URL=http://localhost:5500 # Or your Vite dev server port for CORS during development
    ```
    *   **Important**: Replace `JWT_SECRET` with a long, random, and strong secret key.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the backend server:
    ```bash
    npm run dev 
    ```
    This will typically start the server on `http://localhost:5000`.

### 3. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend 
    ```
    (If you are in the `backend` directory, use `cd ../frontend`)
2.  Create a `.env` file in the `frontend` directory and configure the backend URL:
    ```env
    VITE_BACKEND_URL=http://localhost:5000/api
    VITE_BACKEND_STATIC_URL=http://localhost:5000 
    ```
    *   `VITE_BACKEND_URL` is the base URL for your API calls.
    *   `VITE_BACKEND_STATIC_URL` is the base URL for serving static assets from the backend (like uploaded images).
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    This will typically start the frontend on `http://localhost:5500` (or another port if 5173, 3000, etc. are taken). The Vite dev server is configured to proxy API requests starting with `/api` to `http://localhost:5000` (see `frontend/vite.config.js`).

## API Documentation (Summary)

The backend provides RESTful APIs for various functionalities. Key endpoint groups include:

-   **/api/auth**: User registration and login.
-   **/api/users**: User profiles, flatmate search, (favorites were here, now part of user profile interactions).
-   **/api/listings**: CRUD operations for room listings, search, and filtering.
-   **/api/messages**: Sending and retrieving messages, managing conversations.
-   *(Applications were initially planned as separate; messaging now covers direct landlord-tenant communication regarding listings).*

Detailed API documentation (e.g., using Swagger/OpenAPI) is a future enhancement.

## Deployment to Production

Deploying this full-stack application to a production environment involves several steps for both the backend API and the frontend application. This guide provides a general overview of common deployment strategies.

### Prerequisites

-   **Production Server:** A virtual private server (VPS), cloud instance (e.g., AWS EC2, Google Cloud VM, Azure VM), or a Platform-as-a-Service (PaaS) that supports Node.js and static site hosting.
-   **Node.js & npm/yarn:** Installed on your production server for the backend.
-   **MySQL Database:** A production-ready MySQL database (this could be self-hosted on your server, or a managed database service like AWS RDS, Google Cloud SQL, etc.).
-   **Domain Name:** Registered and configured to point to your server's IP address.
-   **SSL Certificate:** To serve your application over HTTPS (essential for security). Let's Encrypt provides free certificates.
-   **Process Manager (for backend):** Such as PM2, to keep your Node.js application running reliably.
-   **Web Server/Reverse Proxy (optional but recommended):** Such as Nginx or Apache, to serve static frontend files, manage SSL, and proxy requests to your backend API.

### 1. Backend API Deployment

1.  **Clone Repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>/backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install --production
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `backend` directory. **Do not commit this file to version control.**
    ```env
    NODE_ENV=production
    PORT=5000 # Or your desired port for the backend API
    DB_HOST=your_production_db_host
    DB_USER=your_production_db_user
    DB_PASSWORD=your_production_db_password
    DB_NAME=your_production_db_name
    JWT_SECRET=generate_a_very_strong_random_secret_key_for_production # IMPORTANT: Use a strong, unique secret
    FRONTEND_URL=https://yourdomain.com # Set this to your production frontend URL for CORS
    ```
    *   Ensure `JWT_SECRET` is a long, random, and cryptographically strong string.

4.  **Database Setup:**
    *   Ensure your production MySQL database is set up and accessible from your server.
    *   Run the `database/schema.sql` script against your production database to create the necessary tables.
    *   **Do not run `sample_data.sql` on a live production database unless intended for initial setup.**

5.  **Start the Backend Application:**
    Use a process manager like PM2 for robustness:
    ```bash
    npm install -g pm2 # Install PM2 globally if not already installed
    pm2 start server.js --name roomrentor-api 
    pm2 startup # To ensure PM2 restarts on server reboot (follow instructions)
    pm2 save
    ```

6.  **Configure Reverse Proxy (e.g., Nginx - Recommended):**
    *   Install Nginx.
    *   Configure Nginx as a reverse proxy to forward requests from your API domain (e.g., `api.yourdomain.com`) to your Node.js application (e.g., `http://localhost:5000`).
    *   Set up SSL using Let's Encrypt (Certbot).
    *   Ensure Nginx is configured to serve static files from `backend/public/uploads` if you want to serve uploaded images directly through the API domain (e.g., `https://api.yourdomain.com/uploads/...`). Alternatively, use a dedicated CDN or object storage for uploads.
    *   Example Nginx config for API (simplified):
        ```nginx
        server {
            listen 443 ssl http2;
            server_name api.yourdomain.com;

            # SSL Configuration (paths to your certs)
            ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
            # ... other SSL settings ...

            location / {
                proxy_pass http://localhost:5000; # Your backend app
                proxy_set_header Host $host;
                # ... other proxy headers ...
            }

            # If serving uploads directly via Nginx from backend
            location /uploads/ {
                alias /path/to/your-repository-name/backend/public/uploads/;
                expires 1M; # Cache control for images
                access_log off;
                add_header Cache-Control "public";
            }
        }
        # Also include a server block for port 80 to redirect to HTTPS.
        ```

### 2. Frontend Application Deployment

1.  **Navigate to Frontend Directory:**
    ```bash
    cd ../frontend 
    ```

2.  **Environment Variables:**
    Create a `.env.production` file in the `frontend` directory.
    ```env
    VITE_BACKEND_URL=https://api.yourdomain.com/api 
    VITE_BACKEND_STATIC_URL=https://api.yourdomain.com 
    ```
    *   Adjust URLs to match your deployed backend. If uploads are served from the same API domain under `/uploads/`, `VITE_BACKEND_STATIC_URL` would be `https://api.yourdomain.com`.

3.  **Build the Frontend:**
    ```bash
    npm install # Ensure all dependencies are present
    npm run build
    ```
    This creates a `frontend/dist` folder with static assets.

4.  **Serve the Frontend Static Assets:**

    *   **Option A: Using Nginx on the same server:**
        *   Configure Nginx to serve the `frontend/dist` directory for your main domain (e.g., `yourdomain.com`).
        *   Crucially, include a `try_files` directive to route all paths to `index.html` for client-side routing.
        *   Example Nginx config for frontend (simplified):
            ```nginx
            server {
                listen 443 ssl http2;
                server_name yourdomain.com www.yourdomain.com;

                # SSL Configuration
                ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
                ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
                # ... other SSL settings ...

                root /path/to/your-repository-name/frontend/dist;
                index index.html;

                location / {
                    try_files $uri $uri/ /index.html;
                }
            }
            # Also include a server block for port 80 to redirect to HTTPS.
            ```

    *   **Option B: Using a Static Hosting Platform (Netlify, Vercel, GitHub Pages, etc.):**
        *   Connect your Git repository.
        *   Build settings: command `npm run build` (or `cd frontend && npm run build` if building from root), publish directory `frontend/dist`.
        *   Set environment variables (`VITE_BACKEND_URL`, `VITE_BACKEND_STATIC_URL`) in the platform's UI.
        *   Configure rewrite/redirect rules for client-side routing (usually a single rule to serve `index.html` for all paths).

### 3. General Production Considerations

*   **HTTPS:** Enforce HTTPS for both frontend and backend.
*   **Database Security:** Use strong credentials, limit permissions, consider network restrictions.
*   **Regular Backups:** Implement database and potentially server backups.
*   **Monitoring & Logging:** Set up application and server monitoring.
*   **Security Updates:** Keep all software and dependencies updated.
*   **Firewall:** Configure server firewall (e.g., `ufw`).

This guide provides a general pathway. Specifics will depend on your chosen hosting solutions.

## Further Development (TODO)

- Implement Email Verification and "Forgot Password" functionality.
- Write comprehensive API documentation (e.g., using Swagger/OpenAPI).
- Add more robust error handling and validation across the application.
- Implement comprehensive unit and integration tests.
- Further enhance security measures (e.g., rate limiting, advanced input sanitization, review security headers).
- Consider real-time updates for messaging (e.g., using WebSockets).
