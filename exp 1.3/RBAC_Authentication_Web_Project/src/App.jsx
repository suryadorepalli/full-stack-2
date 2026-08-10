import { useMemo, useState } from 'react';
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

const DEMO_USERS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  editor: { username: 'editor', password: 'editor123', role: 'editor', name: 'Editor User' },
  viewer: { username: 'viewer', password: 'viewer123', role: 'viewer', name: 'Viewer User' },
};

const AUTH_KEY = 'rbac-demo-user';

function getStoredUser() {
  const raw = localStorage.getItem(AUTH_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

function App() {
  const [user, setUser] = useState(() => getStoredUser());

  const handleLogin = (credentials) => {
    const account = Object.values(DEMO_USERS).find(
      (candidate) =>
        candidate.username === credentials.username &&
        candidate.password === credentials.password
    );

    if (!account) {
      return {
        success: false,
        message: 'Invalid username or password. Please try again.',
      };
    }

    const userData = {
      username: account.username,
      role: account.role,
      name: account.name,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    setUser(userData);

    return { success: true, message: `Welcome, ${account.name}!` };
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Role-Based Access Control</h1>
          <p>Frontend authentication and authorization demo</p>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/editor">Editor</Link>
          <Link to="/viewer">Viewer</Link>

          {user ? (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
        </nav>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<LoginPage user={user} onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute user={user} allowedRoles={['admin', 'editor', 'viewer']} />}
          >
            <Route index element={<DashboardPage user={user} />} />
          </Route>
          <Route
            path="/admin"
            element={<ProtectedRoute user={user} allowedRoles={['admin']} />}
          >
            <Route index element={<AdminPage user={user} />} />
          </Route>
          <Route
            path="/editor"
            element={<ProtectedRoute user={user} allowedRoles={['admin', 'editor']} />}
          >
            <Route index element={<EditorPage user={user} />} />
          </Route>
          <Route
            path="/viewer"
            element={<ProtectedRoute user={user} allowedRoles={['admin', 'editor', 'viewer']} />}
          >
            <Route index element={<ViewerPage user={user} />} />
          </Route>
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}

function ProtectedRoute({ user, allowedRoles }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}

function HomePage({ user }) {
  return (
    <section className="card hero-card">
      <h2>{user ? `Welcome back, ${user.name}` : 'RBAC Demo'}</h2>
      <p>
        Sign in with a demo account to test role-based access control across protected routes.
      </p>

      <div className="demo-grid">
        <div className="demo-box admin">
          <strong>Admin</strong>
          <span>username: admin</span>
          <span>password: admin123</span>
        </div>
        <div className="demo-box editor">
          <strong>Editor</strong>
          <span>username: editor</span>
          <span>password: editor123</span>
        </div>
        <div className="demo-box viewer">
          <strong>Viewer</strong>
          <span>username: viewer</span>
          <span>password: viewer123</span>
        </div>
      </div>

      {!user && (
        <div className="cta-row">
          <Link to="/login" className="primary-button">
            Go to login
          </Link>
        </div>
      )}
    </section>
  );
}

function LoginPage({ user, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const fromPath = location.state?.from || '/dashboard';

  if (user) {
    return <Navigate to={fromPath} replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = onLogin(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(fromPath, { replace: true });
  };

  return (
    <section className="card auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username
          <input
            type="text"
            value={formData.username}
            onChange={(event) =>
              setFormData((current) => ({ ...current, username: event.target.value }))
            }
            placeholder="Enter username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={formData.password}
            onChange={(event) =>
              setFormData((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Enter password"
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="primary-button">
          Sign In
        </button>
      </form>
    </section>
  );
}

function DashboardPage({ user }) {
  const roleSummary = useMemo(() => {
    const summary = {
      admin: 'Full access to all app modules',
      editor: 'Can edit content and publish changes',
      viewer: 'Read-only access to the content library',
    };

    return summary[user?.role] || 'No role assigned';
  }, [user]);

  return (
    <section className="card">
      <h2>Dashboard</h2>
      <p>
        Signed in as <strong>{user?.name}</strong> with role <strong>{user?.role}</strong>.
      </p>
      <p>{roleSummary}</p>

      <div className="quick-links">
        <Link to="/admin" className="secondary-button">Admin page</Link>
        <Link to="/editor" className="secondary-button">Editor page</Link>
        <Link to="/viewer" className="secondary-button">Viewer page</Link>
      </div>
    </section>
  );
}

function AdminPage({ user }) {
  return (
    <section className="card">
      <h2>Admin Panel</h2>
      <p>Welcome {user?.name}. You can manage users, permissions, and system settings.</p>
      <ul className="feature-list">
        <li>Manage team roles</li>
        <li>Review audit logs</li>
        <li>Approve access requests</li>
      </ul>
    </section>
  );
}

function EditorPage({ user }) {
  return (
    <section className="card">
      <h2>Editor Workspace</h2>
      <p>Welcome {user?.name}. You can create and update content for the platform.</p>
      <ul className="feature-list">
        <li>Edit articles and posts</li>
        <li>Schedule publishing</li>
        <li>Review drafts</li>
      </ul>
    </section>
  );
}

function ViewerPage({ user }) {
  return (
    <section className="card">
      <h2>Viewer Portal</h2>
      <p>Welcome {user?.name}. You can read published content and reports.</p>
      <ul className="feature-list">
        <li>View reports</li>
        <li>Read published content</li>
        <li>Track recent updates</li>
      </ul>
    </section>
  );
}

function AccessDeniedPage() {
  return (
    <section className="card denied-card">
      <h2>Access denied</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/dashboard" className="primary-button">
        Return to dashboard
      </Link>
    </section>
  );
}

export default App;
