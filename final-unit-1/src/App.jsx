import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecommendationSearchPage from './pages/RecommendationSearchPage';
import Results from './pages/Results';
import AboutPage from './pages/AboutPage';
import Layout from './Layout';

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/RecommendationSearchPage" element={<RecommendationSearchPage />} />
          <Route path="/Results" element={<Results />} />
          <Route path="/AboutPage" element={<AboutPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
