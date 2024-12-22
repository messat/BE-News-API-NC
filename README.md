
# Northcoders (NC) News API - Back-End

## **Project Overview**

The **NC News API** is a fully functional back-end server to power a news platform. This API allows users to interact with database of articles, topics, comments, and users. The server is built using **Node.js** and **Express**, with data stored in a **PostgreSQL** database. It follows RESTful API principles and has been thoroughly tested to ensure reliability.

This project has been completed and deployed successfully, providing the foundation for seamless front-end integration. The hosted API is live and accessible at:
[https://be-news-api-server.onrender.com/api](https://be-news-api-server.onrender.com/api)

---

## **Key Features**

- **Articles Management**:
  - Fetch articles with options to filter by topic, sort by various fields (e.g., author, date).
  - Submit new articles via POST requests.
  - Update articles using PATCH requests.
- **Comments Handling**:
  - Fetch comments for a specific article.
  - Add new comments or delete existing ones.
- **Topics and Users**:
  - Retrieve all topics.
  - Manage users and their interactions with articles and comments.
- **Error Handling**:
  - User-friendly error messages for invalid requests.
- **Optimized Queries**:
  - Pagination and sorting ensure efficient responses, even with large datasets.

---

## **Getting Started**

Follow these steps to run the project locally or interact with the live API.

### **Run the Project Locally**

#### 1. **Clone the Repository**
   ```bash
   git clone https://github.com/messat/BE-News-API-NC
   cd BE-News-API-NC
   ```

#### 2. **Install Dependencies**
   ```bash
   npm install
   ```

#### 3. **Setup Databases**
   - Create two `.env` files in the root directory:
     - `.env.test`:
       ```bash
       PGDATABASE=[YOUR_TEST_DATABASE_NAME]
       ```
     - `.env.development`:
       ```bash
       PGDATABASE=[YOUR_DEVELOPMENT_DATABASE_NAME]
       ```
   - Seed the database:
     ```bash
     npm run seed
     ```

#### 4. **Run Tests**
   - Use **Jest** and **Supertest** to run tests:
     ```bash
     npm run test
     ```

#### 5. **Start the Server**
   - Ensure **Node.js** and **PostgreSQL** are installed.
   - Run the application:
     ```bash
     npm start
     ```

---


## **API Documentation**

### Endpoints Overview
- **GET /api/articles**: Fetch all articles with optional queries for sorting, filtering, and pagination.
- **POST /api/articles**: Add a new article.
- **GET /api/topics**: Fetch all available topics.
- **PATCH /api/articles/:article_id**: Update an article by ID.
- **DELETE /api/comments/:comment_id**: Delete a comment by ID.

---

## **Technologies Used**

- **Node.js**: Back-end runtime environment.
- **Express.js**: Framework for building the API.
- **PostgreSQL**: Relational database system.
- **Jest & Supertest**: Testing frameworks for unit and integration tests.
- **Render**: Hosting platform for deployment.

