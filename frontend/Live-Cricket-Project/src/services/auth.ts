import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust the API URL as needed

export const signIn = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signin`, { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Sign-in failed');
    }
};

export const signOut = () => {
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};