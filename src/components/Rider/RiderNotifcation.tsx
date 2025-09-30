"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Bell, Trash2, CheckCircle, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from "next/navigation";
import { Loader } from "../ui/custom/loader";

// Type definition for Notification
type Notification = {
    _id: string;
    title: string;
    isRead: boolean;
    createdAt: string;
};

export default function Notifications() {
    const router = useRouter()
    const { accessToken } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Notifications
    useEffect(() => {
        async function fetchNotifications() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/notifications", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch notifications');
                }

                const data = await res.json();
                setNotifications(data.docs || []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }

        if (accessToken) {
            fetchNotifications();
        }
    }, [accessToken]);

    // Mark All as Read
    const markAllAsRead = async () => {
        try {
            const res = await fetch("/api/notifications/read", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            });

            if (!res.ok) {
                throw new Error('Failed to mark notifications as read');
            }

            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true }))
            );
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    // Delete Notification
    const deleteNotification = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            });

            if (!res.ok) {
                throw new Error('Failed to delete notification');
            }

            setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        } catch (error) {
            console.error("Error deleting notification:", error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    // Unread notifications count
    const unreadCount = notifications.filter(notif => !notif.isRead).length;

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
                        Notifications
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h2>

                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="text-yellow-700 hover:bg-yellow-50 disabled:opacity-50 p-2 rounded-md transition-colors flex items-center gap-1 text-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {loading && <Loader />}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    {error}
                </div>
            )}

            {!loading && notifications.length === 0 && (
                <div className="text-center py-4 text-yellow-600">
                    No notifications to show
                </div>
            )}

            <ul className="space-y-3">
                {notifications.map((notif) => (
                    <li
                        key={notif._id}
                        className={`p-4 rounded-lg transition-all duration-300 ease-in-out border ${notif.isRead
                                ? "bg-white border-yellow-100"
                                : "bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200"
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-grow pr-3">
                                <p className={`text-sm font-semibold ${notif.isRead ? 'text-gray-700' : 'text-yellow-800 font-bold'}`}>
                                    {notif.title}
                                </p>
                                <p className="text-xs text-yellow-600 mt-1">
                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </p>
                            </div>

                            <button
                                onClick={() => deleteNotification(notif._id)}
                                className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100 p-2 rounded-full transition-colors"
                                aria-label="Delete notification"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}