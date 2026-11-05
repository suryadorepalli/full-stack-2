// Create a fake JWT token
export const generateJWT = (user) => {
  const payload = { id: user.id, username: user.username, role: user.role, name: user.name, iat: Date.now(), exp: Date.now() + 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
};
export const decodeJWT = (token) => { try { return JSON.parse(atob(token)); } catch (error) { console.error("Invalid Token:", error); return null; } };
export const isJWTExpired = (token) => { const payload = decodeJWT(token); if (!payload) return true; return Date.now() > payload.exp; };
export const getTokenExpiry = (token) => { const payload = decodeJWT(token); return payload ? new Date(payload.exp) : null; };
export const getRemainingTime = (token) => { const payload = decodeJWT(token); if (!payload) return 0; const remaining = payload.exp - Date.now(); return remaining > 0 ? remaining : 0; };
export const validateJWT = (token) => { if (!token) return false; const payload = decodeJWT(token); if (!payload) return false; return !isJWTExpired(token); };
export const getRoleFromToken = (token) => decodeJWT(token)?.role || null;
export const getUsernameFromToken = (token) => decodeJWT(token)?.username || null;
export const getUserIdFromToken = (token) => decodeJWT(token)?.id || null;
export default { generateJWT, decodeJWT, isJWTExpired, getTokenExpiry, getRemainingTime, validateJWT, getRoleFromToken, getUsernameFromToken, getUserIdFromToken };
