"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Wallet,
  ArrowDownCircle,
  Plus,
  Receipt,
  Package,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Shield,
  User,
  FileText,
  CreditCard,
  MapPin,
  Phone
} from "lucide-react";
import Link from "next/link";
import { IUser, useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getDate } from "@/lib/utils";
import { Loader } from "../ui/custom/loader";

// Use existing interfaces from your project
interface IOrder {
  _id: string;
  orderId: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid';
  receiverName: string;
  receiversAddress: string;
  cost: string;
  acceptedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: number; // in hours
  penaltyApplied?: boolean;
  penaltyAmount?: number;
}

interface IWallet {
  balance: number;
  totalEarnings?: number;
  totalPenalties?: number;
}

interface IRiderVerification {
  nin: {
    number?: string;
    verified: boolean;
    uploadedAt?: Date;
  };
  bvn: {
    number?: string;
    verified: boolean;
    uploadedAt?: Date;
  };
  driversLicense: {
    number?: string;
    verified: boolean;
    uploadedAt?: Date;
    expiryDate?: Date;
  };
  overallVerificationStatus: 'pending' | 'partial' | 'complete';
}

interface ITarget {
  type: 'daily' | 'weekly';
  targetOrders: number;
  completedOrders: number;
  period: string;
  isAchieved: boolean;
}

// Header Component
const DashboardHeader = ({ user }: { user: IUser | null }) => {
  const [isLoading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex justify-between items-center mt-4">
        <Link href="profile" className="group flex items-center space-x-4">
          <div className="relative overflow-hidden rounded-full transition-transform group-hover:scale-105">
            <Avatar className="h-[70px] w-[70px] bg-purple-100">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.firstname || "Username"}`}
              />
              <AvatarFallback>
                {user ? user.firstname?.slice(0, 2).toUpperCase() : "UN"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className="text-2xl font-medium hidden lg:block group-hover:text-gray-700">
              {user?.firstname}
            </h1>
            <p className="text-sm text-gray-500 hidden lg:block">Rider's Dashboard</p>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/rider/notification" className="relative">
            <Bell
              className="w-6 h-6 text-black hover:text-gray-600 transition-colors"
              onClick={() => setLoading(true)}
            />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

// Enhanced Wallet Card Component
const WalletCard = ({
  balance,
  completedOrders,
  pendingOrders,
  totalEarnings,
  totalPenalties
}: {
  balance: number;
  completedOrders: number;
  pendingOrders: number;
  totalEarnings: number;
  totalPenalties: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = () => {
    // Add withdrawal logic here
    setIsOpen(false);
    setWithdrawAmount("");
  };

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Main Wallet Card */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32">
          <div className="absolute inset-0 bg-[#F9CA44] opacity-10 transform rotate-45 scale-150" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-[#F9CA44] bg-opacity-20 rounded-full">
              <Wallet className="w-8 h-8 text-[#F9CA44]" />
            </div>
            <span className="text-lg font-medium text-gray-600">Total Earnings</span>
          </div>

          <div className="text-4xl font-bold mb-6">NGN {new Intl.NumberFormat().format(totalEarnings)}</div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Available Balance</p>
              <p className="text-lg font-bold text-green-700">NGN {new Intl.NumberFormat().format(balance)}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600">Total Penalties</p>
              <p className="text-lg font-bold text-red-700">NGN {new Intl.NumberFormat().format(totalPenalties)}</p>
            </div>
          </div>

          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 bg-[#F9CA44] text-white px-6 py-3 rounded-lg hover:bg-[#e0b63c] transition-all duration-300">
                <ArrowDownCircle className="h-5 w-5" />
                Withdraw Funds
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Withdraw Funds</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Amount to withdraw
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Enter amount"
                      max={balance}
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleWithdraw}
                  className="bg-[#F9CA44] hover:bg-[#e0b63c]"
                >
                  Confirm Withdrawal
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Verification Status Component
const VerificationStatus = ({ verification }: { verification: IRiderVerification }) => {
  const getStatusColor = (verified: boolean) => verified ? 'text-green-600' : 'text-red-600';
  const getStatusIcon = (verified: boolean) => verified ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Shield className="w-6 h-6 text-[#F9CA44]" />
        <h3 className="text-lg font-semibold">Account Verification</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">NIN Verification</span>
          <div className={`flex items-center space-x-2 ${getStatusColor(verification.nin.verified)}`}>
            {getStatusIcon(verification.nin.verified)}
            <span className="text-sm">{verification.nin.verified ? 'Verified' : 'Pending'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">BVN Verification</span>
          <div className={`flex items-center space-x-2 ${getStatusColor(verification.bvn.verified)}`}>
            {getStatusIcon(verification.bvn.verified)}
            <span className="text-sm">{verification.bvn.verified ? 'Verified' : 'Pending'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Driver's License</span>
          <div className={`flex items-center space-x-2 ${getStatusColor(verification.driversLicense.verified)}`}>
            {getStatusIcon(verification.driversLicense.verified)}
            <span className="text-sm">{verification.driversLicense.verified ? 'Verified' : 'Pending'}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="font-medium">Overall Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${verification.overallVerificationStatus === 'complete'
            ? 'bg-green-100 text-green-700'
            : verification.overallVerificationStatus === 'partial'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
            }`}>
            {verification.overallVerificationStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <Link href="/rider/verification" className="block mt-4">
        <button className="w-full bg-[#F9CA44] text-white py-2 rounded-lg hover:bg-[#e0b63c] transition-colors">
          Update Verification
        </button>
      </Link>
    </div>
  );
};

