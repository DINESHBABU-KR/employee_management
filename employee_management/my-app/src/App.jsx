import Dashboard from './pages/dashboard.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'

function App() {
  const path = window.location.pathname

  if (path === '/dashboard') {
    return <Dashboard />
  }

  if (path === '/register') {
    return <Register />
  }

  return <Login />
}

export default App
