"use client"

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useUserStore';
import PageLoader from '@/shared/common/LoadingComponent';
import api from '@/lib/axios';


import CreatorMeetingPage from './creator-meeting-page';
import ContributorMeetingPage from './contributor-meeting-page';
import { useProjectStore } from '@/store/useProjectStore';

interface Meeting {
  id: string;
  title: string;
  date: string;
  status: string;
  link?: string;
  createdBy: string;
}

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


  /* Pagination States */
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [upcomingTotal, setUpcomingTotal] = useState(0);
  const [pastTotal, setPastTotal] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    agenda: ''
  })

  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  const [pastMeetings, setPastMeetings] = useState<any[]>([]);

  const isCreator = forcedRole ? forcedRole === 'creator' : user?.role === 'creator';

  const fetchMeetings = async (type: 'upcoming' | 'past', page: number) => {
    if (!projectId) return;
    try {
      const statusParam = type === 'upcoming' ? 'scheduled,ongoing' : 'completed,cancelled';
      const res = await api.get(`/api/projects/${projectId}/meetings`, {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          status: statusParam
        }
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
          const projectRes = await api.get(`/api/projects/${projectId}`);
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

  // Initial load logic moved to effects above

  // Save meetings to localStorage whenever they change - simplified or removed as it paginates now
  // Leaving it out for now as paginated data in localstorage is tricky/less useful

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleScheduleMeeting = async () => {
    if (!formData.date || !formData.time || !projectId) {
      alert('Please select date, time and ensure project is loaded')
      return;
    }

    try {
      await api.post('/api/meetings', {
        projectId,
        title: formData.agenda || 'New Meeting',
        date: `${formData.date}T${formData.time}`,
        type: 'group'
      });

      // Refresh upcoming meetings
      fetchMeetings('upcoming', upcomingPage);

      setFormData({
        date: '',
        time: '',
        agenda: ''
      });

      alert('Meeting scheduled successfully!')
    } catch (err) {
      console.error("Failed to schedule meeting", err);
      alert("Failed to schedule meeting");
    }
  }

  const handleEditMeeting = (id: string) => {
    console.log('Edit meeting:', id);
  }

  const handleCancelMeeting = async (meetingId: string) => {
    if (!projectId || !confirm("Are you sure you want to cancel this meeting?")) return;
    try {
      await api.patch(`/api/meetings/${meetingId}/status`, { status: 'cancelled' });
      // Refresh meetings list
      fetchMeetings('upcoming', upcomingPage);
      fetchMeetings('past', pastPage);

      alert("Meeting cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel meeting", err);
      alert("Failed to cancel meeting");
    }
  }

  const handleFinishMeeting = async (meetingId: string) => {
    if (!projectId) return;
    try {
      await api.patch(`/api/meetings/${meetingId}/status`, { status: 'completed' });
      // Refresh meetings list
      fetchMeetings('upcoming', upcomingPage);
      fetchMeetings('past', pastPage);

      alert("Meeting marked as completed");
    } catch (err) {
      console.error("Failed to finish meeting", err);
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
        handleCancelMeeting={handleCancelMeeting as any}
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
    />
  );
}