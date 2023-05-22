import { Socket, Server } from 'socket.io';

let socketIOPostObject: Server;

export class SocketIOPostHander {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }

  public listen(): void {
    this.on('connection', (socket: Socket) => {
      console.log('Post socketio handler');
    });
  }
}
