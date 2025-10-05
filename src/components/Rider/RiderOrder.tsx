"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ReceiptModal, TransactionItem } from "./WalletDashboard";

import { IOrder } from "@/interfaces/interface";
import { Loader } from "../ui/custom/loader";

export default function Orders() {
    const router = useRouter()
    const { accessToken } = useAuth();
    
    // State variables
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [wallet, setWallet] = useState(null);
    const [latestOrder, setLatestOrder] = useState<IOrder | null>(null);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [notDeliveredOrders, setNotDeliveredOrders] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    
    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Pagination refs
    const page = useRef(1);
    const limit = useRef(10);

    // Fetch Orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!hasMore) return;
            
            try {
                const response = await fetch(
                    `/api/wallets?page=${page.current}&limit=${limit.current}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                
                const data = await response.json();
                
                if (response.ok) {
                    setWallet(data.wallet);
                    setOrders(data.orders.docs);
                    setLatestOrder(data.orders.docs[0]);
                    setHasMore(data.orders.hasMore);
                    setCompletedOrders(data.completedOrders);
                    setNotDeliveredOrders(data.notDeliveredOrders);
                    setIsLoading(false);
                } else {
                    console.error("Failed to fetch orders:", data.message);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setIsLoading(false);
            }
        };
        
        fetchOrders();
    }, [accessToken, hasMore]);

    // Handle order click
    const handleOrderClick = (order: IOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // Handle back navigation
    const handleGoBack = () => {
        router.back()
    };

    return (
        <div className="max-w-full h-[100vh] mx-auto bg-white shadow-lg rounded-xl p-5 border border-yellow-200">
            <div className="flex items-center mb-4">
                {/* Back Button */}
                <button 
                    onClick={handleGoBack}
                    className="mr-4 p-2 hover:bg-yellow-50 rounded-full transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-6 h-6 text-black" />
                </button>

                <div className="flex-grow flex justify-between items-center">
                    <h2 className="text-xl font-bold text-black flex items-center gap-2">
                        <Package className="w-6 h-6 text-black" />
                        My Orders
                        {orders.length > 0 && (
                            <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                {orders.length}
                            </span>
                        )}
                    </h2>
                </div>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Completed Orders</p>
                    <p className="text-lg font-bold text-green-600">{completedOrders}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Pending Orders</p>
                    <p className="text-lg font-bold text-yellow-600">{notDeliveredOrders}</p>
                </div>
            </div>

            {isLoading ? (
                <Loader/>
            ) : (
                <div className="space-y-3">
                    {orders?.map((order: IOrder) => (
                        <TransactionItem 
                            key={order._id} 
                            order={order} 
                            onClick={() => handleOrderClick(order)} 
                        />
                    ))}
                </div>
            )}

            {/* Receipt Modal */}
            <ReceiptModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}