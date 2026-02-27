import { io, Socket } from 'socket.io-client';

export type VideoCallEvents = {
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream, userId: string, userName: string) => void;
    onUserConnected?: (userId: string, userName: string) => void;
    onUserDisconnected?: (userId: string, userName: string) => void;
    onHandRaised?: (userId: string, raised: boolean) => void;
    onRemoteVideoState?: (userId: string, enabled: boolean) => void;
    onRemoteAudioState?: (userId: string, enabled: boolean) => void;
    onRoomState?: (state: { video: Record<string, boolean>; audio: Record<string, boolean> }) => void;
    onMediaError?: (error: Error) => void;
};

export class VideoCallService {
    private socket: Socket;
    private myUserId: string | null = null;
    private myUserName: string | null = null;
    private currentRoomId: string | null = null;
    private localStream: MediaStream | null = null;
    private peers: Map<string, RTCPeerConnection> = new Map();
    private peerUserNames: Map<string, string> = new Map();
    private pendingIceCandidates: Map<string, RTCIceCandidate[]> = new Map();
    private remoteAudioEnabled = new Map<string, boolean>();
    private remoteVideoEnabled: Map<string, boolean> = new Map();

    private config: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
        ],
    };

    private events: VideoCallEvents;

    constructor(serverUrl: string, events: VideoCallEvents) {
        this.events = events;
        this.socket = io(serverUrl);
        this.initializeSocketEvents();
    }

    private initializeSocketEvents() {
        this.socket.on('connect', () => {
            console.log('Connected to signaling server');
        });

        this.socket.on('user-connected', (payload: { userId: string; userName: string }) => {
            console.log('User connected:', payload.userName);
            this.peerUserNames.set(payload.userId, payload.userName);
            this.events.onUserConnected?.(payload.userId, payload.userName);
            this.createPeerConnection(payload.userId, true);
        });

        this.socket.on('user-disconnected', (payload: { userId: string; userName: string }) => {
            console.log('User disconnected:', payload.userName);
            this.events.onUserDisconnected?.(payload.userId, payload.userName);
            this.peerUserNames.delete(payload.userId);
            this.remoteVideoEnabled.delete(payload.userId);
            this.closePeerConnection(payload.userId);
        });

        this.socket.on('offer', async (payload: { caller: string; sdp: RTCSessionDescriptionInit; userName: string }) => {
            console.log('Received offer from:', payload.userName);
            if (payload.userName) {
                this.peerUserNames.set(payload.caller, payload.userName);
            }
            await this.handleOffer(payload.caller, payload.sdp, payload.userName);
        });

        this.socket.on('answer', async (payload: { caller: string; sdp: RTCSessionDescriptionInit; userName: string }) => {
            console.log('Received answer from:', payload.userName);
            if (payload.userName) {
                this.peerUserNames.set(payload.caller, payload.userName);
            }
            await this.handleAnswer(payload.caller, payload.sdp);
        });

        this.socket.on('ice-candidate', async (payload: { candidate: RTCIceCandidateInit; caller: string }) => {
            console.log('Received ICE candidate from:', payload.caller);
            this.handleIceCandidate(payload.caller, payload.candidate);
        });

        this.socket.on('hand-raised', (payload: { userId: string; raised: boolean }) => {
            this.events.onHandRaised?.(payload.userId, payload.raised);
        });

        this.socket.on('video-state', (payload: { userId: string; enabled: boolean }) => {
            this.remoteVideoEnabled.set(payload.userId, payload.enabled);
            this.events.onRemoteVideoState?.(payload.userId, payload.enabled);
        });
        this.socket.on('audio-state', (payload: { userId: string; enabled: boolean }) => {
            this.remoteAudioEnabled.set(payload.userId, payload.enabled);
            this.events.onRemoteAudioState?.(payload.userId, payload.enabled);
        });

        this.socket.on('room-state', (payload: { video: Record<string, boolean>; audio: Record<string, boolean> }) => {
            console.log('Received initial room state:', payload);

            Object.entries(payload.video).forEach(([userId, enabled]) => {
                this.remoteVideoEnabled.set(userId, enabled);
            });
            Object.entries(payload.audio).forEach(([userId, enabled]) => {
                this.remoteAudioEnabled.set(userId, enabled);
            });

            this.events.onRoomState?.(payload);
        });
    }

    public async joinRoom(roomId: string, userId: string, userName: string) {
        this.myUserId = userId;
        this.myUserName = userName;
        this.currentRoomId = roomId;

        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.events.onLocalStream?.(this.localStream);
        } catch (error) {
            console.error('Error accessing media devices:', error);
            this.events.onMediaError?.(error instanceof Error ? error : new Error('Media permission denied or hardware unavailable'));
            return;
        }

        this.socket.emit('join-room', roomId, userId, userName);
    }

    public leaveRoom() {
        this.localStream?.getTracks().forEach(track => track.stop());
        this.peers.forEach(peer => peer.close());
        this.peers.clear();
        this.remoteVideoEnabled.clear();
        this.socket.disconnect();
    }

    public toggleAudio(enabled: boolean) {
        this.localStream?.getAudioTracks().forEach(track => (track.enabled = enabled));

        // Notify others
        if (this.currentRoomId && this.myUserId) {
            this.socket.emit('audio-state', {
                roomId: this.currentRoomId,
                userId: this.myUserId,
                enabled
            });
        }
    }

    public async toggleVideo(enable: boolean) {
        if (enable) {
            // get a fresh video track
            const freshVideo = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            const newTrack = freshVideo.getVideoTracks()[0];

            // swap it into every peer-connection
            this.peers.forEach(peer => {
                const sender = peer.getSenders().find(s => s.track?.kind === 'video');
                if (sender) sender.replaceTrack(newTrack);
            });

            // update our own local stream so local preview works
            const oldVideoTrack = this.localStream!.getVideoTracks()[0];
            oldVideoTrack.stop();                       // kill the black track
            this.localStream!.removeTrack(oldVideoTrack);
            this.localStream!.addTrack(newTrack);
            this.events.onLocalStream?.(this.localStream!);
        } else {
            // turn off: just mute
            this.localStream!.getVideoTracks().forEach(t => (t.enabled = false));
        }

        // always tell the world
        this.socket.emit('video-state', {
            roomId: this.currentRoomId!,
            userId: this.myUserId!,
            enabled: enable
        });
    }
    /* call this instead of toggleVideo(true) */
    public async restartVideo() {
        // 1.  get fresh video track
        const fresh = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        const newTrack = fresh.getVideoTracks()[0];
        console.log('[LOCAL] new video track ready', newTrack.id, 'enabled=', newTrack.enabled);

        // 2.  replace in local stream
        const oldTrack = this.localStream!.getVideoTracks()[0];
        oldTrack.stop();
        this.localStream!.removeTrack(oldTrack);
        this.localStream!.addTrack(newTrack);
        this.events.onLocalStream?.(this.localStream!);

        // 3.  re-negotiate every peer
        this.peers.forEach((pc, peerId) => this.renogotiateVideo(peerId, newTrack));

        // 4.  tell room
        this.socket.emit('video-state', { roomId: this.currentRoomId!, userId: this.myUserId!, enabled: true });
    }

    private async renogotiateVideo(peerId: string, newTrack: MediaStreamTrack) {
        const pc = this.peers.get(peerId)!;

        // remove old sender
        const oldSender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (oldSender) pc.removeTrack(oldSender);

        // add new sender
        pc.addTrack(newTrack, this.localStream!);
        console.log('[LOCAL] addTrack done for peer', peerId, 'track', newTrack.id);

        // create new offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        this.socket.emit('offer', { target: peerId, caller: this.myUserId!, sdp: offer, userName: this.myUserName });
    }
    public async replaceVideoTrack(newTrack: MediaStreamTrack) {
        // 1.  stop & remove old video track
        const oldTrack = this.localStream!.getVideoTracks()[0];
        oldTrack.stop();
        this.localStream!.removeTrack(oldTrack);

        // 2.  add fresh one
        this.localStream!.addTrack(newTrack);

        // 3.  tell every peer
        this.peers.forEach(pc => {
            const sender = pc.getSenders().find(s => s.track?.kind === 'video');
            if (sender) sender.replaceTrack(newTrack);
        });

        // 4.  notify local preview
        this.events.onLocalStream?.(this.localStream!);

        // 5.  tell the room
        this.socket.emit('video-state', {
            roomId: this.currentRoomId!,
            userId: this.myUserId!,
            enabled: true
        });
    }

    public raiseHand(raised: boolean) {
        if (this.currentRoomId && this.myUserId) {
            this.socket.emit('raise-hand', {
                roomId: this.currentRoomId,
                userId: this.myUserId,
                raised
            });
        }
    }

    public isRemoteVideoEnabled(userId: string): boolean {
        return this.remoteVideoEnabled.get(userId) ?? true;
    }

    public isRemoteAudioEnabled(userId: string): boolean {
        return this.remoteAudioEnabled.get(userId) ?? true;
    }

    private closePeerConnection(userId: string) {
        const peer = this.peers.get(userId);
        if (peer) {
            peer.close();
            this.peers.delete(userId);
        }
    }

    private async createPeerConnection(userId: string, isInitiator: boolean) {
        if (this.peers.has(userId)) return;

        const peer = new RTCPeerConnection(this.config);
        this.peers.set(userId, peer);

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                peer.addTrack(track, this.localStream!);
            });
        }

        peer.onicecandidate = (event) => {
            if (event.candidate && this.myUserId) {
                this.socket.emit('ice-candidate', {
                    target: userId,
                    candidate: event.candidate,
                    caller: this.myUserId
                });
            }
        };

        peer.ontrack = (event) => {
            const userName = this.peerUserNames.get(userId) || 'Unknown User';
            console.log('[REMOTE] ontrack fired from', userName, 'stream.id=', event.streams[0].id,
                'videoTracks.count=', event.streams[0].getVideoTracks().length,
                'track.id=', event.track.id, 'track.kind=', event.track.kind,
                'track.enabled=', event.track.enabled);

            /* =====  ADD THESE TWO LINES  ===== */
            const [remoteStream] = event.streams;
            remoteStream.onaddtrack = (e) => console.log('[REMOTE] stream onaddtrack', e.track.id, e.track.kind);
            remoteStream.onremovetrack = (e) => console.log('[REMOTE] stream onremovetrack', e.track.id, e.track.kind);
            /* ================================= */

            this.events.onRemoteStream?.(event.streams[0], userId, userName);
        };

        if (isInitiator && this.myUserId) {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            this.socket.emit('offer', {
                target: userId,
                caller: this.myUserId,
                sdp: offer,
                userName: this.myUserName
            });
        }
    }

    private async handleOffer(callerId: string, sdp: RTCSessionDescriptionInit, userName?: string) {
        if (userName) {
            this.peerUserNames.set(callerId, userName);
        }
        this.createPeerConnection(callerId, false);
        const peer = this.peers.get(callerId);
        if (!peer) return;

        await peer.setRemoteDescription(new RTCSessionDescription(sdp));
        this.drainIceCandidates(callerId);

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        if (this.myUserId) {
            this.socket.emit('answer', {
                target: callerId,
                caller: this.myUserId,
                sdp: answer,
                userName: this.myUserName
            });
        }
    }

    private async handleAnswer(callerId: string, sdp: RTCSessionDescriptionInit) {
        const peer = this.peers.get(callerId);
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(sdp));
            this.drainIceCandidates(callerId);
        }
    }

    private async handleIceCandidate(callerId: string, candidate: RTCIceCandidateInit) {
        const peer = this.peers.get(callerId);
        const iceCandidate = new RTCIceCandidate(candidate);

        if (peer && peer.remoteDescription) {
            await peer.addIceCandidate(iceCandidate);
        } else {
            if (!this.pendingIceCandidates.has(callerId)) {
                this.pendingIceCandidates.set(callerId, []);
            }
            this.pendingIceCandidates.get(callerId)!.push(iceCandidate);
        }
    }

    private drainIceCandidates(userId: string) {
        const candidates = this.pendingIceCandidates.get(userId);
        const peer = this.peers.get(userId);

        if (candidates && peer) {
            candidates.forEach(candidate => peer.addIceCandidate(candidate));
            this.pendingIceCandidates.delete(userId);
        }
    }
}