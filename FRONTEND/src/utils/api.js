export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        // Token might be expired or invalid
        // In a real app, you might want to redirect to login or refresh token
        console.warn('Unauthorized request:', url);
    }

    return response;
};
