// API Configuration
const API_BASE = '/api';

// Global variables to store auth data
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// API Functions
class MedicineAPI {
    // Authentication
    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            
            if (response.ok) {
                // Save token and user data
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            return data;
        } catch (error) {
            return { message: 'Network error: ' + error.message };
        }
    }

    static async login(credentials) {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            
            if (response.ok) {
                // Save token and user data
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            return data;
        } catch (error) {
            return { message: 'Network error: ' + error.message };
        }
    }

    static logout() {
        authToken = null;
        currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    // Medicines
    static async getMedicines() {
        if (!authToken) {
            return { message: 'Not authenticated' };
        }

        try {
            const response = await fetch(`${API_BASE}/medicines`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 401) {
                this.logout();
                return { message: 'Session expired' };
            }
            
            return await response.json();
        } catch (error) {
            return { message: 'Network error: ' + error.message };
        }
    }

    static async addMedicine(medicineData) {
        if (!authToken) {
            return { message: 'Not authenticated' };
        }

        try {
            const response = await fetch(`${API_BASE}/medicines`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medicineData)
            });
            
            if (response.status === 401) {
                this.logout();
                return { message: 'Session expired' };
            }
            
            return await response.json();
        } catch (error) {
            return { message: 'Network error: ' + error.message };
        }
    }

    static async updateMedicineStatus(medicineId, status) {
        if (!authToken) {
            return { message: 'Not authenticated' };
        }

        try {
            const response = await fetch(`${API_BASE}/medicines/${medicineId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            if (response.status === 401) {
                this.logout();
                return { message: 'Session expired' };
            }
            
            return await response.json();
        } catch (error) {
            return { message: 'Network error: ' + error.message };
        }
    }

    static async deleteMedicine(medicineId) {
        if (!authToken) {
            return { message: 'Not authenticated' };
        }

        try {
            const response = await fetch(`${API_BASE}/medicines/${medicineId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.status === 401) {
                this.logout();
                return { message: 'Session expired' };
            }
            
            return await response.json();
        } catch (error) {
            return { message: 'Network error: ' + error.message };
        }
    }

    static async getHistory() {
        if (!authToken) {
            return { message: 'Not authenticated' };
        }

        try {
            const response = await fetch(`${API_BASE}/medicines/history`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 401) {
                this.logout();
                return { message: 'Session expired' };
            }
            
            return await response.json();
        } catch (error) {
            return { message: 'Network error: ' + error.message };
        }
    }
}

// Check if user is logged in
function isLoggedIn() {
    return !!authToken && !!currentUser;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Get auth token
function getAuthToken() {
    return authToken;
}