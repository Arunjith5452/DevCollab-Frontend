"use client"

import React from 'react';
import { Calendar as CalendarIcon, Copy } from 'lucide-react';
import { CreatorSidebar } from '@/shared/common/user-common/Creator-sidebar';
import CreatorHeader from '@/shared/common/user-common/Creator-header';
import { VideoCallComponent } from './video-call-component';
import { Pagination } from '@/shared/common/Pagination';

interface Meeting {
    id: string;
    title: string;
    date: string;
    status: string;
    link?: string;
    createdBy: string;
}

interface MeetingFormData {
    date: string;
    time: string;
    agenda: string;
}

interface CreatorMeetingPageProps {
    projectName?: string;
    formData: MeetingFormData;
    upcomingMeetings: Meeting[];
    pastMeetings: Meeting[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleScheduleMeeting: () => void;
    handleJoinMeeting: (id: string) => void;
    handleCancelMeeting: (id: string) => void;
    handleFinishMeeting: (id: string) => void;
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
}

export default function CreatorMeetingPage({
    projectName,
    formData,
    upcomingMeetings,
    pastMeetings,
    handleInputChange,
    handleScheduleMeeting,
    handleJoinMeeting,
    handleCancelMeeting,
    handleFinishMeeting,
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
    itemsPerPage
}: CreatorMeetingPageProps) {
    const totalUpcomingPages = Math.ceil(upcomingTotal / itemsPerPage);
    const totalPastPages = Math.ceil(pastTotal / itemsPerPage);
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            <CreatorSidebar activeItem="meetings" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <CreatorHeader />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Schedule New Meeting Section */}
                        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Meeting</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Agenda</label>
                                <input
                                    type="text"
                                    name="agenda"
                                    placeholder="Enter meeting agenda..."
                                    value={formData.agenda}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleScheduleMeeting}
                                className="w-full py-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-teal-200"
                            >
                                Schedule Meeting
                            </button>
                        </div>

                        {/* Upcoming Meetings Section */}
                        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Meetings</h2>
                            <div className="space-y-4">
                                {upcomingMeetings.length > 0 ? (
                                    upcomingMeetings.map((meeting) => (
                                        <div key={meeting.id} className="border border-gray-200 rounded-lg p-6 hover:border-teal-300 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{meeting.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                                        <CalendarIcon size={16} />
                                                        <span className="font-medium">Date & Time:</span> {new Date(meeting.date).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="font-medium">Scheduler:</span> {meeting.createdBy}
                                                    </p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleJoinMeeting(meeting.id)}
                                                        className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm"
                                                    >
                                                        Join Call
                                                    </button>
                                                    <button
                                                        onClick={() => handleFinishMeeting(meeting.id)}
                                                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm"
                                                    >
                                                        Finish
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelMeeting(meeting.id)}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                                    >
                                                        Cancel
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
                                        <div key={meeting.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors opacity-75">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{meeting.title}</h3>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <CalendarIcon size={16} />
                                                        <span className="font-medium">Date & Time:</span> {new Date(meeting.date).toLocaleString()}
                                                    </p>
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
