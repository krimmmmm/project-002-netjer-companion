import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'white',
        color: 'red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '50px',
        fontWeight: 'bold'
      }}
    >
      NETJER WORKING
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
