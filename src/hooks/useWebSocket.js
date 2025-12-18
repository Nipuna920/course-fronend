import { useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const SOCKET_URL = "http://localhost:8080/ws";

// ✅ Accept a callback function 'onMessageReceived'
const useWebSocket = (userEmail, onMessageReceived) => {

  useEffect(() => {
    if (!userEmail) return;

    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);

    stompClient.debug = () => {}; // Silence console logs

    stompClient.connect(
      {},
      () => {
        // Subscribe to user's channel
        stompClient.subscribe(`/topic/notifications/${userEmail}`, (message) => {
          if (message.body) {
            // ✅ Instead of showing a Toast, run the callback provided by Header.jsx
            if (onMessageReceived) {
                onMessageReceived();
            }
          }
        });
      },
      (error) => {
        console.error("❌ WebSocket Error:", error);
      }
    );

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [userEmail, onMessageReceived]);
};

export default useWebSocket;