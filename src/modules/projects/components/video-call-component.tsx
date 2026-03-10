import React, { useEffect, useRef, useState } from 'react';
import { VideoCallService } from '@/shared/services/video-call.service';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Hand, Users, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';


export interface ParticipantNote {
    userId: string;
    userName: string;
    content: string;
}

interface VideoCallComponentProps {
    roomId: string;
    userId: string;
    userName: string;
    meetingId?: string;
    initialNotes?: ParticipantNote[];
    onLeave: () => void;
}

export const VideoCallComponent: React.FC<VideoCallComponentProps> = ({
    roomId,
    userId,
    userName,
    meetingId,
    initialNotes,
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

    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [remoteNotes, setRemoteNotes] = useState<Map<string, { userName: string; content: string }>>(new Map());
    const notesRef = useRef(notes);
    const [isSavingNotes, setIsSavingNotes] = useState(false);

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
            onNoteSynced: ({ userId, userName, content }) => {
                setRemoteNotes(prev => new Map(prev).set(userId, { userName, content }));
            }
        });

        videoService.current = service;
        service.joinRoom(roomId, userId, userName);

        // Initialize notes from initialNotes
        if (Array.isArray(initialNotes)) {
            const myNote = initialNotes.find(n => n.userId === userId);
            if (myNote) {
                setNotes(myNote.content);
            }
            const others = new Map();
            initialNotes.forEach(n => {
                if (n.userId !== userId) {
                    others.set(n.userId, { userName: n.userName, content: n.content });
                }
            });
            setRemoteNotes(others);
        }

        return () => service.leaveRoom();
    }, [roomId, userId, userName, initialNotes]);

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

    const toggleNotes = () => {
        setIsNotesOpen(!isNotesOpen);
    };

    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);

    useEffect(() => {
        if (!meetingId) return;

        const saveNotes = async (content: string) => {
            const myInitialContent = Array.isArray(initialNotes) 
                ? (initialNotes.find(n => n.userId === userId)?.content || "") 
                : "";
                
            if (content === myInitialContent) return;
            try {
                setIsSavingNotes(true);
                await api.patch(`/api/meetings/${meetingId}/notes`, { notes: content });
            } catch (error) {
                console.error('Failed to save notes:', error);
            } finally {
                setIsSavingNotes(false);
            }
        };

        const timer = setTimeout(() => {
            saveNotes(notesRef.current);
        }, 1500);

        return () => {
            clearTimeout(timer);
            // Save on unmount if changed
            const myInitialContent = Array.isArray(initialNotes) 
                ? (initialNotes.find(n => n.userId === userId)?.content || "") 
                : "";

            if (notesRef.current !== myInitialContent) {
                // We use a separate async function or just trigger it one last time
                // Since this is a cleanup, we can't easily wait, but we can fire it off
                api.patch(`/api/meetings/${meetingId}/notes`, { notes: notesRef.current })
                    .catch(err => console.error('Final notes save failed:', err));
            }
        };
    }, [notes, meetingId, initialNotes]);

    /* --------------- render --------------- */
    return (
        <>
            <div className="flex flex-col h-full bg-gray-900 text-white p-4">
                <div className="flex-1 flex gap-4 mb-4 min-h-0">
                    <div className="flex-1 overflow-y-auto">
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-max ${isNotesOpen ? '!lg:grid-cols-2' : ''}`}>
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
                    </div>

                    {/* NOTES PANEL */}
                    {isNotesOpen && (
                        <div className="fixed inset-0 z-[60] md:relative md:inset-auto md:z-auto md:w-80 flex-shrink-0 bg-gray-800 md:rounded-xl flex flex-col overflow-hidden border border-gray-700 shadow-xl">
                            <div className="p-3 bg-gray-700/50 border-b border-gray-700 font-medium flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span>Shared Meeting Notes</span>
                                    {isSavingNotes && <span className="text-xs text-teal-400 opacity-70 animate-pulse">Saving...</span>}
                                </div>
                                <button 
                                    onClick={toggleNotes}
                                    className="p-1 hover:bg-gray-600 rounded-md transition-colors md:hidden"
                                    aria-label="Close notes"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {/* Local User Section */}
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                        Your Notes ({userName})
                                    </div>
                                    <textarea
                                        className="w-full bg-gray-900/50 rounded-lg p-3 outline-none resize-none text-gray-200 placeholder-gray-600 text-sm border border-gray-700 focus:border-teal-500/50 transition-colors h-64 md:h-32"
                                        placeholder="Start typing your notes..."
                                        value={notes}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setNotes(val);
                                            videoService.current?.syncNote(val);
                                        }}
                                    />
                                </div>

                                {/* Remote Users Sections */}
                                {Array.from(remoteNotes.entries()).map(([pUserId, { userName: pUserName, content }]) => (
                                    <div key={pUserId} className="bg-gray-900/30 rounded-lg p-3 border border-gray-700/50">
                                        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {pUserName}'s Notes
                                        </div>
                                        <div className="text-sm text-gray-300 whitespace-pre-wrap">
                                            {content || <span className="text-gray-600 italic">No notes yet...</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                            onClick={toggleNotes}
                            className={`p-2 sm:p-4 rounded-xl transition-all shadow-sm ${isNotesOpen
                                ? 'bg-teal-600 hover:bg-teal-500 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                                }`}
                            title={isNotesOpen ? 'Close Notes' : 'Open Notes'}
                        >
                            <FileText size={24} />
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