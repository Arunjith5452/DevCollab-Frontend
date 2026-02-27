"use client"

import React from 'react';
import { Calendar as CalendarIcon, Check, Copy, X } from 'lucide-react';
import { CreatorSidebar } from '@/shared/common/user-common/Creator-sidebar';
import CreatorHeader from '@/shared/common/user-common/Creator-header';
import { VideoCallComponent } from './video-call-component';
import { Pagination } from '@/shared/common/Pagination';
import CustomDatePicker from '@/shared/common/CustomDatePicker';

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

interface MeetingFormData {
    date: string;
    time: string;
    endTime: string;
    agenda: string;
}

interface CreatorMeetingPageProps {
    projectName?: string;
    formData: MeetingFormData;
    upcomingMeetings: Meeting[];
    pastMeetings: Meeting[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDateChange: (field: string, value: Date | null) => void;
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
    StatusBadge: React.ComponentType<{ status: string }>;
}

export default function CreatorMeetingPage({
    projectName,
    formData,
    upcomingMeetings,
    pastMeetings,
    handleInputChange,
    handleDateChange,
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
    itemsPerPage,
    StatusBadge
}: CreatorMeetingPageProps) {
    const totalUpcomingPages = Math.ceil(upcomingTotal / itemsPerPage);
    const totalPastPages = Math.ceil(pastTotal / itemsPerPage);

    const activeMeeting = upcomingMeetings.find(m => m.id === activeMeetingId) || pastMeetings.find(m => m.id === activeMeetingId);

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
                                    <CustomDatePicker
                                        label="Select Date"
                                        selected={formData.date ? new Date(formData.date) : null}
                                        onChange={(date) => handleDateChange('date', date)}
                                        minDate={new Date()}
                                        placeholderText="Select meeting date"
                                        required
                                    />
                                </div>
                                <div>
                                    <CustomDatePicker
                                        label="Start Time"
                                        selected={formData.time ? new Date(`2000-01-01T${formData.time}`) : null}
                                        onChange={(date) => handleDateChange('time', date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        dateFormat="h:mm aa"
                                        placeholderText="Select start time"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 md:w-1/2">
                                    <CustomDatePicker
                                        label="End Time"
                                        selected={formData.endTime ? new Date(`2000-01-01T${formData.endTime}`) : null}
                                        onChange={(date) => handleDateChange('endTime', date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        dateFormat="h:mm aa"
                                        placeholderText="Select end time"
                                        required
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
                                    required={true}
                                />
                            </div>
                            <button
                                onClick={handleScheduleMeeting}
                                className="w-full py-3 md:py-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-teal-200 mt-2"
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
                                        <div
                                            key={meeting.id}
                                            className="border border-gray-200 rounded-lg p-4 md:p-6 hover:border-teal-300 transition-colors"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

                                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto">
                                                    <button
                                                        onClick={() => handleJoinMeeting(meeting.id)}
                                                        className="flex-1 md:flex-none px-4 md:px-5 py-2 md:py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm whitespace-nowrap text-center"
                                                    >
                                                        Join Call
                                                    </button>

                                                    <button
                                                        onClick={() => handleFinishMeeting(meeting.id)}
                                                        className="p-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                        title="Finish / Mark as Completed"
                                                        aria-label="Finish meeting"
                                                    >
                                                        <Check size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleCancelMeeting(meeting.id)}
                                                        className="p-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Cancel Meeting"
                                                        aria-label="Cancel meeting"
                                                    >
                                                        <X size={18} />
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
                                            className="border border-gray-200 rounded-lg p-4 md:p-6 hover:border-gray-300 transition-colors opacity-75"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex-1 min-w-0 w-full">
                                                    <h3 className="text-lg font-bold text-gray-900 truncate">{meeting.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                                        <CalendarIcon size={16} />
                                                        <span className="font-medium">Time:</span> {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(meeting.date).toLocaleDateString()})
                                                    </p>
                                                </div>
                                                <StatusBadge status={meeting.status} />
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