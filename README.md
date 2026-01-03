# SyncHR - Employee Management System

## Getting Started

## to register as Admin/HR please visit /auth/admin/signup page

Follow these steps to set up and run the project locally.


### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (Ensure your database server is running)

### Installation

## to register as Admin/HR please visit /auth/admin/signup page

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd saif-odoo-gcet26
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your database connection string and JWT secret:
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/synchr_db?schema=public"
    JWT_SECRET="your-secret-key-here"
    ```

4.  **Database Setup**
    Push the schema to your database and seed it with test data:
    ```bash
    npx prisma migrate dev --name init
    # The seed script should run automatically. If not, run:
    # npx prisma db seed
    ```

5.  **Run the Application**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

