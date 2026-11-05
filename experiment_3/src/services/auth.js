const users = [
  { id: 1, username: "admin", password: "admin123", role: "Admin", name: "Administrator" },
  { id: 2, username: "editor", password: "editor123", role: "Editor", name: "Editor User" },
  { id: 3, username: "viewer", password: "viewer123", role: "Viewer", name: "Viewer User" },
];
const generateToken = (user) => btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role, exp: Date.now() + 60 * 60 * 1000 }));
const generateRefreshToken = () => "refresh_" + Math.random().toString(36).substring(2) + Date.now();
export const loginUser = (username, password) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) { reject(new Error("Invalid username or password")); return; }
    resolve({ user: { id: user.id, username: user.username, role: user.role, name: user.name }, token: generateToken(user), refreshToken: generateRefreshToken() });
  }, 1000);
});
export const logoutUser = () => { localStorage.removeItem("user"); localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); };
export const refreshAccessToken = () => new Promise((resolve) => setTimeout(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) { resolve(null); return; }
  resolve(generateToken(user));
}, 500));
export const decodeToken = (token) => { try { return JSON.parse(atob(token)); } catch { return null; } };
export const isTokenExpired = (token) => { const decoded = decodeToken(token); if (!decoded) return true; return decoded.exp < Date.now(); };
export const getCurrentUser = () => { const user = localStorage.getItem("user"); return user ? JSON.parse(user) : null; };
