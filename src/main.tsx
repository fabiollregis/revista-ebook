
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createAdminUser } from './utils/create-admin-user';

// Create admin user when the application first loads
// This is a development convenience for having the admin user always available
createAdminUser().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
