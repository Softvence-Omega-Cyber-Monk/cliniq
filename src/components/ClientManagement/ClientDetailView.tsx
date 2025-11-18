import React, { useState } from 'react';
import { Client } from './types';
import { IconUser, StatusBadge, SeverityBadge, ProgressBar } from './utilityComponents';
import SessionTimelineItem from './SessionTimelineItem';

const ClientDetailView: React.FC<{ client: Client, onBack: () => void, onOpenModal: () => void }> = ({ client, onBack, onOpenModal }) => {
  const [sessionTimer, setSessionTimer] = useState(0); // seconds
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Timer logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSessionActive && !isPaused) {
      interval = setInterval(() => {
        setSessionTimer(t => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive, isPaused]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const startSession = () => {
    if (!isSessionActive) {
      setSessionTimer(0);
      setIsSessionActive(true);
      setIsPaused(false);
    }
  };

  const endSession = () => {
    if (isSessionActive) {
      setIsSessionActive(false);
      setIsPaused(false);
      // In a real app, you would save the session data here
      console.log(`Session ended for ${client.name}. Duration: ${formatTime(sessionTimer)}`);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb / Back button */}
        <button onClick={onBack} className="text-gray-500 hover:text-emerald-600 mb-6 flex items-center space-x-1 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-sm">Clients / {client.name}</span>
        </button>

        {/* Header and Session Controls */}
        <header className="bg-white p-6 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <IconUser />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-800">{client.name}</h1>
                <StatusBadge status={client.status} />
              </div>
              <p className="text-gray-500 text-sm mt-1">{client.email}</p>
              <p className="text-gray-500 text-sm">{client.phone}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {client.treatmentTags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col space-y-2 w-full md:w-auto">
            {!isSessionActive ? (
              <button
                onClick={startSession}
                className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition shadow-md w-full md:w-auto"
              >
                + Start New Session
              </button>
            ) : (
              <div className="bg-white rounded-lg p-3 shadow-inner border border-gray-200">
                <div className="flex justify-center items-center space-x-3">
                  <span className="text-xl font-mono text-red-600">{formatTime(sessionTimer)}</span>
                  <button onClick={togglePause} className={`px-3 py-1 text-sm font-semibold rounded-lg transition flex items-center space-x-1 ${isPaused ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}>
                    {isPaused ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v10l7-5-7-5z"></path></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 5h2v10H6V5zm6 0h2v10h-2V5z"></path></svg>
                    )}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                  <button onClick={endSession} className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition">
                    Stop
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={onOpenModal}
              className="px-4 py-2 border border-emerald-500 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition w-full md:w-auto"
            >
              Update Treatment Progress
            </button>
          </div>
        </header>

        {/* Crisis History */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <h2 className="text-xl font-semibold text-gray-800">Crisis History</h2>
          </div>
          {client.crisisHistory.map(event => (
            <div key={event.id} className="border-l-4 border-red-400 p-4 bg-red-50 mb-4 rounded-lg relative">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{event.title}</h3>
                <SeverityBadge severity={event.severity} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{event.date}</p>
              <div className="mt-3 text-sm">
                <p className="font-medium text-gray-700">Action Taken:</p>
                <p className="text-gray-600 mt-1">{event.actionsTaken}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {event.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {client.crisisHistory.length === 0 && (
            <p className="text-gray-500 italic">No crisis events recorded.</p>
          )}
        </section>

        {/* Treatment Progress */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Treatment Progress</h2>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              AI-Generated Insights
            </span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              **AI Analysis & Recommendations:** Based on recent sessions, **{client.name}** has shown consistent improvement in managing anxiety triggers. Her coping mechanisms are strengthening, particularly with breathing exercises. Recommend continued focus on workplace stress management and gradual exposure therapy for panic situations.
            </p>
          </div>

          <div className="space-y-4">
            {client.progressItems.map(item => (
              <ProgressBar key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </section>

        {/* Session History */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Session History</h2>
            <span className="text-sm text-gray-500">{client.sessionHistory.length} total sessions</span>
          </div>

          <div className="relative">
            {client.sessionHistory.length > 0 ? (
              client.sessionHistory.map((session) => (
                <SessionTimelineItem key={session.id} session={session} />
              ))
            ) : (
              <p className="text-gray-500 italic">No session history available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientDetailView;
