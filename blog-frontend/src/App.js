import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import AdminPanel from './pages/AdminPanel';
import EditorPanel from './pages/EditorPanel';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import { getVisitorToken } from './utils/tokenUtil';
import { AuthProvider } from './contexts/AuthContext';

function App() {
    useEffect(() => {
        // Sayfa yüklendiğinde otomatik token oluştur
        getVisitorToken();
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<BlogList />} />
                            <Route path="/blog/:id" element={<BlogDetail />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            
                            <Route 
                                path="/panel" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminPanel />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/editor" 
                                element={
                                    <ProtectedRoute allowedRoles={['editor']}>
                                        <EditorPanel />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
