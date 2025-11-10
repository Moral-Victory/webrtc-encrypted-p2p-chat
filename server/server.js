const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const os = require('os');

const PORT = 3001;

// Get local IP address for display
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Create HTTPS server with certificates
const server = https.createServer({
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
}, (req, res) => {
  res.writeHead(200);
  res.end('WebSocket Server Running (HTTPS)');
});

const wss = new WebSocket.Server({ server });

// Store connected clients and rooms
const clients = new Map();
const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('✅ New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'join':
          handleJoin(ws, data);
          break;
        case 'signal':
          handleSignal(ws, data);
          break;
        case 'leave':
          handleLeave(ws);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    handleLeave(ws);
    console.log('👋 Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function handleJoin(ws, data) {
  const { username, roomId } = data;
  const userId = generateUserId();

  clients.set(ws, { userId, username, roomId });

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);

  // Get existing users in room
  const existingUsers = Array.from(rooms.get(roomId))
    .filter(client => client !== ws)
    .map(client => {
      const info = clients.get(client);
      return { userId: info.userId, username: info.username };
    });

  // Send to new user
  ws.send(JSON.stringify({
    type: 'room-joined',
    roomId,
    userId,
    users: existingUsers
  }));

  // Notify others
  broadcastToRoom(roomId, {
    type: 'user-joined',
    userId,
    username
  }, ws);

  // Send updated user list
  updateUserList(roomId);

  console.log(`👤 ${username} joined room: ${roomId}`);
}

function handleSignal(ws, data) {
  const sender = clients.get(ws);
  if (!sender) return;

  const { targetId, signal } = data;

  // Find target client
  for (const [client, info] of clients.entries()) {
    if (info.userId === targetId && info.roomId === sender.roomId) {
      client.send(JSON.stringify({
        type: 'signal',
        fromId: sender.userId,
        signal
      }));
      break;
    }
  }
}

function handleLeave(ws) {
  const clientInfo = clients.get(ws);
  if (!clientInfo) return;

  const { userId, username, roomId } = clientInfo;

  if (rooms.has(roomId)) {
    rooms.get(roomId).delete(ws);

    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
      console.log(`🗑️  Room ${roomId} is now empty and removed`);
    } else {
      broadcastToRoom(roomId, {
        type: 'user-left',
        userId,
        username
      });
      updateUserList(roomId);
      console.log(`👋 ${username} left room: ${roomId}`);
    }
  }

  clients.delete(ws);
}

function broadcastToRoom(roomId, message, excludeWs = null) {
  if (!rooms.has(roomId)) return;

  const messageStr = JSON.stringify(message);
  rooms.get(roomId).forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

function updateUserList(roomId) {
  if (!rooms.has(roomId)) return;

  const users = Array.from(rooms.get(roomId)).map(client => {
    const info = clients.get(client);
    return { userId: info.userId, username: info.username };
  });

  broadcastToRoom(roomId, {
    type: 'user-list',
    users
  });
}

function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

// Listen on all network interfaces (0.0.0.0)
server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIpAddress();
  
  console.log('\n🚀 WebSocket Server Running (HTTPS):\n');
  console.log(`   ➜  Local:   https://localhost:${PORT}`);
  console.log(`   ➜  Network: https://${localIp}:${PORT}\n`);
  console.log('📱 Access from other devices on your WiFi:');
  console.log(`   Open: https://${localIp}:${PORT}\n`);
  console.log('✅ Server ready for connections\n');
  console.log('💡 Note: You may need to accept the self-signed certificate');
  console.log('   on each device that connects.\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  
  // Close all WebSocket connections
  wss.clients.forEach(client => {
    client.close();
  });
  
  // Close server
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  
  wss.clients.forEach(client => {
    client.close();
  });
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
