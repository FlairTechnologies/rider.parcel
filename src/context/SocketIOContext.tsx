"use client";
import React, { createContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { DEV_ORIGIN } from "../../constants";

export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

let socket: Socket | null = null;

if (typeof window !== "undefined") {
  const token = localStorage.getItem("user_data");
  let accessToken = "";

  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  socket = io(`${DEV_ORIGIN}?token=${accessToken}`);

  socket.on("active-users", (data) => {
    console.log("active users: ", data);
  });
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};