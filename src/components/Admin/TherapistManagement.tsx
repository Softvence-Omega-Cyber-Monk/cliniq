"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Therapist {
    id: string
    name: string
    specialty: string
    status: "Private Practice" | "Individual"
    patients: number
    initials: string
    bgColor: string
}

export default function TherapistManagement() {
    const [filterType, setFilterType] = useState("All Type")
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate();

    const handleViewDetails = (id: string) => {
        console.log("Clicking");
        navigate(`/admin-dashboard/admin-therapists/${id}`);
    };

    const therapists: Therapist[] = [
        {
            id: "1",
            name: "Dr. Michael Chen",
            specialty: "Mindfulness Therapy",
            status: "Private Practice",
            patients: 8,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
        {
            id: "2",
            name: "Dr. Sarah Johnson",
            specialty: "Cognitive Behavioral Therapy",
            status: "Individual",
            patients: 12,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
        {
            id: "3",
            name: "Dr. Emily Rodriguez",
            specialty: "Psychodynamic Therapy",
            status: "Private Practice",
            patients: 15,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
        {
            id: "4",
            name: "Dr. Sarah Johnson",
            specialty: "Cognitive Behavioral Therapy",
            status: "Individual",
            patients: 12,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
        {
            id: "5",
            name: "Dr. Sarah Johnson",
            specialty: "Cognitive Behavioral Therapy",
            status: "Private Practice",
            patients: 12,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
        {
            id: "6",
            name: "Dr. Sarah Johnson",
            specialty: "Cognitive Behavioral Therapy",
            status: "Individual",
            patients: 12,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
        {
            id: "7",
            name: "Dr. Sarah Johnson",
            specialty: "Cognitive Behavioral Therapy",
            status: "Private Practice",
            patients: 12,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
        {
            id: "8",
            name: "Dr. Sarah Johnson",
            specialty: "Cognitive Behavioral Therapy",
            status: "Individual",
            patients: 12,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
        {
            id: "9",
            name: "Dr. Sarah Johnson",
            specialty: "Cognitive Behavioral Therapy",
            status: "Private Practice",
            patients: 12,
            initials: "SJ",
            bgColor: "bg-slate-700",
        },
    ]

    const individualCount = therapists.filter((t) => t.status === "Individual").length
    const privatePracticeCount = therapists.filter((t) => t.status === "Private Practice").length

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-1">Therapist Management</h2>
                <p className="text-muted-foreground">Welcome back, manage your platform efficiently</p>
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
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
                        >
                            <option>All Type</option>
                            <option>Private Practice</option>
                            <option>Individual</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-card px-4 py-2 rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground">Individual Therapist</p>
                            <p className="text-xl font-bold text-foreground">{individualCount}</p>
                        </div>
                        <div className="bg-card px-4 py-2 rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground">Private Practice</p>
                            <p className="text-xl font-bold text-foreground">{privatePracticeCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Therapists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {therapists.map((therapist) => (
                    <div key={therapist.id} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`${therapist.bgColor} rounded-full w-12 h-12 flex items-center justify-center text-white font-bold`}
                                >
                                    {therapist.initials}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{therapist.name}</h3>
                                    <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${therapist.status === "Private Practice"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {therapist.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Patients</span>
                                <span className="text-lg font-bold text-foreground">{therapist.patients}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleViewDetails(therapist.id)}
                            className="w-full py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
