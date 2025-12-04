import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mail,
  Phone,
  TrendingUp,
  Clock,
  AlertTriangle,
  Loader2,
  Brain,
  Plus,
} from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useUserId } from "@/hooks/useUserId";
import {
  useAddSessionHistoryMutation,
  useGetClientByIdQuery,
} from "@/store/api/ClientsApi";
import {
  useAddClinicClientSessionHistoryMutation,
  useGetClinicClientByIdQuery,
} from "@/store/api/ClinicClientsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { useSendSessionMutation } from "@/store/api/BaseApi/AiApi";
import CrisisHistory from "./CrisisHistory";
import SessionHistory from "./SessionHistory";
import TreatmentProgressCard from "./TreatmentProgressCard";
import TherapistSelector from "./TherapistSeletor";
import { StatusBadge } from "@/components/ClientManagement/utilityComponents";
import TherapistClientDetailsSkeleton from "@/components/Skeleton/TherapistClientDetailsSkeleton";

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
  const userType = useAppSelector((state) => state.auth.userType);
  const userId = useUserId();
  const navigate = useNavigate();
  const [sendSession] = useSendSessionMutation();
  const [addClinicClientSessionHistory] =
    useAddClinicClientSessionHistoryMutation();
  const [addedSessionbytherapist] = useAddSessionHistoryMutation();

  const therapistQuery = useGetClientByIdQuery(
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? {
          therapistId: userId,
          clientId: id!,
        }
      : skipToken
  );
  const clinicQuery = useGetClinicClientByIdQuery(
    userType === "CLINIC"
      ? {
          clinicId: userId,
          clientId: id!,
        }
      : skipToken
  );

  const client =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistQuery.data
      : clinicQuery.data;

  const isLoading =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistQuery.isLoading
      : therapistQuery.isLoading || clinicQuery.isLoading;
  const error =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistQuery.error
      : therapistQuery.error || clinicQuery.error;
  // const refetch =
  //   userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
  //     ? therapistQuery.refetch
  //     : clinicQuery.refetch;

  const therapistId =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? client?.therapist?.id
      : client?.clinicId;
  const treatmentProgress = client?.treatmentProgress?.entries || [];
  console.log("Client:", treatmentProgress);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [, setAudioURL] = useState<string | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentProgressMetrics, setCurrentProgressMetrics] = useState([
    { label: "Reduce anxiety symptoms", progress: 68 },
    { label: "Improve coping mechanisms", progress: 80 },
    { label: "Better sleep patterns", progress: 45 },
  ]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);
  const recordedAudioBlobRef = useRef<Blob | null>(null);

  // START RECORDING + TIMER
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) =>
        audioChunksRef.current.push(event.data);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        recordedAudioBlobRef.current = audioBlob;
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Send to AI for analysis instead of just cloud storage
        toast.success("Recording finished! Analyzing session with AI...");
        await sendSessionToAI(audioBlob, elapsed);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setElapsed(0);
      setSessionCompleted(false);
      setIsProcessing(false);
      setIsAnalyzing(false);
      setAiInsights(null);
      toast.success("Session started");

      intervalRef.current = window.setInterval(
        () => setElapsed((prev) => prev + 1),
        1000
      );
    } catch {
      toast.error("Microphone access denied");
    }
  };

  // STOP RECORDING + TIMER
  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsProcessing(true);
    setIsAnalyzing(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop all tracks
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());
  };

  const sendSessionToAI = async (audioBlob: Blob, duration: number) => {
    setIsProcessing(true);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append(
      "file",
      new File([audioBlob], "session_audio.webm", { type: "audio/webm" })
    );
    formData.append("duration", duration.toString());

    try {
      const res = await sendSession(formData).unwrap();
      const aiInsight = res?.data?.insight;
      if (aiInsight && id && userId) {
        setAiInsights(aiInsight);
        toast.success("AI analysis completed!");

        if (userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST") {
          await addedSessionbytherapist({
            clientId: id,
            therapistId: userId,
            data: {
              sessionDate: new Date().toISOString(),
              crisisDate: "Individual Therapy",
              duration,
              notes: aiInsight,
            },
          }).unwrap();
        } else {
          await addClinicClientSessionHistory({
            clientId: id,
            clinicId: userId,
            sessionData: {
              sessionDate: new Date().toISOString(),
              sessionType: "Individual Therapy",
              duration,
              notes: aiInsight,
            },
          }).unwrap();
        }
      }

      if (res.updatedMetrics) {
        setCurrentProgressMetrics(res.updatedMetrics);
      }

      setSessionCompleted(true);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      const updatedMetrics = currentProgressMetrics.map((metric) => ({
        ...metric,
        progress: Math.min(
          100,
          metric.progress + Math.floor(Math.random() * 5) + 1
        ),
      }));
      setCurrentProgressMetrics(updatedMetrics);

      setSessionCompleted(true);
    } finally {
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const resetSession = () => {
    setSessionCompleted(false);
    setElapsed(0);
    setAiInsights(null);
    setIsProcessing(false);
    setIsAnalyzing(false);
  };

  const handleGoBack = () => navigate(-1);

  if (isLoading) {
    return <TherapistClientDetailsSkeleton />;
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-2">
            Failed to load client
          </p>
          <p className="text-gray-600 mb-4">Please try again later</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const isThisTherapist = therapistId === userId;
  return (
    <div className="min-h-screen">
      <div className="px-6 py-8">
        {/* Client Header Card */}
        <div>
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="text-[#A7A9AC] cursor-pointer mb-5"
          >
            Client /{" "}
            <span className="text-website-primary-color  capitalize">
              {client.name}
            </span>
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col  lg:flex-row justify-between gap-8">
            {/* Client Info */}
            <div className="flex gap-6 flex-1 ">
              <div className="size-[64px] bg-[#96C75E1A] rounded-full text-[#3FDCBF] flex items-center justify-center flex-shrink-0">
                <span className="text-[#3FDCBF] text-[28px] font-semibold">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {client.name}
                  </h1>
                  <span>
                    <StatusBadge status={client.status} />
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    Health Issues
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {client.healthIssues?.map((issue: string) => (
                      <span
                        key={issue}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isThisTherapist ? (
              <div className="flex flex-col items-center justify-center gap-4 lg:min-w-[280px]">
                <div
                  className={`w-full rounded-xl p-6 text-center transition-all ${
                    isRecording
                      ? "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
                      : isAnalyzing
                      ? "bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200"
                      : isProcessing
                      ? "bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200"
                      : sessionCompleted
                      ? "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200"
                      : "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isAnalyzing ? (
                      <Brain
                        size={16}
                        className="text-purple-600 animate-pulse"
                      />
                    ) : isProcessing ? (
                      <Loader2
                        size={16}
                        className="text-orange-600 animate-spin"
                      />
                    ) : (
                      <Clock
                        size={16}
                        className={
                          isRecording
                            ? "text-red-600"
                            : sessionCompleted
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      />
                    )}
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      {isRecording
                        ? "Session in Progress"
                        : isAnalyzing
                        ? "AI Analysis"
                        : isProcessing
                        ? "Processing Session"
                        : sessionCompleted
                        ? "Session Completed"
                        : "Ready to Start"}
                    </p>
                  </div>
                  <p
                    className={`text-4xl font-bold font-mono ${
                      isRecording
                        ? "text-red-600"
                        : isAnalyzing
                        ? "text-purple-600"
                        : isProcessing
                        ? "text-orange-600"
                        : sessionCompleted
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {formatTime(elapsed)}
                  </p>
                  {isAnalyzing && (
                    <p className="text-xs text-purple-600 mt-2 font-medium">
                      AI is analyzing session...
                    </p>
                  )}
                  {isProcessing && !isAnalyzing && (
                    <p className="text-xs text-orange-600 mt-2 font-medium">
                      Uploading session...
                    </p>
                  )}
                  {sessionCompleted && aiInsights && (
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      AI Insights Ready!
                    </p>
                  )}
                </div>

                {/* Button Logic - Fixed state handling */}
                {!isRecording && !isProcessing && !sessionCompleted ? (
                  // Initial state - two separate buttons
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={startRecording}
                      className="w-full font-semibold rounded-xl px-8 py-2.5  transition-all transform  border border-[#3FDCBF] cursor-pointer text-white bg-[#3FDCBF]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        Start New Session
                      </span>
                    </button>
                  </div>
                ) : isRecording ? (
                  // During recording - show stop button
                  <button
                    onClick={stopRecording}
                    className="w-full font-semibold rounded-xl px-8 py-2.5  transition-all transform  border border-[#D45B53] cursor-pointer text-white bg-[#D45B53]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      End Session
                    </span>
                  </button>
                ) : isProcessing || isAnalyzing ? (
                  // During processing/analyzing - show disabled button
                  <button
                    disabled
                    className="w-full font-semibold rounded-xl px-8 py-2.5  transition-all transform  border border-[#D45B53] cursor-pointer text-white bg-[#D45B53]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isAnalyzing ? "AI Analyzing..." : "Processing..."}
                    </span>
                  </button>
                ) : sessionCompleted ? (
                  // After completion - show option to start new session
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={resetSession}
                      className="w-full font-semibold rounded-xl px-8 py-2.5  transition-all transform  border border-[#3FDCBF] cursor-pointer text-white bg-[#3FDCBF]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        Start New Session
                      </span>
                    </button>

                    <button className="w-full  bg-[#3FDCBF1A]  text-[#3FDCBF] font-semibold rounded-xl px-8 py-2.5  transition-all transform  border border-[#3FDCBF] cursor-pointer">
                      <span className="flex items-center justify-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Update Treatment Progress
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex  flex-col gap-2 ">
                <span className="text-[#7E8086]">Assigned Doctor</span>
                <TherapistSelector />
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6">
          <div className="animate-in slide-in-from-bottom-3 duration-500 ease-out">
            <TreatmentProgressCard
              treatmentProgress={treatmentProgress}
              clientId={id}
              isThisTherapist={isThisTherapist}
              aiInsight={aiInsights}
            />
          </div>
          <CrisisHistory
            isThisTherapist={isThisTherapist}
            clientId={id}
            therapistId={userId}
            crisisHistory={client?.crisisHistories}
          />
          <SessionHistory
            isThisTherapist={isThisTherapist}
            clientId={id}
            therapistId={userId}
            userType={userType}
            addedSessionbytherapist={addedSessionbytherapist}
            sessionHistory={client?.sessionHistory}
            addClinicClientSessionHistory={addClinicClientSessionHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default TherapistClientDetails;
