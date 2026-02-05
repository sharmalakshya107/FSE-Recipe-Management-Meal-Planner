# Recipe & Meal Planner

A comprehensive platform for managing recipes, planning weekly meals, and automating grocery shopping.

## Key Features

### 🔐 Authentication & Profile

- Email-based registration and login.
- Social Authentication via Google and GitHub.
- Token-based session management with persistence.
- User profile management (Profile pictures, account details).

### 🏠 Household Management

- Create and manage shared households.
- Invite members via unique secure codes.
- Real-time synchronization of recipes and meal plans across household members.

### 🍱 Recipe Management

- Full CRUD operations for personal and shared recipes.
- Automatic nutrition calculation using the USDA FoodData Central API.
- Import recipes directly from external URLs.
- Dynamic recipe scaling (adjust servings on the fly).
- Public and private recipe sharing options.

### 📅 Meal Planning

- Weekly meal planner with configurable slots (Breakfast, Lunch, Dinner, Snacks).
- Drag-and-drop recipe organization.
- Automated pantry/inventory tracking.

### 🛒 Shopping List

- Auto-generate shopping lists based on your weekly meal plans.
- Intelligent inventory reconciliation (subtracts items you already have).
- Categorized lists for easier shopping.

---

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- USDA API Key ([Get one here](https://fdc.nal.usda.gov/api-key-signup.html))

### Installation

1. **Clone and Install Dependencies**

   ```bash
   npm install
   ```

2. **Backend Configuration**
   Create a `.env` file in the `backend/` directory:

   ```env
   # Server Settings
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/recipe-planner

   # Security
   ACCESS_TOKEN_SECRET=your_secret_key
   REFRESH_TOKEN_SECRET=your_refresh_secret

   # OAuth (Optional)
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...

   # Nutrition API
   USDA_API_KEY=your_usda_api_key
   USDA_API_URL=https://api.nal.usda.gov/fdc/v1
   ```

3. **Frontend Configuration**
   Create a `.env` file in the `frontend/` directory:

   ```env
   VITE_API_BASE_URL=/api/v1
   VITE_API_URL=http://localhost:3000/api/v1
   ```

4. **Running the Application**
   From the root directory:
   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

## Development

- `npm run build`: Build all workspaces (Shared, Backend, Frontend).
- `npm run lint`: Run linting across the project.
