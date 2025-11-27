import { ArrowLeft, Loader2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetAllTherapistQuery, useDeleteTherapistMutation } from "@/store/api/UsersApi"
import { useState } from "react"

export default function TherapistDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Fetch all therapists and find the specific one
    const { data: apiResponse, isLoading, isError } = useGetAllTherapistQuery()
    const [deleteTherapist, { isLoading: isDeleting }] = useDeleteTherapistMutation()

    const therapist = apiResponse?.data?.find((t: any) => t.id === id)

    const handleDelete = async () => {
        if(!id) return
        try {
            await deleteTherapist(id).unwrap()
            navigate("/admin-dashboard/admin-therapists")
        } catch (error) {
            console.error("Failed to delete therapist:", error)
            alert("Failed to delete therapist. Please try again.")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
        )
    }

    if (isError || !therapist) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 mb-4">Failed to load therapist details.</p>
                <button
                    onClick={() => navigate("/admin-dashboard/admin-therapists")}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                    Back to Therapists
                </button>
            </div>
        )
    }

    // Get initials from name
    const getInitials = (name: string) => {
        const names = name.split(" ")
        return names.length > 1 
            ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            : names[0].substring(0, 2).toUpperCase()
    }

    const status = therapist.clinic ? "Private Practice" : "Individual"

    return (
        <div>
            <button 
                onClick={() => navigate("/admin-dashboard/admin-therapists")} 
                className="cursor-pointer flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Therapists
            </button>

            <div className="bg-card rounded-lg border border-gray-200 p-6 bg-white">
                {/* Header with Actions */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                            {getInitials(therapist.fullName)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{therapist.fullName}</h2>
                            <p className="text-teal-600">{therapist.speciality || "No specialty listed"}</p>
                            {therapist.clinic && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {therapist.clinic.privatePracticeName}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Suspend
                        </button>
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
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
                        <p className="font-semibold text-foreground">
                            {therapist.qualification || "Not specified"}
                        </p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">💼</div>
                            <span className="text-sm text-muted-foreground">Specialty</span>
                        </div>
                        <p className="font-semibold text-foreground">
                            {therapist.speciality || "Not specified"}
                        </p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">🆔</div>
                            <span className="text-sm text-muted-foreground">License Number</span>
                        </div>
                        <p className="font-semibold text-foreground">
                            {therapist.licenseNumber || "Not specified"}
                        </p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">⏰</div>
                            <span className="text-sm text-muted-foreground">Session Duration</span>
                        </div>
                        <p className="font-semibold text-foreground">
                            {therapist.defaultSessionDuration ? `${therapist.defaultSessionDuration} minutes` : "Not set"}
                        </p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">🌍</div>
                            <span className="text-sm text-muted-foreground">Time Zone</span>
                        </div>
                        <p className="font-semibold text-foreground">
                            {therapist.timeZone || "Not set"}
                        </p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-teal-500">📋</div>
                            <span className="text-sm text-muted-foreground">Practice Type</span>
                        </div>
                        <p className="font-semibold text-foreground">{status}</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <div className="bg-card border border-gray-200 bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                    <p className="text-2xl font-bold text-foreground">{therapist._count?.clients}</p>
                </div>
                <div className="bg-card border border-gray-200 bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Appointments</p>
                    <p className="text-2xl font-bold text-foreground">{therapist._count?.appointments}</p>
                </div>
                <div className="bg-card border border-gray-200 bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Practice Status</p>
                    <span 
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            status === "Private Practice"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                        }`}
                    >
                        {status}
                    </span>
                </div>
                <div className="bg-card border border-gray-200 bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete {therapist.fullName}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}