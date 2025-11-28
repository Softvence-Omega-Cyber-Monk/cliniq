import { useState, useMemo } from "react"
import { ChevronDown, Search, Plus, Download, Edit, Trash2, Loader2, AlertCircle } from "lucide-react"
import AddMaterialModal from "@/components/Admin/AddMaterialModal"
import DeleteConfirmModal from "@/components/Admin/DeleteConfirmModal"
import { useGetResourcesQuery, useGetResourceStatsQuery, useDeleteResourceMutation, ResourceCategory } from "@/store/api/MaterialApi"

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null)

  // Fetch resources
  const { 
    data: resources, 
    isLoading: resourcesLoading, 
    error: resourcesError 
  } = useGetResourcesQuery({
    category: categoryFilter !== "all" ? (categoryFilter as ResourceCategory) : undefined,
  })

  // Fetch stats
  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useGetResourceStatsQuery()

  // Delete mutation
  const [deleteResource, { isLoading: deleting }] = useDeleteResourceMutation()

  // Filter resources by search query
  const filteredResources = useMemo(() => {
    if (!resources) return []
    
    return resources.filter(resource => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        resource.title.toLowerCase().includes(searchLower) ||
        resource.shortDescription.toLowerCase().includes(searchLower) ||
        resource.category.toLowerCase().includes(searchLower)
      
      return matchesSearch
    })
  }, [resources, searchQuery])

  // Get selected resource for delete modal
  const selectedResource = useMemo(() => {
    return resources?.find(r => r.id === selectedResourceId)
  }, [resources, selectedResourceId])

  const handleDeleteClick = (id: string) => {
    setSelectedResourceId(id)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedResourceId) return

    try {
      await deleteResource(selectedResourceId).unwrap()
      setShowDeleteModal(false)
      setSelectedResourceId(null)
    } catch (error) {
      console.error('Failed to delete resource:', error)
      alert('Failed to delete resource. Please try again.')
    }
  }

  const handleDownload = (fileUrl: string, title: string) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = title
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      WORKSHEET: "bg-blue-100 text-blue-700",
      PDF: "bg-green-100 text-green-700",
      VIDEO: "bg-orange-100 text-orange-700",
      DOCUMENT: "bg-purple-100 text-purple-700",
      GUIDE: "bg-pink-100 text-pink-700",
      EXERCISE: "bg-indigo-100 text-indigo-700",
      OTHER: "bg-gray-100 text-gray-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  if (resourcesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900">Error loading resources</p>
          <p className="text-sm text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Content Management</h2>
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
        {statsLoading ? (
          <div className="col-span-4 flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-white p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Materials</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                </div>
                <div className="text-2xl">📄</div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Materials</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.active || 0}</p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Inactive Materials</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.inactive || 0}</p>
                </div>
                <div className="text-2xl">❌</div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.byCategory.length || 0}</p>
                </div>
                <div className="text-2xl">📂</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
          >
            <option value="all">All Category</option>
            <option value={ResourceCategory.WORKSHEET}>Worksheet</option>
            <option value={ResourceCategory.PDF}>PDF</option>
            <option value={ResourceCategory.VIDEO}>Video</option>
            <option value={ResourceCategory.DOCUMENT}>Document</option>
            <option value={ResourceCategory.GUIDE}>Guide</option>
            <option value={ResourceCategory.EXERCISE}>Exercise</option>
            <option value={ResourceCategory.OTHER}>Other</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Materials Grid */}
      {resourcesLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No materials found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-lg bg-white border border-gray-200 p-4 hover:border-teal-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-teal-500 mt-1">📄</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(resource.category)}`}>
                        {resource.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        resource.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {resource.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {resource.fileType?.toUpperCase() || 'FILE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.shortDescription}</p>

              <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p>Uploaded: {formatDate(resource.createdAt)}</p>
                  <p>Size: {formatFileSize(resource.fileSize)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(resource.fileUrl, resource.title)}
                    className="cursor-pointer p-2 rounded hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    className="cursor-pointer p-2 rounded hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(resource.id)}
                    className="cursor-pointer p-2 rounded hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                    disabled={deleting}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddMaterialModal onClose={() => setShowAddModal(false)} />}
      {showDeleteModal && selectedResource && (
        <DeleteConfirmModal
          material={{
            id: selectedResource.id,
            title: selectedResource.title,
            category: selectedResource.category,
            categoryColor: getCategoryColor(selectedResource.category),
            type: selectedResource.fileType || 'FILE',
            description: selectedResource.shortDescription,
            status: selectedResource.isActive ? 'Active' : 'Inactive',
            uploadDate: formatDate(selectedResource.createdAt),
            size: formatFileSize(selectedResource.fileSize),
          }}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false)
            setSelectedResourceId(null)
          }}
        />
      )}
    </div>
  )
}