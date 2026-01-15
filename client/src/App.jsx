import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Meeting from './pages/Meeting';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting/:code" element={<Meeting />} />
          <Route path="/dashboard/:code" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
