import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout';
import Home from './pages/home/Home';
import About from './pages/about/About';
import PredictionForm from './prediction/PredictionForm'; // Make sure this matches exactly
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme(); // This creates a default Material-UI theme

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/prediction" element={<PredictionForm />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;