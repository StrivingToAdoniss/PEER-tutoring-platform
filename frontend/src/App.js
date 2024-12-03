import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LogIn from './pages/LogIn'; 
import SignUp from './pages/SignUp';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />  {/* Route for login */}
        <Route path="/signup" element={<SignUp />} />  {/* Route for SignUp */}
    </Routes>
    </Router>
  );
}

export default App;
