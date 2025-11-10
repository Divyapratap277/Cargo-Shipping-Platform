"use client"; // Required for components using hooks (useState, useEffect, etc.)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // For routing
import { createCargoListing, fetchMyCargo } from '../../lib/api'; // Use your advanced api.js functions
import useSWR from 'swr'; // SWR will be used for auto-refreshing the list
import { toast } from 'sonner'; // Use Sonner for notifications

// Import Shadcn/UI Components using relative paths
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Toaster as Sonner } from '../components/ui/sonner';
import { useSonner } from 'sonner';

// Define the type for a Cargo object (good practice in TypeScript)
interface Cargo {
  _id: string;
  description: string;
  status: 'Pending' | 'Active' | 'Awarded' | 'Completed';
  pickupLocation: string;
  destination: string;
  currentLowestBid?: number;
  weight: number;
}

export default function CargoOwnerDashboard() {
  const router = useRouter();
  const { toasts } = useSonner();

  // --- State for the "Create Cargo" form ---
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Data Fetching for "My Listings" ---
  // Use SWR to fetch the cargo list. It auto-refreshes!
  // The fetcher function is simple: it just calls our apiFetch helper
  const fetcher = (url: string) => fetchMyCargo().then((res) => {
    if (res.message) { // Handle errors from our apiFetch
      throw new Error(res.message);
    }
    return res;
  });

  const { data: cargoList, error: swrError, mutate } = useSWR<Cargo[]>('myCargo', fetcher);

  // --- Authentication and Authorization Check ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if no token
      return;
    }
    
    // Optional: Check userType from localStorage if you stored it
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.userType !== 'cargo_owner') {
        router.push('/login'); // Redirect if not a cargo owner
      }
    }
  }, [router]);

  // --- Form Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const cargoData = {
        description,
        weight: parseFloat(weight),
        pickupLocation,
        destination,
        pickupDate,
      };

      // Validate data before sending
      if (isNaN(cargoData.weight) || cargoData.weight <= 0) {
        throw new Error("Weight must be a positive number.");
      }
      if (!cargoData.description || !cargoData.pickupLocation || !cargoData.destination || !cargoData.pickupDate) {
         throw new Error("Please fill out all fields.");
      }

      const result = await createCargoListing(cargoData);

      if (result.message) {
        // Handle backend validation errors (e.g., "Description is required")
        setError(result.message);
        toast({
          variant: "destructive",
          title: "Failed to create listing",
          description: result.message,
        });
      } else {
        // Success!
        toast({
          title: "Auction Started!",
          description: "Your cargo listing is now live for 5 minutes.",
        });
        
        // Reset the form
        setDescription('');
        setWeight('');
        setPickupLocation('');
        setDestination('');
        setPickupDate('');

        // Tell SWR to re-fetch the cargo list immediately
        mutate();
      }
    } catch (err: any) {
      const errorMsg = err.message || "An unknown error occurred.";
      setError(errorMsg);
      Sonner({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };
  
  // --- Badge Color Helper ---
  const getStatusBadgeVariant = (status: Cargo['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Active':
      case 'Pending':
        return 'default'; // Blue/Default for active/pending
      case 'Awarded':
      case 'Completed':
        return 'secondary'; // Green for completed/awarded
      default:
        return 'outline';
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cargo Owner Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </header>

      {/* Main Content Area (2-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Create Cargo Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>List a New Cargo</CardTitle>
              <CardDescription>Fill out the form to start a 5-minute auction.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Cargo Description</Label>
                  <Input 
                    id="description" 
                    placeholder="e.g., 50 Pallets of Electronics" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (in kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    placeholder="e.g., 1500" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input 
                    id="pickupLocation" 
                    placeholder="e.g., New York, NY" 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input 
                    id="destination" 
                    placeholder="e.g., Los Angeles, CA" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Desired Pickup Date</Label>
                  <Input 
                    id="pickupDate" 
                    type="date" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required 
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Starting Auction...' : 'Start 5-Minute Auction'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Active & Recent Listings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Active & Recent Listings</CardTitle>
              <CardDescription>Your cargo auctions will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {swrError ? (
                <p className="text-red-500">Failed to load listings. Please refresh.</p>
              ) : !cargoList ? (
                <p>Loading listings...</p>
              ) : cargoList.length === 0 ? (
                <p>You have not listed any cargo yet.</p>
              ) : (
                <div className="space-y-4">
                  {cargoList.map((cargo) => (
                    <Card key={cargo._id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4">
                      <div>
                        <h3 className="font-semibold">{cargo.description}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                           {cargo.pickupLocation} &rarr; {cargo.destination}
                        </p >
                      </div>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        <Badge variant={getStatusBadgeVariant(cargo.status)}>
                          {cargo.status}
                        </Badge>
                        {cargo.status === 'Active' && (
                          <div className="text-sm font-medium">
                            Lowest Bid: {cargo.currentLowestBid ? `$${cargo.currentLowestBid}` : 'No bids yet'}
                          </div>
                        )}
                         {cargo.status === 'Awarded' && (
                          <div className="text-sm font-medium text-green-600">
                            Won at: ${cargo.currentLowestBid}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

