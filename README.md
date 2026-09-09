# Prize Bond Draw System

A comprehensive, role-based Web Application designed to check and manage Bangladeshi Prize Bond draw results efficiently and securely. The project features an intuitive frontend interface, robust backend API protection, bulk bond checking via file upload, and fine-grained administrative user management.

---

## 🚀 Key Features

### 🔒 Access Control & Security
- **Authentication & Authorization Required:** Public browsing is completely restricted. Pages like Home, Draw Archive, and Draw Detail are locked for unauthenticated users.
- **Approval Workflow:** Newly registered users receive an *"Awaiting Approval"* notification until an administrator grants appropriate permissions.
- **Complete API Protection:** Security is enforced at both the Frontend UI and Backend API levels. Direct API access (e.g., via `curl` or Postman) without valid authentication tokens/permissions is blocked.

### 🔍 Prize Bond Checking & Dashboard
- **Single Search:** Easily check single prize bond numbers to see if they match winning draws.
- **Bulk Upload & Checking:** Import CSV or Excel (`.xlsx`) files containing hundreds/thousands of bond numbers for instant automated matching.
- **Draw Archive & Details:** Browse through past prize bond draws and inspect detailed winning number distributions.

### ⚙️ Admin Management Panel
- **User Management:** View, approve, or reject user accounts.
- **Role & Permission Control:** Assign granular roles and control access privileges across the entire application.

---

## 📂 Repository Link

- **GitHub Repository:** [https://github.com/MahbubWebdev-git/prize-bond-draw.git](https://github.com/MahbubWebdev-git/prize-bond-draw.git)

---

## 🛠️ Tech Stack *(Adjust based on your project)*

- **Frontend:** HTML, CSS, JavaScript / React
- **Backend:** Node.js / Express / Laravel / Python
- **Database:** MongoDB / PostgreSQL / MySQL
- **Security:** JWT / Session Authentication & RBAC Middleware

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js / Python / PHP (depending on your stack)
- Git installed on your local machine
- Database instance running locally or on the cloud

### 2. Installation & Setup

```bash
# Clone the repository
git clone [https://github.com/MahbubWebdev-git/prize-bond-draw.git](https://github.com/MahbubWebdev-git/prize-bond-draw.git)

# Navigate into the project directory
cd prize-bond-draw

# Install dependencies (example for Node.js)
npm install

# Set up environment variables (.env)
# Create a .env file and add your database and auth credentials
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key

# Start the application
npm start

👥 Roles & Permissions Workflow
Guest User: Promoted to log in when attempting to access Home, Draw Archive, or Draw Detail.

Pending User: Sees an "Awaiting Approval" notice after registration until processed by an Admin.

Approved User / Admin: Accesses single/bulk bond checking, draw archives, and administrative control panels based on assigned roles.

📄 License
This project is licensed under the MIT License.