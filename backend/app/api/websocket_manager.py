from fastapi import WebSocket
from typing import List

clients: List[WebSocket] = []

async def connect_client(ws: WebSocket):
    await ws.accept()
    clients.append(ws)

def disconnect_client(ws: WebSocket):
    if ws in clients:
        clients.remove(ws)

async def broadcast(data: dict):
    for ws in clients:
        await ws.send_json(data)
