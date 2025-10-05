"use client"
import WalletDashboard from "@/components/Rider/WalletDashboard";
import { SocketContext } from "@/context/SocketIOContext";
import React, { useContext, useEffect, useState } from "react";

interface IOrder {
  rider: string;
  title: string;
  order: string;
  isRead: string;
}

const index = () => {
    const socket = useContext(SocketContext);
    const [orders, setOrders] = useState<IOrder[]>([]);

      useEffect(() => {
        socket?.on("newOrder", (data: IOrder) => {
          setOrders((prev) => [...prev, data])
        })
    
        return () => {
          socket?.off("newOrder");
        };
      }), [socket];

  return (
    <div>
      <WalletDashboard />
    </div>
  );
};

export default index;
