import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TemplateDashboard from './components/Template/TemplateDashboard';
import TemplatesReview from './components/Template/TemplatesReview';
import Layout from './Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TemplateDashboard />} />
          <Route path="/templates-review" element={<TemplatesReview />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
