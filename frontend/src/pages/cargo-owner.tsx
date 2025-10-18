import { useState, useEffect } from 'react';
import { createCargoListing, fetchMyCargo } from '../../lib/api';

export default function CargoOwnerDashboard() {
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [error, setError] = useState('');
    const [myCargo, setMyCargo] = useState<any[]>([]);

    useEffect(() => {
        const loadMyCargo = async () => {
            try {
                const res = await fetchMyCargo();
                if (Array.isArray(res)) {
                    setMyCargo(res);
                } else {
                    setError(res.message || 'Failed to fetch cargo');
                }
            } catch (err) {
                setError('An error occurred while fetching cargo');
            }
        };
        loadMyCargo();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const cargoData = { description, weight: Number(weight), pickupLocation, destination, pickupDate };
            const res = await createCargoListing(cargoData);
            if (res._id) {
                setMyCargo([res, ...myCargo]);
                // Clear form
                setDescription('');
                setWeight('');
                setPickupLocation('');
                setDestination('');
                setPickupDate('');
            } else {
                setError(res.message || 'Failed to create cargo');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Cargo Owner Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow sm:rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Cargo Listing</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                    <input type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">Pickup Location</label>
                                    <input type="text" id="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                                    <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">Pickup Date</label>
                                    <input type="date" id="pickupDate" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create Cargo</button>
                            </form>
                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900">My Cargo Listings</h2>
                            </div>
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {myCargo.map((cargo: any) => (
                                        <li key={cargo._id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{cargo.description}</p>
                                                    <p className="text-sm text-gray-500">{cargo.pickupLocation} to {cargo.destination}</p>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {cargo.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}