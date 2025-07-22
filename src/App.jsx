import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import Content from './pages/Content'
import Assets from './pages/Assets'
import CalendarPage from './pages/Calendar'
import Settings from './pages/Settings'
import ErrorBoundary from './components/ErrorBoundary'
import React, { Suspense } from 'react'
const loading = false;
function App() {
  return (
    <>
      {loading ? <div>Loading...</div> : (
        <Router>
          <ErrorBoundary>
            <Suspense fallback={<div>Loading page...</div>}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/content" element={<Content />} />
                  <Route path="/assets" element={<Assets />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </Suspense>
          </ErrorBoundary>
        </Router>
      )}
    </>
  )
}

export default App
