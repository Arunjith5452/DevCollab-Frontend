// WebRTC Signaling Types for Frontend
export interface RTCSessionDescriptionInit {
    type: 'offer' | 'answer' | 'pranswer' | 'rollback';
    sdp: string;
}

export interface RTCIceCandidateInit {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
    usernameFragment: string | null;
}

export interface VideoCallOfferPayload {
    caller: string;
    sdp: RTCSessionDescriptionInit;
    userName: string;
}

export interface VideoCallAnswerPayload {
    caller: string;
    sdp: RTCSessionDescriptionInit;
    userName: string;
}

export interface VideoCallIceCandidatePayload {
    candidate: RTCIceCandidateInit;
    caller: string;
}
