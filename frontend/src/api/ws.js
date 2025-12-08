let socket = null;

export function connectTelemetry(onData) {
  socket = new WebSocket("ws://127.0.0.1:8000/ws/telemetry");

  socket.onopen = () => console.log("WebSocket connected");
  socket.onclose = () => console.log("WebSocket closed");
  socket.onerror = (e) => console.error("WebSocket error:", e);

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === "telemetry") {
      onData(msg.data, msg.predictions);
    }
  };

  return socket;
}

export function disconnectTelemetry() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
}
