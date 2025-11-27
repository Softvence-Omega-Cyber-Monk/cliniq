import { useState } from "react"
import { ChevronDown, Search, Plus, Download, Edit, Trash2 } from "lucide-react"
import AddMaterialModal from "@/components/Admin/AddMaterialModal"
import DeleteConfirmModal from "@/components/Admin/DeleteConfirmModal"

interface Material {
  id: string
  title: string
  category: string
  categoryColor: string
  type: string
  description: string
  status: "Active" | "Inactive"
  uploadDate: string
  size: string
}

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Category")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  const materials: Material[] = [
    {
      id: "1",
      title: "Cognitive Behavioral Therapy (CBT) Overview",
      category: "CBT",
      categoryColor: "bg-blue-100 text-blue-700",
      type: "PDF",
      description: "Comprehensive guide to CBT principles and techniques for treating anxiety and depression.",
      status: "Active",
      uploadDate: "Sep 15, 2025",
      size: "2.4 MB",
    },
    {
      id: "2",
      title: "Mindfulness Meditation Exercises",
      category: "Mindfulness",
      categoryColor: "bg-green-100 text-green-700",
      type: "Video",
      description: "Step-by-step video guide for teaching patients mindfulness meditation techniques.",
      status: "Active",
      uploadDate: "Sep 15, 2025",
      size: "2.4 MB",
    },
    {
      id: "3",
      title: "DBT Skills Training Workbook",
      category: "DBT",
      categoryColor: "bg-orange-100 text-orange-700",
      type: "Worksheet",
      description: "Interactive workbook for Dialectical Behavior Therapy skills training.",
      status: "Active",
      uploadDate: "Sep 15, 2025",
      size: "2.4 MB",
    },
    {
      id: "4",
      title: "Mindfulness Meditation Exercises",
      category: "CBT",
      categoryColor: "bg-blue-100 text-blue-700",
      type: "PDF",
      description: "Evidence-based protocol for treating trauma using CBT approaches.",
      status: "Active",
      uploadDate: "Sep 15, 2025",
      size: "2.4 MB",
    },
    {
      id: "5",
      title: "Introduction to Acceptance and Commitment Therapy",
      category: "ACT",
      categoryColor: "bg-purple-100 text-purple-700",
      type: "Worksheet",
      description: "Interactive workbook for Dialectical Behavior Therapy skills training.",
      status: "Active",
      uploadDate: "Sep 15, 2025",
      size: "2.4 MB",
    },
    {
      id: "6",
      title: "Outdated CBT Techniques",
      category: "CBT",
      categoryColor: "bg-blue-100 text-blue-700",
      type: "PDF",
      description: "Evidence-based protocol for treating trauma using CBT approaches.",
      status: "Active",
      uploadDate: "Sep 15, 2025",
      size: "2.4 MB",
    },
  ]

  const stats = [
    { label: "Total Materials", value: "8", icon: "📄" },
    { label: "Active Materials", value: "7", icon: "✅️" },
    { label: "Inactive Materials", value: "1", icon: "❌" },
    { label: "Categories", value: "4", icon: "📂" },
  ]

  const handleDeleteClick = (material: Material) => {
    setSelectedMaterial(material)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    setShowDeleteModal(false)
    setSelectedMaterial(null)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Sessions Management</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Material
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-lg bg-card p-4 bg-white border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white border border-gray-200"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none px-4 py-2 rounded-lg bg-white border border-gray-200 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
          >
            <option>All Category</option>
            <option>CBT</option>
            <option>DBT</option>
            <option>Mindfulness</option>
            <option>ACT</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="rounded-lg bg-white border border-gray-200 bg-card p-4 hover:border-teal-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-teal-500 mt-1">📄</div>
                <div>
                  <h3 className="font-semibold text-foreground">{material.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${material.categoryColor}`}>
                      {material.category}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{material.status}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{material.type}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{material.description}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-4 border-b border-gray-300">
              <div>
                <p>Uploaded: {material.uploadDate}</p>
                <p>Size: {material.size}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="cursor-pointer p-2 rounded hover:bg-green-50 text-muted-foreground hover:text-green-600 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="cursor-pointer p-2 rounded hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(material)}
                  className="cursor-pointer p-2 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && <AddMaterialModal onClose={() => setShowAddModal(false)} />}
      {showDeleteModal && selectedMaterial && (
        <DeleteConfirmModal
          material={selectedMaterial}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}
