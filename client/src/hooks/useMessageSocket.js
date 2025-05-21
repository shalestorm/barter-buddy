import { useEffect } from 'react';

export function useMessageSocket(conversationId, onMessage) {
  useEffect(() => {
    if (!conversationId) return;

    const socket = new WebSocket(`wss://ourapi.com/ws/messages/${conversationId}`); //will need to be our actual API

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      onMessage(msg);
    };

    return () => socket.close();
  }, [conversationId, onMessage]);
}
