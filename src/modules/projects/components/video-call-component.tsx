import React, { useEffect, useRef, useState } from 'react';
import { VideoCallService } from '@/shared/services/video-call.service';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Hand, Users } from 'lucide-react';
import toast from 'react-hot-toast';


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
    onLeave
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
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const service = new VideoCallService(socketUrl, {
            onLocalStream: (stream) => {
                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            },
            onMediaError: (error) => {
                toast.error(error.message || 'Camera/Microphone permission failed');
            },
            onRemoteStream: (stream, peerId, peerUserName) => {
                setRemoteStreams(prev => {
                    const next = new Map(prev);
                    next.set(peerId, { stream, userName: peerUserName });
                    setTrackNonce(n => ({ ...n, [peerId]: (n[peerId] || 0) + 1 }));
                    return next;
                });
            },
            onUserConnected: (peerId, peerUserName) => {
                console.log(`User connected: ${peerUserName}`);
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
        <>
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
                            key={peerId}
                            trackNonce={trackNonce[peerId] || 0}
                            stream={stream}
                            userName={userName}
                            isHandRaised={!!remoteHands.get(peerId)}
                            isVideoEnabled={videoService.current?.isRemoteVideoEnabled(peerId) ?? true}
                            isAudioEnabled={videoService.current?.isRemoteAudioEnabled(peerId) ?? true}
                        />
                    ))}
                </div>

                {/* CONTROLS */}
                <div className="mt-auto pt-2 w-full flex-shrink-0 z-10">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sm:p-4 shadow-xl">
                        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-gray-700/70 rounded-xl border border-white/5 text-gray-300 shadow-sm" title="Participants">
                            <Users size={20} />
                            <span className="font-medium">{remoteStreams.size + 1}</span>
                        </div>

                        <button
                            onClick={toggleAudio}
                            className={`p-2 sm:p-4 rounded-xl transition-all shadow-sm ${isAudioEnabled
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30'
                                }`}
                            title={isAudioEnabled ? 'Mute' : 'Unmute'}
                        >
                            {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                        </button>

                        <button
                            onClick={toggleVideo}
                            className={`p-2 sm:p-4 rounded-xl transition-all shadow-sm ${isVideoEnabled
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30'
                                }`}
                            title={isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
                        >
                            {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                        </button>

                        <button
                            onClick={toggleHandRaise}
                            className={`p-2 sm:p-4 rounded-xl transition-all shadow-sm ${isHandRaised
                                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                                }`}
                            title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
                        >
                            <Hand size={24} fill={isHandRaised ? 'currentColor' : 'none'} />
                        </button>

                        <button
                            onClick={onLeave}
                            className="p-2 sm:p-4 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg flex justify-center"
                            title="Leave Call"
                        >
                            <PhoneOff size={24} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Extension Modal Removed */}
        </>
    );
};

/* ---------- REMOTE VIDEO COMPONENT ---------- */
const RemoteVideo: React.FC<{
    stream: MediaStream;
    trackNonce: number;
    userName: string;
    isHandRaised: boolean;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
}> = ({ stream, trackNonce, userName, isHandRaised, isVideoEnabled, isAudioEnabled }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v || !stream) return;

        // Force WebKit/Blink to notice asynchronous track additions by completely re-binding the stream reference.
        // Mobile browsers will silently fail to render if tracks are appended to an active stream object.
        v.srcObject = null;
        v.srcObject = stream;

        // A tiny timeout delay guarantees the DOM has officially painted the new srcObject before play is called.
        // This is necessary to bypass a severe race condition in iOS/Android Autoplay Policies.
        const timeout = setTimeout(() => {
            v.play().catch(err => console.log("[REMOTE] Warning: Background auto-play denied:", err));
        }, 50);

        return () => clearTimeout(timeout);
    }, [stream, trackNonce]);

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