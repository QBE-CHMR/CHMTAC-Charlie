# CHMTAC (Civilian Harm Mitigation Tactical) Preproduction Release Charlie

CHMTAC is a multi-service application designed to manage reports, analyze data, and provide tools for mitigating civilian harm. This project consists of several microservices, including frontend applications, backend services, and supporting infrastructure.

---

## **Table of Contents**
- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## **Overview**
CHMTAC is built to streamline the process of reporting, managing, and analyzing civilian harm incidents. It includes:
- A frontend for submitting and managing reports.
- A backend for processing and storing data.
- Redis for caching and session management.
- Docker Compose for local development.

---

## **Architecture**
![CHMTAC Charlie Architecture](https://github.com/user-attachments/assets/ada952d6-49c0-4a4c-b967-335f2dcfbcf0)

The project is composed of the following services:
1. **Frontend (`chmr-intake-web`)**:
   - A React-based application for submitting reports.
   - Runs on port `3000`.

2. **Report Manager (`chmr-dmz-maint`)**:
   - A React-based application for managing reports.
   - Runs on port `3001`.

3. **Backend (`chmr-dmz-dal`)**:
   - A Node.js/Express service for handling API requests and interacting with the database.
   - Runs on port `5000`.

4. **Redis**:
   - Used for caching and session management.
   - Runs on port `6379`.

---

## **Services**
### **Frontend (`chmr-intake-web`)**
- Location: `./chmr-intake-web`
- Purpose: Allows users to submit reports of suspected civilian harm.

### **Report Manager (`chmr-dmz-maint`)**
- Location: `./chmr-dmz-maint`
- Purpose: Provides tools for managing and reviewing submitted reports.

### **Backend (`chmr-dmz-dal`)**
- Location: `./chmr-dmz-dal`
- Purpose: Processes API requests, stores data, and handles business logic.
- Includes security libraries.

### **Redis**
- Purpose: Currently holds list of submitted reports.

---

## **Setup and Installation**

### **Prerequisites**
- Docker and Docker Compose installed on your machine.
- Node.js (for local development of individual services).

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/CHMTAC.git
   cd CHMTAC

2. Start all services using Docker Compose:
   ```bash
   docker-compose up --build -d

3. Access the services:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Report Manager**: [http://localhost:3001](http://localhost:3001)
   - **Backend**: [http://localhost:5000](http://localhost:5000)

---

## **Usage**

### **Submitting a Report**
1. Navigate to the frontend (`chmr-intake-web`) at [http://localhost:3000](http://localhost:3000).
2. Fill out the report form and submit it.

### **Managing Reports**
1. Navigate to the report manager (`chmr-dmz-maint`) at [http://localhost:3001](http://localhost:3001).
2. Use the filters and sorting options to manage reports.

---

## **Environment Variables**
The following environment variables are used in the project:

### **Frontend (`chmr-intake-web`)**
- `REACT_APP_CONTACT_TYPE`: Choose which form contact info to include (DOD or CIVILIAN).
- `REACT_APP_API_BASE_URL`: Base URL for the backend API.

### **Report Manager (`chmr-dmz-maint`)**
- `REACT_APP_API_BASE_URL`: Base URL for the backend API.

### **Backend (`chmr-dmz-dal`)**
- `REDIS_URL`: URL for the Redis instance (e.g., `redis://my-redis:6379`).
- `NODE_ENV`: Set to `production` or `development`.


