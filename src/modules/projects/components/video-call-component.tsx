import React, { useEffect, useRef, useState } from 'react';
import { VideoCallService } from '@/shared/services/video-call.service';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Hand } from 'lucide-react';

interface VideoCallComponentProps {
    roomId: string;
    userId: string;
    userName: string;
    onLeave: () => void;
}

export const VideoCallComponent: React.FC<VideoCallComponentProps> = ({
    roomId,
    userId,
    userName,
    onLeave,
}) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<Map<string, { stream: MediaStream; userName: string }>>(new Map());
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [remoteHands, setRemoteHands] = useState<Map<string, boolean>>(new Map());
    const [remoteVideoStates, setRemoteVideoStates] = useState<Map<string, boolean>>(new Map());
    const [remoteAudioStates, setRemoteAudioStates] = useState<Map<string, boolean>>(new Map());

    const videoService = useRef<VideoCallService | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [trackNonce, setTrackNonce] = useState<Record<string, number>>({});

    /* --------------- service life-cycle --------------- */
    useEffect(() => {
        const service = new VideoCallService('http://localhost:3001', {
            onLocalStream: (stream) => {
                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            },
            onRemoteStream: (stream, peerId, peerUserName) => {
                setRemoteStreams(prev => {
                    const next = new Map(prev);
                    next.set(peerId, { stream, userName: peerUserName });
                    setTrackNonce(n => ({ ...n, [peerId]: (n[peerId] || 0) + 1 }));
                    return next;
                });
            }  ,
            onUserConnected: (peerId, peerUserName) => {
                console.log(`User connected: ${peerUserName}`);
                // Initial video state assumed true - can be improved later with server broadcast
                setRemoteVideoStates(prev => new Map(prev).set(peerId, true));
            },
            onUserDisconnected: (peerId) => {
                setRemoteStreams(prev => {
                    const next = new Map(prev); next.delete(peerId); return next;
                });
                setRemoteHands(prev => {
                    const next = new Map(prev); next.delete(peerId); return next;
                });
                setRemoteVideoStates(prev => {
                    const next = new Map(prev); next.delete(peerId); return next;
                });
                setRemoteAudioStates(prev => {
                    const next = new Map(prev); next.delete(peerId); return next;
                });
            },
            onHandRaised: (peerId, raised) =>
                setRemoteHands(prev => new Map(prev).set(peerId, raised)),
            onRemoteVideoState: (peerId, enabled) =>
                setRemoteVideoStates(prev => new Map(prev).set(peerId, enabled)),
            onRemoteAudioState: (peerId, enabled) =>
                setRemoteAudioStates(prev => new Map(prev).set(peerId, enabled)),
        });

        videoService.current = service;
        service.joinRoom(roomId, userId, userName);

        return () => service.leaveRoom();
    }, [roomId, userId, userName]);

    /* --------------- media handlers --------------- */
    const toggleAudio = () => {
        if (!videoService.current) return;
        const next = !isAudioEnabled;
        videoService.current.toggleAudio(next);
        setIsAudioEnabled(next);
    };

    const toggleVideo = async () => {
        if (!videoService.current) return;
        const next = !isVideoEnabled;
        setIsVideoEnabled(next);

        if (next) {
            await videoService.current.restartVideo();
        } else {
            videoService.current.toggleVideo(false);
        }
    };

    const toggleHandRaise = () => {
        if (!videoService.current) return;
        const next = !isHandRaised;
        videoService.current.raiseHand(next);
        setIsHandRaised(next);
    };

    /* --------------- render --------------- */
    return (
        <div className="flex flex-col h-full bg-gray-900 text-white p-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 overflow-y-auto">
                {/* LOCAL TILE */}
                <div
                    className={`relative bg-gray-800 rounded-xl overflow-hidden aspect-video border-2 ${isHandRaised ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'border-gray-700'
                        }`}
                >
                    {isVideoEnabled ? (
                        <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mb-4 border-2 border-teal-500/30">
                                <User size={40} className="text-teal-500" />
                            </div>
                            <span className="text-lg font-medium text-gray-300">Video Off</span>
                        </div>
                    )}

                    {isHandRaised && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-black p-2 rounded-lg shadow-lg animate-bounce">
                            <Hand size={20} fill="currentColor" />
                        </div>
                    )}

                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                        {userName} (You)
                        {!isAudioEnabled && (
                            <div className="bg-red-600/90 p-1 rounded-full">
                                <MicOff size={14} className="text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* REMOTE TILES */}
                {Array.from(remoteStreams.entries()).map(([peerId, { stream, userName }]) => (
                    <RemoteVideo
                        key={`${peerId}-${trackNonce[peerId] || 0}`}
                        stream={stream}
                        userName={userName}
                        isHandRaised={!!remoteHands.get(peerId)}
                        isVideoEnabled={videoService.current?.isRemoteVideoEnabled(peerId) ?? true}
                        isAudioEnabled={videoService.current?.isRemoteAudioEnabled(peerId) ?? true}
                    />
                ))}
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 backdrop-blur-xl border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleAudio}
                        className={`p-4 rounded-xl transition-all ${isAudioEnabled
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30'
                            }`}
                        title={isAudioEnabled ? 'Mute' : 'Unmute'}
                    >
                        {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-xl transition-all ${isVideoEnabled
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30'
                            }`}
                        title={isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
                    >
                        {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>

                    <button
                        onClick={toggleHandRaise}
                        className={`p-4 rounded-xl transition-all ${isHandRaised
                                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                        title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
                    >
                        <Hand size={24} fill={isHandRaised ? 'currentColor' : 'none'} />
                    </button>
                </div>

                <button
                    onClick={onLeave}
                    className="p-4 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg shadow-red-900/20"
                    title="Leave Call"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

/* ---------- REMOTE VIDEO COMPONENT ---------- */
const RemoteVideo: React.FC<{
    stream: MediaStream;
    userName: string;
    isHandRaised: boolean;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
}> = ({ stream, userName, isHandRaised, isVideoEnabled, isAudioEnabled }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        v.srcObject = null;
        requestAnimationFrame(() => {
            const clone = stream.clone();
            v.srcObject = clone;
            v.autoplay = true;
            v.playsInline = true;
            v.muted = false;
        });
    }, [stream]);

    const nameBar = (
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
            {userName}
            {!isAudioEnabled && (
                <div className="bg-red-600/90 p-1 rounded-full">
                    <MicOff size={14} className="text-white" />
                </div>
            )}
        </div>
    );

    if (!isVideoEnabled) {
        return (
            <div
                className={`relative bg-gray-800 rounded-xl overflow-hidden aspect-video border-2 ${isHandRaised ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'border-gray-700'
                    }`}
            >
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 border-2 border-blue-500/30">
                        <User size={40} className="text-blue-500" />
                    </div>
                    <span className="text-lg font-medium text-gray-300">{userName}</span>
                    <span className="text-sm text-gray-400 mt-1">Video Off</span>
                </div>

                {isHandRaised && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-black p-2 rounded-lg shadow-lg animate-bounce">
                        <Hand size={20} fill="currentColor" />
                    </div>
                )}

                {nameBar}
            </div>
        );
    }

    return (
        <div
            className={`relative bg-gray-800 rounded-xl overflow-hidden aspect-video border-2 ${isHandRaised ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'border-gray-700'
                }`}
        >
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

            {isHandRaised && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-black p-2 rounded-lg shadow-lg animate-bounce">
                    <Hand size={20} fill="currentColor" />
                </div>
            )}

            {nameBar}
        </div>
    );
};