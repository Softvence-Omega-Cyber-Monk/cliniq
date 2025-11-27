import { useState } from "react"
import { ChevronDown, Search, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useGetAllTherapistQuery } from "@/store/api/UsersApi"

interface Therapist {
    id: string
    fullName: string
    speciality: string | null
    clinic: {
        id: string
        privatePracticeName: string
    } | null
    _count: {
        clients: number
        appointments: number
    }
    email: string
    phone: string
    licenseNumber: string | null
    qualification: string | null
}

export default function TherapistManagement() {
    const [filterType, setFilterType] = useState("All Type")
    const [searchQuery, setSearchQuery] = useState("")
    
    const navigate = useNavigate()
    
    // Fetch therapists from API
    const { data: apiResponse, isLoading, isError } = useGetAllTherapistQuery({})

    const handleViewDetails = (id: string) => {
        navigate(`/admin-dashboard/admin-therapists/${id}`)
    }

    // Get initials from name
    const getInitials = (name: string) => {
        const names = name.split(" ")
        return names.length > 1 
            ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            : names[0].substring(0, 2).toUpperCase()
    }

    // Generate color for avatar based on id
    const getAvatarColor = (id: string) => {
        const colors = [
            "bg-slate-700",
            "bg-blue-600",
            "bg-green-600",
            "bg-purple-600",
            "bg-pink-600",
            "bg-indigo-600"
        ]
        const index = id.charCodeAt(0) % colors.length
        return colors[index]
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
        )
    }

    if (isError || !apiResponse) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Failed to load therapists. Please try again.</p>
            </div>
        )
    }

    const therapists: Therapist[] = apiResponse.data || []

    // Filter therapists based on search and filter type
    const filteredTherapists = therapists.filter((therapist) => {
        const matchesSearch = therapist.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            therapist.speciality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            therapist.email.toLowerCase().includes(searchQuery.toLowerCase())
        
        const status = therapist.clinic ? "Private Practice" : "Individual"
        const matchesFilter = filterType === "All Type" || status === filterType

        return matchesSearch && matchesFilter
    })

    const individualCount = therapists.filter((t) => !t.clinic).length
    const privatePracticeCount = therapists.filter((t) => t.clinic).length

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-1">Therapist Management</h2>
            </div>

            {/* Filter Section */}
            <div className="mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                </div>
                <div className="relative flex">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="appearance-none bg-white border-gray-200 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
                    >
                        <option>All Type</option>
                        <option>Private Practice</option>
                        <option>Individual</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                <div className="flex gap-4">
                    <div className="bg-card px-4 py-2 rounded-lg border border-gray-200 bg-white">
                        <p className="text-sm text-muted-foreground">Individual Therapist</p>
                        <p className="text-xl text-foreground text-green-700">{individualCount}</p>
                    </div>
                    <div className="bg-card px-4 py-2 rounded-lg border border-gray-200 bg-white">
                        <p className="text-sm text-muted-foreground">Private Practice</p>
                        <p className="text-xl text-foreground text-blue-700">{privatePracticeCount}</p>
                    </div>
                </div>
            </div>

            {/* Therapists Grid */}
            {filteredTherapists?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No therapists found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTherapists?.map((therapist) => {
                        const status = therapist.clinic ? "Private Practice" : "Individual"
                        const initials = getInitials(therapist.fullName)
                        const bgColor = getAvatarColor(therapist.id)
                        
                        return (
                            <div key={therapist.id} className="rounded-lg border border-gray-200 bg-white bg-card p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 my-2">
                                        <div
                                            className={`${bgColor} rounded-full w-12 h-12 flex items-center justify-center text-white font-bold`}
                                        >
                                            {initials}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{therapist.fullName}</h3>
                                            <p className="text-sm text-[#7E8086]">
                                                {therapist.speciality || "No specialty listed"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 flex justify-between">
                                    <div className="flex flex-col gap-2 my-3">
                                        <span className="text-sm text-[#7E8086]">Status</span>
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
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-[#7E8086]">Patients</span>
                                        <span className="text-2xl font-bold text-foreground">
                                            {therapist._count.clients}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleViewDetails(therapist.id)}
                                    className="w-full py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors cursor-pointer"
                                >
                                    View Details
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}