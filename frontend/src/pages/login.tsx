import { useState } from 'react';
import { loginUser } from '../../lib/api'; // Assuming correct path relative to src/pages
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { FormEvent, FC } from 'react'; // Import FormEvent and FC for TypeScript

// Explicitly define as a Functional Component (FC) and ensure it's the default export
const LoginPage: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => { // Use FormEvent type
        e.preventDefault();
        setError('');
        try {
            // Use the loginUser function from the API library
            const res = await loginUser({ email, password });

            // Check if the response includes a token and user details
            if (res.token && res.user) {
                // Store token and user details in localStorage
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));

                // Redirect based on userType after successful login
                if (res.user.userType === 'cargo_owner') {
                  router.push('/cargo'); // Redirect Cargo Owner
                } else if (res.user.userType === 'truck_owner') {
                  router.push('/truck'); // Redirect Truck Owner
                } else {
                  // Fallback redirection if userType is not recognized or missing
                  console.warn("User type not recognized, redirecting to home.");
                  router.push('/'); // Or perhaps a generic dashboard page
                }

            } else {
                // Handle login failure (e.g., invalid credentials)
                setError(res.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            // Handle network errors or other exceptions during the API call
            console.error("Login error:", err); // Log the actual error for debugging
            setError('An error occurred during login. Please try again later.');
        }
    };

    return (
        // Main container: Full height, dark background, center content using Flexbox
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            {/* Max width container with vertical spacing */}
            <div className="w-full max-w-md space-y-8">

                {/* Header Section */}
                <div className="text-center">
                    {/* Main Title */}
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        Cargo Platform
                    </h1>
                    {/* Subtitle */}
                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-300">
                        Sign in to your account
                    </h2>
                    {/* Link to Register */}
                    <p className="mt-2 text-sm text-gray-400">
                        Or{' '}
                        <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300 transition duration-150 ease-in-out underline underline-offset-2">
                            create a new account
                        </Link>
                    </p>
                </div>

                {/* Form Section - Card Styling */}
                <div className="bg-gray-800 py-8 px-6 shadow-xl rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Input Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Error Message Display */}
                        {error && (
                            <div className="rounded-md bg-red-900/40 p-3 ring-1 ring-inset ring-red-500/30">
                                <p className="text-sm font-medium text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer/Copyright (Optional) */}
                <p className="mt-8 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Cargo Platform. All rights reserved.
                </p>
            </div>
        </div>
    );
}

// Ensure the default export is LoginPage
export default LoginPage;