// Target Progress Component
const TargetProgress = ({ target }: { target: ITarget }) => {
  const progress = (target.completedOrders / target.targetOrders) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Target className="w-6 h-6 text-[#F9CA44]" />
        <h3 className="text-lg font-semibold">{target.type.charAt(0).toUpperCase() + target.type.slice(1)} Target</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{target.completedOrders}/{target.targetOrders} orders</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${target.isAchieved ? 'bg-green-500' : 'bg-[#F9CA44]'
              }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{progress.toFixed(1)}% Complete</span>
          {target.isAchieved && (
            <span className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Target Achieved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Order Item Component with Accept/Complete Actions
const OrderItem = ({
  order,
  onAccept,
  onComplete,
  showActions = true
}: {
  order: IOrder;
  onAccept?: (orderId: string) => void;
  onComplete?: (orderId: string, pin: string) => void;
  showActions?: boolean;
}) => {
  const [pin, setPin] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'in_transit': return 'bg-blue-100 text-blue-700';
      case 'accepted': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCompleteOrder = () => {
    if (pin.length === 4 && onComplete) {
      onComplete(order._id, pin);
      setPin('');
      setShowPinDialog(false);
    }
  };

  const isOverdue = () => {
    if (order.acceptedAt && order.status === 'accepted' && order.estimatedDeliveryTime) {
      const acceptedTime = new Date(order.acceptedAt).getTime();
      const currentTime = new Date().getTime();
      const hoursElapsed = (currentTime - acceptedTime) / (1000 * 60 * 60);
      return hoursElapsed > order.estimatedDeliveryTime;
    }
    return false;
  };

  return (
    <div className={`group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6 mt-2 ${isOverdue() ? 'border-l-4 border-red-500' : ''
      }`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
            <Package className="w-7 h-7 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-bold">#{order.orderId}</p>
            <p className="text-sm text-gray-600 mt-1">{order.receiverName}</p>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {order.receiversAddress}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`capitalize font-medium px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ')}
          </span>
          <p className="text-lg font-bold mt-2">NGN {new Intl.NumberFormat().format(parseInt(order.cost))}</p>
          {isOverdue() && (
            <p className="text-xs text-red-500 flex items-center mt-1">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Overdue
            </p>
          )}
        </div>
      </div>

      {showActions && (
        <div className="mt-4 flex space-x-2">
          {order.status === 'pending' && onAccept && (
            <button
              onClick={() => onAccept(order._id)}
              className="flex-1 bg-[#F9CA44] text-white px-4 py-2 rounded-lg hover:bg-[#e0b63c] transition-colors"
            >
              Accept Order
            </button>
          )}

          {order.status === 'accepted' && onComplete && (
            <button
              onClick={() => setShowPinDialog(true)}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      )}

      {/* PIN Dialog */}
      <AlertDialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-4">
                <p className="mb-4">Enter the 4-digit PIN provided by the receiver to confirm delivery:</p>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.slice(0, 4))}
                  className="w-full text-center text-2xl font-bold tracking-wider rounded-md border border-gray-300 px-3 py-2"
                  placeholder="0000"
                  maxLength={4}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPin('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteOrder}
              disabled={pin.length !== 4}
              className="bg-green-500 hover:bg-green-600"
            >
              Complete Delivery
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Main Dashboard Component
const WalletDashboard = () => {
  const { user, accessToken } = useAuth();
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [orders, setOrders] = useState<IOrder[] | null>(null);
  const [verification, setVerification] = useState<IRiderVerification | null>(null);
  const [target, setTarget] = useState<ITarget | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Mock implementation - replace with your actual API endpoint
      console.log('Accepting order:', orderId);

      // For now, just update the UI optimistically
      setOrders(prevOrders =>
        prevOrders?.map(order =>
          order._id === orderId
            ? { ...order, status: 'accepted' as const, acceptedAt: new Date() }
            : order
        ) || []
      );

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/orders/${orderId}/accept`, {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleCompleteOrder = async (orderId: string, pin: string) => {
    try {
      console.log('Completing order:', orderId, 'with PIN:', pin);

      if (pin.length === 4) {
        setOrders(prevOrders =>
          prevOrders?.map(order =>
            order._id === orderId
              ? { ...order, status: 'delivered' as const, deliveredAt: new Date() }
              : order
          ) || []
        );

        // Update completed orders count
        setCompletedOrders(prev => prev + 1);
        setPendingOrders(prev => Math.max(0, prev - 1));
      }

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/orders/${orderId}/complete`, {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ pin }),
      // });
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/wallets?page=1&limit=10`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setWallet({
            balance: data.wallet?.balance || 0,
            totalEarnings: data.wallet?.totalEarnings || data.wallet?.balance || 0,
            totalPenalties: data.wallet?.totalPenalties || 0,
          });
          setOrders(data.orders?.docs || []);
          setCompletedOrders(data.completedOrders || 0);
          setPendingOrders(data.notDeliveredOrders || 0);

          // Set mock data for new features (you can replace with real API calls later)
          setVerification({
            nin: { verified: false },
            bvn: { verified: false },
            driversLicense: { verified: false },
            overallVerificationStatus: 'pending'
          });

          setTarget({
            type: 'daily',
            targetOrders: 10,
            completedOrders: data.completedOrders || 0,
            period: new Date().toISOString().split('T')[0],
            isAchieved: (data.completedOrders || 0) >= 10
          });

          setIsLoading(false);
        } else {
          console.error("Failed to fetch dashboard data:", data.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [accessToken]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader user={user} />

        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-14">
          <WalletCard
            balance={wallet?.balance || 0}
            completedOrders={completedOrders}
            pendingOrders={pendingOrders}
            totalEarnings={wallet?.totalEarnings || 0}
            totalPenalties={wallet?.totalPenalties || 0}
          />

          <div className="mt-6 lg:mt-0">
            <div className="space-y-6">
              {/* {verification && <VerificationStatus verification={verification} />} */}
              {target && <TargetProgress target={target} />}

              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <Link href="/rider/orders" className="text-gray-500 hover:text-gray-700 hover:underline transition-colors">
                    View All Orders
                  </Link>
                </div>

                <div className="space-y-3 mt-4">
                  {orders?.map((order: IOrder) => (
                    <OrderItem
                      key={order._id}
                      order={order}
                      onAccept={handleAcceptOrder}
                      onComplete={handleCompleteOrder}
                      showActions={order.status === 'pending' || order.status === 'accepted'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;