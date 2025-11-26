import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  IconUser,
  StatusBadge,
} from "@/components/ClientManagement/utilityComponents";
import { useUserId } from "@/hooks/useUserId";
import { useGetClientByIdQuery } from "@/store/api/ClientsApi";

// Format seconds to HH:MM:SS
const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const TherapistClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = useUserId();
  const navigate = useNavigate();

  const {
    data: client,
    isLoading,
    error,
  } = useGetClientByIdQuery({
    therapistId: userId,
    clientId: id!,
  });
  console.log(client);

  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);

  // -------------------------
  // START RECORDING + TIMER
  // -------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) =>
        audioChunksRef.current.push(event.data);

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        toast.success("Recording finished!");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setElapsed(0);
      toast.success("Session started");

      intervalRef.current = window.setInterval(
        () => setElapsed((prev) => prev + 1),
        1000
      );
    } catch {
      toast.error("Microphone access denied");
    }
  };

  // -------------------------
  // STOP RECORDING + TIMER + SEND TO CLOUD
  // -------------------------
  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Send to cloud after recording stops
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const formData = new FormData();
      formData.append("therapistId", userId!);
      formData.append("clientId", id!);
      formData.append(
        "file",
        new File([audioBlob], "session_audio.webm", { type: "audio/webm" })
      );
      formData.append("duration", elapsed.toString());

      try {
        const res = await fetch("https://cliniq-server.onrender.com/sessions", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to save session");
        toast.success("Session saved to cloud!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to save session");
      }
    }
  };

  const handleGoBack = () => navigate(-1);

  if (isLoading) return <div className="p-6">Loading client...</div>;
  if (error || !client)
    return <div className="p-6">Failed to load client.</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="text-gray-500 hover:text-emerald-600 mb-6 flex items-center space-x-1"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="text-sm">Clients / {client.name}</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left Info */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
            <IconUser />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-800">
                {client.name}
              </h1>
              <StatusBadge status={client.status} />
            </div>
            <div className="mt-1 space-y-0.5 text-sm text-gray-600">
              <span>{client.email}</span>
              <span>{client.phone}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {client.healthIssues.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Session Panel */}
        <div className="w-full md:w-auto flex flex-col items-center gap-3">
          <div className="border border-red-200 rounded-lg py-3 px-6 text-center">
            <p className="text-xs text-gray-600">Session in Progress</p>
            <p className="text-red-600 text-xl font-mono font-semibold">
              {formatTime(elapsed)}
            </p>
          </div>

          <div className="flex gap-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium rounded-lg px-4 py-2"
              >
                ▶ Start
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-2"
              >
                ⏹ End
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <section className="bg-white mt-6 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Treatment Progress
        </h2>
        <p className="text-gray-500 italic">Insights will appear here later.</p>
      </section>

      <section className="bg-white mt-6 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Session History
        </h2>
        <p className="text-gray-500 italic">No sessions recorded yet.</p>
      </section>
    </div>
  );
};

export default TherapistClientDetails;
