"use client"

import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import ContributorSidebar from '@/shared/common/user-common/contributor-common/ContributorSidebar';
import ContributorHeader from '@/shared/common/user-common/contributor-common/ContributorHeader';
import { VideoCallComponent } from './video-call-component';
import { Pagination } from '@/shared/common/Pagination';

interface Meeting {
    id: string;
    title: string;
    date: string;
    endTime: string;
    status: string;
    link?: string;
    createdBy: string;
    createdByName: string;
    participants: Array<{ userId: string; joinedAt?: string }>;
    notes?: Array<{ userId: string; userName: string; content: string }>;
}

interface ContributorMeetingPageProps {
    projectName?: string;
    upcomingMeetings: Meeting[];
    pastMeetings: Meeting[];
    handleJoinMeeting: (id: string) => void;
    activeMeetingId: string | null;
    userId: string;
    userName: string;
    setActiveMeetingId: (id: string | null) => void;
    upcomingPage: number;
    pastPage: number;
    upcomingTotal: number;
    pastTotal: number;
    setUpcomingPage: (page: number) => void;
    setPastPage: (page: number) => void;
    itemsPerPage: number;
    StatusBadge: React.ComponentType<{ status: string }>;
}

export default function ContributorMeetingPage({
    upcomingMeetings,
    pastMeetings,
    handleJoinMeeting,
    activeMeetingId,
    userId,
    userName,
    setActiveMeetingId,
    upcomingPage,
    pastPage,
    upcomingTotal,
    pastTotal,
    setUpcomingPage,
    setPastPage,
    itemsPerPage,
    StatusBadge
}: ContributorMeetingPageProps) {
    const [expandedNotes, setExpandedNotes] = React.useState<Record<string, boolean>>({});

    const toggleNotes = (meetingId: string) => {
        setExpandedNotes(prev => ({
            ...prev,
            [meetingId]: !prev[meetingId]
        }));
    };

    const totalUpcomingPages = Math.ceil(upcomingTotal / itemsPerPage);
    const totalPastPages = Math.ceil(pastTotal / itemsPerPage);

    const activeMeeting = upcomingMeetings.find(m => m.id === activeMeetingId) || pastMeetings.find(m => m.id === activeMeetingId);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            <ContributorSidebar activeItem="meetings" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <ContributorHeader />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meetings</h1>
                            <p className="text-gray-600">View and join scheduled team meetings.</p>
                        </div>

                        {/* Upcoming Meetings Section */}
                        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Meetings</h2>
                            <div className="space-y-4">
                                {upcomingMeetings.length > 0 ? (
                                    upcomingMeetings.map((meeting) => (
                                        <div key={meeting.id} className="border border-gray-200 rounded-lg p-6 hover:border-teal-300 transition-colors">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex-1 min-w-0 w-full">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-gray-900 truncate">{meeting.title}</h3>
                                                        <StatusBadge status={meeting.status} />
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                                        <CalendarIcon size={16} />
                                                        <span className="font-medium">Time:</span> {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(meeting.date).toLocaleDateString()})
                                                    </p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="font-medium">Scheduled By:</span> {meeting.createdByName}
                                                    </p>
                                                </div>
                                                <div className="w-full sm:w-auto">
                                                    <button
                                                        onClick={() => handleJoinMeeting(meeting.id)}
                                                        className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm"
                                                    >
                                                        Join Call
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No upcoming meetings scheduled.</p>
                                )}
                            </div>

                            {totalUpcomingPages > 1 && (
                                <Pagination
                                    currentPage={upcomingPage}
                                    totalPages={totalUpcomingPages}
                                    onPageChange={setUpcomingPage}
                                />
                            )}
                        </div>

                        {/* Past Meetings Section */}
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Meetings</h2>
                            <div className="space-y-4">
                                {pastMeetings.length > 0 ? (
                                    pastMeetings.map((meeting) => (
                                        <div
                                            key={meeting.id}
                                            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex-1 min-w-0 w-full">
                                                    <h3 className="text-lg font-bold text-gray-900 truncate">{meeting.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                                        <CalendarIcon size={16} />
                                                        <span className="font-medium">Time:</span> {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(meeting.date).toLocaleDateString()})
                                                    </p>
                                                </div>
                                                <div className="mt-2 sm:mt-0 items-end flex flex-col gap-2">
                                                    <StatusBadge status={meeting.status} />
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-sm font-semibold text-gray-900">My Meeting Notes</h4>
                                                    <button
                                                        onClick={() => toggleNotes(meeting.id)}
                                                        className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                                    >
                                                        {expandedNotes[meeting.id] ? 'Hide Notes' : 'View Notes'}
                                                    </button>
                                                </div>

                                                {expandedNotes[meeting.id] && (
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        {meeting.notes && meeting.notes.some(n => n.userId === userId) ? (
                                                            meeting.notes
                                                                .filter(n => n.userId === userId)
                                                                .map((note: { userName: string; content: string }, idx: number) => (
                                                                    <div key={idx} className="text-sm text-gray-700 whitespace-pre-wrap">
                                                                        {note.content}
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <span className="text-gray-400 italic text-sm">You didn&apos;t record any notes for this meeting.</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No past meetings found.</p>
                                )}
                            </div>

                            {totalPastPages > 1 && (
                                <Pagination
                                    currentPage={pastPage}
                                    totalPages={totalPastPages}
                                    onPageChange={setPastPage}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {activeMeetingId && (
                <div className="absolute inset-0 z-50 bg-gray-900 flex flex-col">
                    <VideoCallComponent
                        roomId={`meeting-${activeMeetingId}`}
                        userId={userId}
                        userName={userName}
                        meetingId={activeMeetingId}
                        initialNotes={activeMeeting?.notes || []}
                        onLeave={() => setActiveMeetingId(null)}
                    />
                </div>
            )}
        </div>
    );
}