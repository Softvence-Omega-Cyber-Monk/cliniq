import React, { useState, useMemo } from "react";
import {
  Material,
  MaterialCategory,
  MaterialStatus,
  MaterialType,
} from "../components/ContentManagement/types";
import StatCard from "../components/ContentManagement/StatCard";
import MaterialCard from "../components/ContentManagement/MaterialCard";
import AddMaterialModal from "../components/ContentManagement/AddMaterialModal";
import DeleteConfirmationModal from "../components/ContentManagement/DeleteConfirmationModal";
import {
  ClipboardListIcon,
  PlusIcon,
  SearchIcon,
  ChevronDownIcon,
} from "../components/ContentManagement/icons";

const initialMaterials: Material[] = [
  {
    id: "1",
    title: "Cognitive Behavioral Therapy (CBT) Overview",
    category: MaterialCategory.CBT,
    type: MaterialType.PDF,
    status: MaterialStatus.Active,
    description:
      "Comprehensive guide to CBT principles and techniques for treating anxiety and depression.",
    uploadDate: "Sep 15, 2025",
    size: "2.4 MB",
    fileName: "cbt-overview.pdf",
  },
  {
    id: "2",
    title: "Mindfulness Meditation Exercises",
    category: MaterialCategory.Mindfulness,
    type: MaterialType.Video,
    status: MaterialStatus.Active,
    description:
      "Step-by-step video guide for teaching patients mindfulness meditation techniques.",
    uploadDate: "Sep 15, 2025",
    size: "2.4 MB",
    fileName: "mindfulness-exercises.mp4",
  },
  {
    id: "3",
    title: "DBT Skills Training Workbook",
    category: MaterialCategory.DBT,
    type: MaterialType.Worksheet,
    status: MaterialStatus.Active,
    description:
      "Interactive workbook for Dialectical Behavior Therapy skills training.",
    uploadDate: "Sep 15, 2025",
    size: "2.4 MB",
    fileName: "dbt-workbook.pdf",
  },
  {
    id: "4",
    title: "Mindfulness Meditation Exercises",
    category: MaterialCategory.CBT,
    type: MaterialType.PDF,
    status: MaterialStatus.Active,
    description:
      "Evidence-based protocol for treating trauma using CBT approaches.",
    uploadDate: "Sep 15, 2025",
    size: "2.4 MB",
    fileName: "cbt-trauma.pdf",
  },
  {
    id: "5",
    title: "Introduction to Acceptance and Commitment Therapy",
    category: MaterialCategory.ACT,
    type: MaterialType.Worksheet,
    status: MaterialStatus.Active,
    description:
      "Interactive workbook for Dialectical Behavior Therapy skills training.",
    uploadDate: "Sep 15, 2025",
    size: "2.4 MB",
    fileName: "act-intro.pdf",
  },
  {
    id: "6",
    title: "Outdated CBT Techniques",
    category: MaterialCategory.CBT,
    type: MaterialType.PDF,
    status: MaterialStatus.Inactive,
    description:
      "Evidence-based protocol for treating trauma using CBT approaches.",
    uploadDate: "Sep 15, 2025",
    size: "2.4 MB",
    fileName: "cbt-outdated.pdf",
  },
  {
    id: "7",
    title: "Advanced DBT Modules",
    category: MaterialCategory.DBT,
    type: MaterialType.Video,
    status: MaterialStatus.Active,
    description:
      "Advanced modules for clinicians already familiar with DBT basics.",
    uploadDate: "Sep 12, 2025",
    size: "15.8 MB",
    fileName: "dbt-advanced.mp4",
  },
  {
    id: "8",
    title: "ACT for Chronic Pain",
    category: MaterialCategory.ACT,
    type: MaterialType.PDF,
    status: MaterialStatus.Active,
    description:
      "Applying Acceptance and Commitment Therapy for patients with chronic pain.",
    uploadDate: "Sep 10, 2025",
    size: "3.1 MB",
    fileName: "act-pain.pdf",
  },
];

const ContentManagementPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Category");

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(
    null
  );

  const stats = useMemo(() => {
    const total = materials.length;
    const active = materials.filter(
      (m) => m.status === MaterialStatus.Active
    ).length;
    const inactive = total - active;
    const categories = new Set(materials.map((m) => m.category)).size;
    return { total, active, inactive, categories };
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials
      .filter(
        (material) =>
          selectedCategory === "All Category" ||
          material.category === selectedCategory
      )
      .filter(
        (material) =>
          material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [materials, searchTerm, selectedCategory]);

  const handleOpenAddModal = (material: Material | null = null) => {
    setMaterialToEdit(material);
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setMaterialToEdit(null);
  };

  const handleSaveMaterial = (
    newMaterialData: Omit<Material, "id" | "uploadDate" | "size">
  ) => {
    if (materialToEdit) {
      // Edit existing material
      setMaterials(
        materials.map((m) =>
          m.id === materialToEdit.id
            ? { ...materialToEdit, ...newMaterialData }
            : m
        )
      );
    } else {
      // Add new material
      const newMaterial: Material = {
        ...newMaterialData,
        id: new Date().toISOString(),
        uploadDate: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date()),
        size: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
      };
      setMaterials([newMaterial, ...materials]);
    }
  };

  const handleOpenDeleteModal = (material: Material) => {
    setMaterialToDelete(material);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setMaterialToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      setMaterials(materials.filter((m) => m.id !== materialToDelete.id));
      handleCloseDeleteModal();
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 ">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Content Management
          </h1>
          <button
            onClick={() => handleOpenAddModal()}
            className="mt-4 sm:mt-0 flex items-center justify-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Material
          </button>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<ClipboardListIcon className="w-6 h-6" />}
            label="Total Materials"
            value={stats.total}
          />
          <StatCard
            icon={<ClipboardListIcon className="w-6 h-6" />}
            label="Active Materials"
            value={stats.active}
          />
          <StatCard
            icon={<ClipboardListIcon className="w-6 h-6" />}
            label="Inactive Materials"
            value={stats.inactive}
          />
          <StatCard
            icon={<ClipboardListIcon className="w-6 h-6" />}
            label="Categories"
            value={stats.categories}
          />
        </section>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-white pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              >
                <option>All Category</option>
                {Object.values(MaterialCategory).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </section>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onEdit={handleOpenAddModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </main>
      </div>

      <AddMaterialModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveMaterial}
        initialData={materialToEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        materialName={materialToDelete?.title || ""}
      />
    </>
  );
};

export default ContentManagementPage;
