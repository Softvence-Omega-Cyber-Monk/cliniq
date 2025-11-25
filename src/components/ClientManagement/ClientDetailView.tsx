import React, { useState, useRef, useEffect } from "react";
import { Client } from "./types";
import {
  IconUser,
  StatusBadge,
} from "./utilityComponents";

import { useSendSessionMutation } from "@/store/api/BaseApi/AiApi";

const ClientDetailView: React.FC<{
  client: Client;
  onBack: () => void;
  onOpenModal: () => void;
}> = ({ client, onBack, onOpenModal }) => {
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sendSession] = useSendSessionMutation();

  // Audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // -------------------------
  // SESSION TIMER
  // -------------------------
  useEffect(() => {
    if (!isSessionActive || isPaused) return;

    const interval = setInterval(() => {
      setSessionTimer((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, isPaused]);

  // -------------------------
  // RECORDING TIMER
  // -------------------------
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  // -------------------------
  // FORMAT TIME
  // -------------------------
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // -------------------------
  // AUDIO RECORDING
  // -------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioChunksRef.current = [];
      setRecordingTime(0);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(audioBlob));
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording failed:", err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // -------------------------
  // SEND AUDIO TO API
  // -------------------------
  const handleSendAudio = async () => {
    if (!audioUrl || audioChunksRef.current.length === 0) return;

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const audioFile = new File([audioBlob], "session_audio.webm", { type: "audio/webm" });

    const payload = {
      data: {
        file: audioFile,
      },
    };

    try {
      await sendSession(payload);
      console.log("Audio session sent successfully.");
    } catch (error) {
      console.error("Failed to send session:", error);
    }
  };

  // -------------------------
  // DELETE AUDIO
  // -------------------------
  const deleteAudio = () => {
    setAudioUrl(null);
    audioChunksRef.current = [];
  };

  // -------------------------
  // SESSION CONTROLS
  // -------------------------
  const startSession = async () => {
    setAudioUrl(null);
    setSessionTimer(0);
    setIsSessionActive(true);
    setIsPaused(false);

    await startRecording();
  };

  const endSession = () => {
    setIsSessionActive(false);
    setIsPaused(false);

    if (isRecording) stopRecording();

    // Automatically send audio after stopping
    setTimeout(() => {
      handleSendAudio();
    }, 500);
  };

  const togglePause = () => {
    setIsPaused((p) => !p);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* BACK BUTTON */}
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-emerald-600 mb-6 flex items-center space-x-1 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm">Clients / {client.name}</span>
        </button>

        {/* HEADER */}
        <header className="bg-white p-6 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <IconUser />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">{client.name}</h1>
                <StatusBadge status={client.status} />
              </div>

              <p className="text-gray-500 text-sm mt-1">{client.email}</p>
              <p className="text-gray-500 text-sm">{client.phone}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {client.treatmentTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SESSION CONTROLS */}
          <div className="mt-6 md:mt-0 flex flex-col space-y-3">
            {!isSessionActive ? (
              <button
                onClick={startSession}
                className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600"
              >
                + Start New Session
              </button>
            ) : (
              <div className="bg-white rounded-lg p-3 shadow-inner border border-gray-200 space-y-3">
                {/* SESSION TIMER */}
                <div className="flex justify-center items-center space-x-3">
                  <span className="text-xl font-mono text-red-600">
                    {formatTime(sessionTimer)}
                  </span>

                  <button
                    onClick={togglePause}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      isPaused ? "bg-emerald-500 text-white" : "bg-yellow-500 text-white"
                    }`}
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </button>

                  <button
                    onClick={endSession}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Stop
                  </button>
                </div>

                {/* RECORDING STATUS */}
                {isRecording && (
                  <div className="flex justify-center text-sm text-red-600 font-mono">
                    Recording... {formatTime(recordingTime)}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onOpenModal}
              className="px-4 py-2 border border-emerald-500 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50"
            >
              Update Treatment Progress
            </button>
          </div>
        </header>

        {/* AUDIO PLAYBACK + DELETE */}
        {audioUrl && !isRecording && (
          <div className="bg-white p-4 mb-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-2">Recorded Session</h3>

            <audio controls src={audioUrl} className="w-full" />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleSendAudio}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700"
              >
                Send to AI
              </button>

              <button
                onClick={deleteAudio}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Delete Recording
              </button>
            </div>
          </div>
        )}

        {/* CRISIS HISTORY, TREATMENT PROGRESS, SESSION HISTORY */}
        {/* ...Keep your existing sections as-is... */}
      </div>
    </div>
  );
};

export default ClientDetailView;
