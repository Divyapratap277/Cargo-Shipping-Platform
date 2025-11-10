import { useState, useEffect } from 'react';
import { fetchAllAuctions, placeBidOnAuction } from '../../lib/api';
import io from 'socket.io-client';
import Link from 'next/link';

const socket = io('http://localhost:5000');

export default function TruckOwnerDashboard() {
    const [auctions, setAuctions] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [bidAmounts, setBidAmounts] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const loadAuctions = async () => {
            try {
                const res = await fetchAllAuctions();
                if (Array.isArray(res)) {
                    setAuctions(res);
                } else {
                    setError(res.message || 'Failed to fetch auctions');
                }
            } catch (err) {
                setError('An error occurred while fetching auctions');
            }
        };
        loadAuctions();

        socket.on('auction-started', (newAuction) => {
            setAuctions((prevAuctions) => [...prevAuctions, newAuction]);
        });

        socket.on('update-bid', (updatedBid) => {
            setAuctions((prevAuctions) =>
                prevAuctions.map((auction) =>
                    auction._id === updatedBid.auction
                        ? { ...auction, currentLowestBid: updatedBid.amount }
                        : auction
                )
            );
        });

        socket.on('auction-ended', (endedAuction) => {
            setAuctions((prevAuctions) =>
                prevAuctions.filter((auction) => auction._id !== endedAuction._id)
            );
        });

        return () => {
            socket.off('auction-started');
            socket.off('update-bid');
            socket.off('auction-ended');
        };
    }, []);

    const handleBidChange = (auctionId: string, amount: string) => {
        setBidAmounts({ ...bidAmounts, [auctionId]: amount });
    };

    const handlePlaceBid = async (auctionId: string) => {
        const amount = bidAmounts[auctionId];
        if (!amount) {
            setError('Please enter a bid amount');
            return;
        }
        setError('');
        try {
            const res = await placeBidOnAuction(auctionId, Number(amount));
            if (res._id) {
                // Bid placed successfully, UI will update via socket event
                setBidAmounts({ ...bidAmounts, [auctionId]: '' });
            } else {
                setError(res.message || 'Failed to place bid');
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
                                <h1 className="text-2xl font-bold text-gray-900">Truck Owner Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Active Auctions</h2>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auctions.map((auction) => (
                            <div key={auction._id} className="bg-white shadow sm:rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{auction.cargo.description}</h3>
                                <p className="text-sm text-gray-500 mb-4">{auction.cargo.pickupLocation} to {auction.cargo.destination}</p>
                                <p className="text-lg font-bold text-gray-900 mb-4">Current Lowest Bid: ${auction.currentLowestBid || 'No bids yet'}</p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        value={bidAmounts[auction._id] || ''}
                                        onChange={(e) => handleBidChange(auction._id, e.target.value)}
                                        placeholder="Your bid"
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button 
                                        onClick={() => handlePlaceBid(auction._id)} 
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Place Bid 
                                    </button>
                                </div>
                                <Link href={`/auction/${auction._id}`} className="block text-center mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
