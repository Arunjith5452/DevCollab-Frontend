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
                                            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors opacity-75"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex-1 min-w-0 w-full">
                                                    <h3 className="text-lg font-bold text-gray-900 truncate">{meeting.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                                        <CalendarIcon size={16} />
                                                        <span className="font-medium">Time:</span> {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(meeting.date).toLocaleDateString()})
                                                    </p>
                                                </div>
                                                <div className="mt-2 sm:mt-0">
                                                    <StatusBadge status={meeting.status} />
                                                </div>
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
                        onLeave={() => setActiveMeetingId(null)}
                    />
                </div>
            )}
        </div>
    );
}