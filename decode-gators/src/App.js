import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Login from './components/Login';
import Signup from './components/Signup';
import AuthDetails from './components/AuthDetails';
//import Header from './Header';
import AddHours from './AddHours';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginWithAuthDetails />} />
                    <Route path="/signup" element={<SignupWithAuthDetails />} />
                    <Route path="/addhours" element={<AddHours/>} />
                </Routes>
            </Router>
        </div>
    );
}

// Component for Login route with AuthDetails included
function LoginWithAuthDetails() {
    return (
        <>
            <Login />
            <AuthDetails />
        </>
    );
}

// Component for Signup route with AuthDetails included
function SignupWithAuthDetails() {
    return (
        <>
            <Signup />
            <AuthDetails />
        </>
    );
}

export default App;
