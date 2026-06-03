import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AudioDetail } from './pages/AudioDetail';
import { Quiz } from './pages/Quiz';
import { Progress } from './pages/Progress';
import { AudioPlayer } from './components/AudioPlayer';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AudioProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/audio/:id" element={<AudioDetail />} />
                  <Route path="/quiz/:docId" element={<Quiz />} />
                  <Route path="/progress" element={<Progress />} />
                </Route>
              </Routes>
            </div>
            <AudioPlayer />
          </div>
        </AudioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
