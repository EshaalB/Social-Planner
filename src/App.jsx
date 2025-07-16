import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import Content from './pages/Content'
const loading = false;
function App() {
  return (
    <>
      {loading ? <div>Loading...</div> : (
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/content" element={<Content />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </>
  )
}

export default App
