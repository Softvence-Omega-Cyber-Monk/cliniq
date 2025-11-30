import { useState, useMemo } from "react";
import MaterialCard from "./MaterialCard";
import MaterialDetailView from "./MaterialDetailView";
import { SearchIcon, ChevronDownIcon } from "./MaterialsIcons";
import { Resource, useGetResourcesQuery } from "@/store/api/MaterialApi";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null
  );

  const { data, isLoading } = useGetResourcesQuery({});
  const currentMaterial = useMemo(
    () => data?.find((m) => m.id === selectedMaterialId),
    [selectedMaterialId, data]
  );

  const handleViewMaterial = (id: string) => {
    setSelectedMaterialId(id);
  };

  // FILTER BY search + category
  const filteredMaterials = useMemo(() => {
    return data?.filter((material) => {
      const matchesSearch = material.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Category" ||
        material.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, data]);

  // CATEGORY LIST from `category` field
  const categories = useMemo(() => {
    const allCategories = data?.map((m) => m.category) || [];
    return ["All Category", ...Array.from(new Set(allCategories))];
  }, [data]);
  if (isLoading) {
    return (
      <div className=" min-h-screen  flex justify-center items-center">
        Loading...
      </div>
    );
  }
  if (selectedMaterialId && currentMaterial) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <MaterialDetailView
            material={currentMaterial}
            onBack={() => setSelectedMaterialId(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#32363F] tracking-tight">
          MATERIALS
        </h1>
        <p className="mt-2 text-gray-600">
          Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white shadow-sm"
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full pr-8 pl-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-teal-500 focus:border-teal-500 shadow-sm text-gray-700 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filteredMaterials!.length > 0 ? (
          filteredMaterials?.map((material: Resource) => (
            <MaterialCard
              key={material.id}
              material={material}
              onView={handleViewMaterial}
            />
          ))
        ) : (
          <p className="md:col-span-2 text-center text-gray-500 py-10">
            No materials found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
