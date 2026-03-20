const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "lab07secret";

// In-memory User Data Store (Reset on server restart)
const users = [
  {
    id: 1,
    name: "Super Admin",
    email: "super@lab.com",
    password: bcrypt.hashSync("super123", 10),
    role: "SUPER_ADMIN"
  }
];

// Helper: Find User by Email
const findUserByEmail = (email) => users.find(u => u.email === email);

// Helper: Find User by ID
const findUserById = (id) => users.find(u => u.id === parseInt(id));

// -----------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------

// Auth Middleware: Verify JWT Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

// RBAC Middleware: Check for specific roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Forbidden for your role." });
    }
    next();
  };
};

// -----------------------------------------------------------------------------
// Auth Endpoints
// -----------------------------------------------------------------------------

// POST /api/auth/register (Public)
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  
  if (findUserByEmail(email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role: "USER" // Default role
  };

  users.push(newUser);
  res.status(201).json({ message: "User registered successfully", user: { id: newUser.id, name, email, role: newUser.role } });
});

// POST /api/auth/login (Public)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  
  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// -----------------------------------------------------------------------------
// User Management Endpoints (Protected)
// -----------------------------------------------------------------------------

// GET /api/users/me (All Auth Users)
app.get("/api/users/me", authenticateToken, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// GET /api/users (ADMIN/SUPER_ADMIN)
app.get("/api/users", authenticateToken, authorizeRoles("ADMIN", "SUPER_ADMIN"), (req, res) => {
  if (req.user.role === "ADMIN") {
    // ADMIN can only see USERs
    return res.json(users.filter(u => u.role === "USER").map(({ password, ...rest }) => rest));
  }
  // SUPER_ADMIN sees all
  res.json(users.map(({ password, ...rest }) => rest));
});

// POST /api/users (ADMIN/SUPER_ADMIN)
app.post("/api/users", authenticateToken, authorizeRoles("ADMIN", "SUPER_ADMIN"), (req, res) => {
  const { name, email, password, role } = req.body;

  if (findUserByEmail(email)) return res.status(400).json({ message: "Email already taken" });

  // ADMIN can only create USERs
  if (req.user.role === "ADMIN" && role !== "USER") {
    return res.status(403).json({ message: "ADMIN can only create USER role accounts" });
  }

  // SUPER_ADMIN can create USER or ADMIN
  if (req.user.role === "SUPER_ADMIN" && !["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({ message: "Invalid role selection" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role: role || "USER"
  };

  users.push(newUser);
  res.status(201).json({ message: "User created by management", user: { id: newUser.id, name, email, role: newUser.role } });
});

// PATCH /api/users/:id/role (SUPER_ADMIN)
app.patch("/api/users/:id/role", authenticateToken, authorizeRoles("SUPER_ADMIN"), (req, res) => {
  const { role } = req.body;
  const user = findUserById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!["USER", "ADMIN", "SUPER_ADMIN"].includes(role)) return res.status(400).json({ message: "Invalid role" });

  user.role = role;
  res.json({ message: `Role updated for ${user.email} to ${role}`, user: { id: user.id, name: user.name, role: user.role } });
});

// DELETE /api/users/:id (ADMIN/SUPER_ADMIN)
app.delete("/api/users/:id", authenticateToken, authorizeRoles("ADMIN", "SUPER_ADMIN"), (req, res) => {
  const targetUser = findUserById(req.params.id);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  // ADMIN can only delete USERs
  if (req.user.role === "ADMIN" && targetUser.role !== "USER") {
    return res.status(403).json({ message: "ADMIN can only delete USER role accounts" });
  }

  // Prevent SUPER_ADMIN from deleting self
  if (targetUser.id === req.user.id) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  const index = users.findIndex(u => u.id === targetUser.id);
  users.splice(index, 1);
  res.json({ message: `User ${targetUser.email} deleted successfully` });
});

app.listen(PORT, () => console.log(`Lab 07 Backend running at http://localhost:${PORT}`));
