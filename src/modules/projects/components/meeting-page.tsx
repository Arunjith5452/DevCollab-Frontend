"use client"

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useUserStore';
import PageLoader from '@/shared/common/LoadingComponent';
import { getProjectMeetings, createMeeting, updateMeetingStatus, projectDetails } from '../services/project.api';


import CreatorMeetingPage from './creator-meeting-page';
import ContributorMeetingPage from './contributor-meeting-page';
import { useProjectStore } from '@/store/useProjectStore';

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

export const StatusBadge = ({ status }: { status: string }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'scheduled':
        return 'Scheduled';
      case 'ongoing':
        return 'Ongoing';
      default:
        return status;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
      {getStatusText()}
    </span>
  );
};

export default function MeetingsPage({
  forcedRole,
  initialMeetings = [],
  projectId: propProjectId
}: {
  forcedRole?: 'creator' | 'contributor',
  initialMeetings?: Meeting[],
  projectId?: string
}) {
  const projectId = propProjectId;
  const { user, fetchUser } = useAuthStore();
  const { setProject } = useProjectStore();
  const [isStoreLoading, setIsStoreLoading] = useState(true);

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [upcomingTotal, setUpcomingTotal] = useState(0);
  const [pastTotal, setPastTotal] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    endTime: '',
    agenda: ''
  })

  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);

  const isCreator = forcedRole ? forcedRole === 'creator' : user?.role === 'creator';

  const fetchMeetings = async (type: 'upcoming' | 'past', page: number) => {
    if (!projectId) return;
    try {
      const statusParam = type === 'upcoming' ? 'scheduled,ongoing' : 'completed,cancelled';
      const res = await getProjectMeetings(projectId, {
        page,
        limit: ITEMS_PER_PAGE,
        status: statusParam
      });

      const meetings = res.data;
      const total = res.data.length;

      if (type === 'upcoming') {
        setUpcomingMeetings(meetings);
        setUpcomingTotal(total);
      } else {
        setPastMeetings(meetings);
        setPastTotal(total);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type} meetings`, err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchUser();
        if (projectId) {
          const projectRes = await projectDetails(projectId);
          if (projectRes.data) {
            setProject({ id: projectRes.data.id, title: projectRes.data.title });
          }
        }
      } catch (e) { console.error(e); } finally { setIsStoreLoading(false); }
    };
    init();
  }, [projectId, fetchUser]);

  // Handle page changes
  useEffect(() => {
    if (projectId) fetchMeetings('upcoming', upcomingPage);
  }, [projectId, upcomingPage]);

  useEffect(() => {
    if (projectId) fetchMeetings('past', pastPage);
  }, [projectId, pastPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleScheduleMeeting = async () => {
    if (!formData.date || !formData.time || !formData.endTime || !projectId) {
      alert('Please select date, start time, end time and ensure project is loaded')
      return;
    }

    if (!formData.agenda.trim()) {
      alert('Please enter a meeting agenda');
      return;
    }

    // Validate that end time is after start time
    const startDateTime = new Date(`${formData.date}T${formData.time}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      alert('End time must be after start time');
      return;
    }

    try {
      await createMeeting({
        projectId,
        title: formData.agenda || 'New Meeting',
        date: `${formData.date}T${formData.time}`,
        endTime: `${formData.date}T${formData.endTime}`,
        type: 'group'
      });

      // Refresh upcoming meetings
      fetchMeetings('upcoming', upcomingPage);

      setFormData({
        date: '',
        time: '',
        endTime: '',
        agenda: ''
      });

      alert('Meeting scheduled successfully!')
    } catch (err) {
      console.error("Failed to schedule meeting", err);
      alert("Failed to schedule meeting");
    }
  }

  const handleFinishMeeting = async (meetingId: string) => {
    if (!projectId) return;

    if (!confirm("Are you sure you want to finish this meeting?")) return;

    try {
      const meetingToFinish = upcomingMeetings.find(m => m.id === meetingId);
      if (!meetingToFinish) return;

      setUpcomingMeetings(prev => prev.filter(m => m.id !== meetingId));
      setUpcomingTotal(prev => prev - 1);

      const finishedMeeting = { ...meetingToFinish, status: 'completed' };
      setPastMeetings(prev => {
        const exists = prev.some(m => m.id === meetingId);
        if (exists) {
          return prev.map(m => m.id === meetingId ? finishedMeeting : m);
        } else {
          return [finishedMeeting, ...prev];
        }
      });
      setPastTotal(prev => {
        const exists = pastMeetings.some(m => m.id === meetingId);
        return exists ? prev : prev + 1;
      });

      await updateMeetingStatus(meetingId, 'completed');

      console.log("Meeting marked as completed");

      setTimeout(() => {
        fetchMeetings('upcoming', upcomingPage);
        fetchMeetings('past', pastPage);
      }, 500)

    } catch (err) {
      console.error("Failed to finish meeting", err);
      fetchMeetings('upcoming', upcomingPage);
      fetchMeetings('past', pastPage);
      alert("Failed to finish meeting. Please try again.");
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    if (!projectId || !confirm("Are you sure you want to cancel this meeting?")) return;

    try {
      const meetingToCancel = upcomingMeetings.find(m => m.id === meetingId);
      if (!meetingToCancel) return;

      setUpcomingMeetings(prev => prev.filter(m => m.id !== meetingId));
      setUpcomingTotal(prev => prev - 1);

      const cancelledMeeting = { ...meetingToCancel, status: 'cancelled' };
      setPastMeetings(prev => {
        const exists = prev.some(m => m.id === meetingId);
        if (exists) {
          return prev.map(m => m.id === meetingId ? cancelledMeeting : m);
        } else {
          return [cancelledMeeting, ...prev];
        }
      });
      setPastTotal(prev => {
        const exists = pastMeetings.some(m => m.id === meetingId);
        return exists ? prev : prev + 1;
      });

      await updateMeetingStatus(meetingId, 'cancelled');

      console.log("Meeting cancelled successfully");

      setTimeout(() => {
        fetchMeetings('upcoming', upcomingPage);
        fetchMeetings('past', pastPage);
      }, 500)

    } catch (err) {
      console.error("Failed to cancel meeting", err);
      fetchMeetings('upcoming', upcomingPage);
      fetchMeetings('past', pastPage);
      alert("Failed to cancel meeting. Please try again.");
    }
  };


  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const userId = user?.userId || `guest-${Math.random().toString(36).substr(2, 9)}`;

  const handleJoinMeeting = (id: string) => {
    setActiveMeetingId(id);
  };

  if (isStoreLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><PageLoader /></div>;
  }

  if (isCreator) {
    return (
      <CreatorMeetingPage
        formData={formData}
        upcomingMeetings={upcomingMeetings}
        pastMeetings={pastMeetings}
        handleInputChange={handleInputChange}
        handleScheduleMeeting={handleScheduleMeeting}
        handleJoinMeeting={handleJoinMeeting}
        handleCancelMeeting={handleCancelMeeting}
        handleFinishMeeting={handleFinishMeeting}
        activeMeetingId={activeMeetingId}
        userId={userId}
        userName={user?.name || 'Creator'}
        setActiveMeetingId={setActiveMeetingId}
        upcomingPage={upcomingPage}
        pastPage={pastPage}
        upcomingTotal={upcomingTotal}
        pastTotal={pastTotal}
        setUpcomingPage={setUpcomingPage}
        setPastPage={setPastPage}
        itemsPerPage={ITEMS_PER_PAGE}
        StatusBadge={StatusBadge}
      />
    );
  }

  return (
    <ContributorMeetingPage
      upcomingMeetings={upcomingMeetings}
      pastMeetings={pastMeetings}
      handleJoinMeeting={handleJoinMeeting}
      activeMeetingId={activeMeetingId}
      userId={userId}
      userName={user?.name || 'Contributor'}
      setActiveMeetingId={setActiveMeetingId}
      upcomingPage={upcomingPage}
      pastPage={pastPage}
      upcomingTotal={upcomingTotal}
      pastTotal={pastTotal}
      setUpcomingPage={setUpcomingPage}
      setPastPage={setPastPage}
      itemsPerPage={ITEMS_PER_PAGE}
      StatusBadge={StatusBadge}
    />
  );
}