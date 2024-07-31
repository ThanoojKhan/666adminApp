import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Table from './components/Table'

function App() {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Routes>
            <Route path="/" element={<Table />} />
          </Routes>
        </Router>
      </React.Suspense>
    </div>
  )
}

export default App
