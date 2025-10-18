
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAuctionDetails } from '../../lib/api'; // This function needs to be created in api.js
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function AuctionDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [auction, setAuction] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const loadAuctionDetails = async () => {
            try {
                const res = await fetchAuctionDetails(id as string); // You will need to create this function
                if (res._id) {
                    setAuction(res);
                } else {
                    setError(res.message || 'Failed to fetch auction details');
                }
            } catch (err) {
                setError('An error occurred while fetching auction details');
            }
        };

        loadAuctionDetails();

        socket.on('update-bid', (updatedBid) => {
            if (updatedBid.auction === id) {
                setAuction((prevAuction: any) => ({
                    ...prevAuction,
                    bids: [...prevAuction.bids, updatedBid],
                    currentLowestBid: updatedBid.amount,
                }));
            }
        });

        return () => {
            socket.off('update-bid');
        };
    }, [id]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!auction) return <p>Loading...</p>;

    return (
        <div>
            <h1>Auction Details</h1>
            <h2>{auction.cargo.description}</h2>
            <p><strong>Status:</strong> {auction.status}</p>
            <p><strong>Current Lowest Bid:</strong> {auction.currentLowestBid || 'No bids yet'}</p>
            <h3>Bidding History</h3>
            <ul>
                {auction.bids.map((bid: any) => (
                    <li key={bid._id}>
                        {bid.bidder.name}: ${bid.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
}
