import { Socket, Server } from 'socket.io';

// Put this outside the class so that the controller could use later
export let socketIOPostObject: Server;

// Export class instead of export instance to prevent an error (Eddie said that)
export class SocketIOPostHander {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Post socketio handler');
    });
  }
}
