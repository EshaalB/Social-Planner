import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import Content from './pages/Content'
import Assets from './pages/Assets'
import CalendarPage from './pages/Calendar'
import Settings from './pages/Settings'
// Import asset sub-pages
import Images from './pages/assets/Images'
import Videos from './pages/assets/Videos'
import Captions from './pages/assets/Captions'
import Hashtags from './pages/assets/Hashtags'
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
                  <Route path="/assets/images" element={<Images />} />
                  <Route path="/assets/videos" element={<Videos />} />
                  <Route path="/assets/captions" element={<Captions />} />
                  <Route path="/assets/hashtags" element={<Hashtags />} />
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
