import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface TherapistDetailsProps {
    therapistId: string
    onBack: () => void
}

export default function TherapistDetails() {
    // Mock therapist data
    const therapist = {
        name: "Dr. Michael Chen",
        specialty: "Cognitive Behavioral Therapy",
        email: "michaelchen@cliniq.com",
        phone: "+1 (555) 123-4567",
        fullName: "Dr. Michael Chen",
        qualifications: "PhD in Psychology, Certified CBT Therapist",
        practicalName: "Abc",
        availability: "Everyday",
        totalPatients: 12,
        totalSessions: 24,
        totalTherapists: 5,
        accountStatus: "Active",
        practiceType: "Private Practice",
    }

    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate("/admin-dashboard/admin-therapists")} className="cursor-pointer flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Back to Therapists
            </button>

            <div className="bg-card rounded-lg border border-gray-200 p-6 bg-white">
                {/* Header with Actions */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600"></div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{therapist.name}</h2>
                            <p className="text-teal-600">{therapist.specialty}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 transition-colors cursor-pointer">
                            Suspend
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors cursor-pointer">
                            Delete
                        </button>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">👤</div>
                            <span className="text-sm text-muted-foreground">Full Name</span>
                        </div>
                        <p className="font-semibold text-foreground">{therapist.fullName}</p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">📧</div>
                            <span className="text-sm text-muted-foreground">Email Address</span>
                        </div>
                        <p className="font-semibold text-foreground">{therapist.email}</p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">📱</div>
                            <span className="text-sm text-muted-foreground">Phone Number</span>
                        </div>
                        <p className="font-semibold text-foreground">{therapist.phone}</p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">🎓</div>
                            <span className="text-sm text-muted-foreground">Qualifications</span>
                        </div>
                        <p className="font-semibold text-foreground">{therapist.qualifications}</p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">💼</div>
                            <span className="text-sm text-muted-foreground">Specialty</span>
                        </div>
                        <p className="font-semibold text-foreground">{therapist.specialty}</p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">⏰</div>
                            <span className="text-sm text-muted-foreground">Availability</span>
                        </div>
                        <p className="font-semibold text-foreground">{therapist.availability}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <div className="bg-card border border-gray-200 bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Therapist</p>
                    <p className="text-2xl font-bold text-foreground">{therapist.totalTherapists}</p>
                </div>
                <div className="bg-card border border-gray-200 bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                    <p className="text-2xl font-bold text-foreground">{therapist.totalPatients}</p>
                </div>
                <div className="bg-card border border-gray-200 bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Sessions (L30 Days)</p>
                    <p className="text-2xl font-bold text-foreground">{therapist.totalSessions}</p>
                </div>
                <div className="bg-card border border-gray-200 bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {therapist.accountStatus}
                    </span>
                </div>
            </div>
        </div>
    )
}
