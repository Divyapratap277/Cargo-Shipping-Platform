const API_URL = "http://localhost:5000/api";

// --- Helper to get token (used across all authenticated calls) ---
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// --- Generalized Fetch Function with Auth and Error Handling ---
const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Attach JWT for protected routes (Bearer Token)
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        // Ensure body is stringified if provided
        body: options.body ? JSON.stringify(options.body) : options.body,
    });
    
    // Handle 401 Unauthorized (Token expired/invalid) - Forces logout
    if (response.status === 401) {
        if(typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.assign('/'); 
        }
    }

    return response.json();
};


// --- AUTHENTICATION ENDPOINTS (No token needed) ---

export const registerUser = (userData) => 
    apiFetch('/auth/register', { method: 'POST', body: userData });

export const loginUser = (userData) => 
    apiFetch('/auth/login', { method: 'POST', body: userData });

// --- PROTECTED ENDPOINTS (Token required) ---

export const fetchUserProfile = () => 
    apiFetch('/auth'); // Uses GET /api/auth route

export const createCargoListing = (cargoData) => 
    apiFetch('/cargo', { method: 'POST', body: cargoData }); // Uses POST /api/cargo

export const fetchMyCargo = () => 
    apiFetch('/cargo'); // Uses GET /api/cargo

export const fetchAllAuctions = () => 
    apiFetch('/auctions'); // Uses GET /api/auctions

export const placeBidOnAuction = (auctionId, amount) => 
    apiFetch(`/auctions/${auctionId}/bids`, { method: 'POST', body: { amount } }); // Uses POST /api/auctions/:id/bids
