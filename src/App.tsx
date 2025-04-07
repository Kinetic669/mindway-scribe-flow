import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import DemoSession from './pages/DemoSession';
import SessionPrep from './pages/SessionPrep';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import { Tools } from './pages/Tools';
import { LandingPage } from './pages/LandingPage';
import './styles/globals.css';
import './styles/timeline.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/session" element={<DemoSession />} />
        <Route path="/session/prep" element={<SessionPrep />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/tools" element={<Tools />} />
      </Routes>
    </Router>
  );
}

export default App;

