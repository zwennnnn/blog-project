// Benzersiz token oluşturma
const generateToken = () => {
    return 'visitor_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
};

// Token kontrolü ve oluşturma
export const getVisitorToken = () => {
    let token = localStorage.getItem('visitorToken');
    
    if (!token) {
        token = generateToken();
        localStorage.setItem('visitorToken', token);
    }
    
    return token;
}; 