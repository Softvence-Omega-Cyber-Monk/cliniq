import React, { useState, useMemo } from "react";

// --- Icon Components (Simple Inline SVGs) ---

const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ExportIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

// --- TypeScript Definitions ---

interface Tag {
  text: string;
  color: string;
  bgColor: string;
}

interface Material {
  id: number;
  title: string;
  description: string;
  uploadedDate: string;
  size: string;
  tags: Tag[];
}

// --- Mock Data ---

const TAG_STYLES: { [key: string]: { color: string; bgColor: string } } = {
  CBT: { color: "text-blue-600", bgColor: "bg-blue-100" },
  DBT: { color: "text-orange-600", bgColor: "bg-orange-100" },
  ACT: { color: "text-purple-600", bgColor: "bg-purple-100" },
  Mindfulness: { color: "text-pink-600", bgColor: "bg-pink-100" },
  Active: { color: "text-green-600", bgColor: "bg-green-100" },
  PDF: { color: "text-gray-600", bgColor: "bg-gray-200" },
  Video: { color: "text-gray-600", bgColor: "bg-gray-200" },
  worksheet: { color: "text-gray-600", bgColor: "bg-gray-200" },
};

// Placeholder image URL
const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/800x400/F0F0F0/333333?text=Therapy+Session+Scene";

const MOCK_MATERIALS: Material[] = [
  {
    id: 1,
    title: "Cognitive Behavioral Therapy (CBT) Overview",
    description:
      "Comprehensive guide to CBT principles and techniques for treating anxiety and depression.",
    uploadedDate: "Sep 15, 2025",
    size: "2.4 MB",
    // Tags updated to match the detail view screenshot
    tags: [
      { text: "CBT", ...TAG_STYLES.CBT },
      { text: "Active", ...TAG_STYLES.Active },
      { text: "Worksheet", ...TAG_STYLES.worksheet },
    ],
  },
  {
    id: 2,
    title: "Mindfulness Meditation Exercises",
    description:
      "Step-by-step video guide for teaching patients mindfulness meditation techniques.",
    uploadedDate: "Sep 15, 2025",
    size: "2.4 MB",
    tags: [
      { text: "Mindfulness", ...TAG_STYLES.Mindfulness },
      { text: "Active", ...TAG_STYLES.Active },
      { text: "Video", ...TAG_STYLES.Video },
    ],
  },
  {
    id: 3,
    title: "DBT Skills Training Workbook",
    description:
      "Interactive workbook for Dialectical Behavior Therapy skills training.",
    uploadedDate: "Sep 15, 2025",
    size: "2.4 MB",
    tags: [
      { text: "DBT", ...TAG_STYLES.DBT },
      { text: "Active", ...TAG_STYLES.Active },
      { text: "worksheet", ...TAG_STYLES.worksheet },
    ],
  },
  {
    id: 4,
    title: "Mindfulness Meditation Exercises (PDF)",
    description:
      "Evidence-based protocol for treating trauma using CBT approaches.",
    uploadedDate: "Sep 15, 2025",
    size: "2.4 MB",
    tags: [
      { text: "CBT", ...TAG_STYLES.CBT },
      { text: "Active", ...TAG_STYLES.Active },
      { text: "PDF", ...TAG_STYLES.PDF },
    ],
  },
  {
    id: 5,
    title: "Introduction to Acceptance and Commitment Therapy",
    description:
      "Interactive workbook for Dialectical Behavior Therapy skills training.",
    uploadedDate: "Sep 15, 2025",
    size: "2.4 MB",
    tags: [
      { text: "ACT", ...TAG_STYLES.ACT },
      { text: "Active", ...TAG_STYLES.Active },
      { text: "worksheet", ...TAG_STYLES.worksheet },
    ],
  },
  {
    id: 6,
    title: "Outdated CBT Techniques",
    description:
      "Evidence-based protocol for treating trauma using CBT approaches.",
    uploadedDate: "Sep 15, 2025",
    size: "2.4 MB",
    tags: [
      { text: "CBT", ...TAG_STYLES.CBT },
      { text: "Active", ...TAG_STYLES.Active },
      { text: "PDF", ...TAG_STYLES.PDF },
    ],
  },
];

// --- Sub-Components ---

const TagPill: React.FC<{ tag: Tag }> = ({ tag }) => (
  <span
    className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${tag.bgColor} ${tag.color} mr-2 last:mr-0`}
  >
    {tag.text}
  </span>
);

const MaterialCard: React.FC<{
  material: Material;
  onView: (id: number) => void;
}> = ({ material, onView }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all hover:shadow-xl">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-start">
        {/* Icon and Tags */}
        <div className="p-2 mr-3 bg-green-50 text-green-600 rounded-lg">
          <FileTextIcon />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {material.title}
          </h3>
          <div className="mt-1 flex flex-wrap">
            {material.tags.map((tag, index) => (
              <TagPill key={index} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>

    <p className="text-sm text-gray-600 mb-4">{material.description}</p>

    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
      <div className="text-xs text-gray-500 space-y-1">
        <p>Uploaded: {material.uploadedDate}</p>
        <p>Size: {material.size}</p>
      </div>
      <button
        className="px-6 py-2 bg-teal-500 text-white font-medium rounded-lg shadow-md hover:bg-teal-600 transition duration-150 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-teal-300"
        onClick={() => onView(material.id)} // View handler
      >
        View
      </button>
    </div>
  </div>
);

const MaterialDetailView: React.FC<{
  material: Material;
  onBack: () => void;
}> = ({ material, onBack }) => {
  // Placeholder content structure based on the screenshot
  const mockContent = (
    <div className="text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
      <p>
        Cognitive Behavioral Therapy (CBT) is a structured, goal-oriented form
        of psychotherapy that focuses on the relationship between thoughts,
        feelings, and behaviors. It helps individuals identify and challenge
        negative thought patterns and beliefs, enabling them to develop
        healthier coping strategies. By addressing these cognitive distortions,
        CBT empowers clients to make positive changes in their lives, ultimately
        leading to improved emotional well-being and resilience.
      </p>
      <p>
        Cognitive Behavioral Therapy (CBT) is a structured, goal-oriented form
        of psychotherapy that focuses on the relationship between thoughts,
        feelings, and behaviors. It helps individuals identify and challenge
        negative thought patterns and beliefs, enabling them to develop
        healthier coping strategies. By addressing these cognitive distortions,
        CBT empowers clients to make positive changes in their lives, ultimately
        leading to improved emotional well-being and resilience.
      </p>

      {/* Image Section */}
      <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <img
          src={PLACEHOLDER_IMAGE_URL}
          alt="Therapy session with a therapist and a couple"
          className="w-full h-auto"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/800x400/F0F0F0/333333?text=Image+Load+Failed";
          }}
        />
      </div>

      <p>
        Cognitive Behavioral Therapy (CBT) is a structured, goal-oriented form
        of psychotherapy that focuses on the relationship between thoughts,
        feelings, and behaviors. It helps individuals identify and challenge
        negative thought patterns and beliefs, enabling them to develop
        healthier coping strategies. By addressing these cognitive distortions,
        CBT empowers clients to make positive changes in their lives, ultimately
        leading to improved emotional well-being and resilience. Cognitive
        Behavioral Therapy (CBT) is a structured, goal-oriented form of
        psychotherapy that focuses on the relationship between thoughts,
        feelings, and behaviors. It helps individuals identify and challenge
        negative thought patterns and beliefs, enabling them to develop
        healthier coping strategies. By addressing these cognitive distortions,
        CBT empowers clients to make positive changes in their lives, ultimately
        leading to improved emotional well-being and resilience.
      </p>
      <p>
        By addressing these cognitive distortions, CBT empowers clients to make
        positive changes in their lives, ultimately leading to improved
        emotional well-being and resilience. Cognitive Behavioral Therapy (CBT)
        is a structured, goal-oriented form of psychotherapy that focuses on the
        relationship between thoughts, feelings, and behaviors. It helps
        individuals identify and challenge negative thought patterns and
        beliefs, enabling them to develop healthier coping strategies.
      </p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen p-4 sm:p-10 rounded-xl shadow-lg border border-gray-100">
      {/* Breadcrumbs */}
      <div className="text-sm mb-6 flex items-center text-gray-500">
        <button
          onClick={onBack}
          className="hover:text-teal-600 transition duration-150"
        >
          Materials
        </button>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900 truncate max-w-xs sm:max-w-md">
          {material.title}
        </span>
      </div>

      {/* Header and Export Button */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight max-w-[80%]">
          {material.title.toUpperCase()}
        </h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white font-medium rounded-lg shadow-md hover:bg-gray-700 transition duration-150 ease-in-out">
          <ExportIcon className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Tags */}
      <div className="mb-8 flex flex-wrap">
        {material.tags.map((tag, index) => (
          <TagPill key={index} tag={tag} />
        ))}
      </div>

      {/* Content */}
      {mockContent}
    </div>
  );
};

// --- Main Component ---

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Category");
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    null
  ); // State for detail view

  // Find the currently selected material
  const currentMaterial = useMemo(() => {
    return MOCK_MATERIALS.find((m) => m.id === selectedMaterialId);
  }, [selectedMaterialId]);

  // Handler to switch to detail view
  const handleViewMaterial = (id: number) => {
    setSelectedMaterialId(id);
  };

  // Mock filter logic
  const filteredMaterials = useMemo(() => {
    return MOCK_MATERIALS.filter((material) => {
      const matchesSearch = material.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Category" ||
        material.tags.some(
          (tag) => tag.text.toLowerCase() === selectedCategory.toLowerCase()
        );

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const allTags = MOCK_MATERIALS.flatMap((m) => m.tags.map((t) => t.text));
    // Filter out generic tags like 'Active', 'PDF', 'Video', 'worksheet' for primary filtering
    const primaryTags = allTags.filter(
      (tag) => !["Active", "PDF", "Video", "worksheet"].includes(tag)
    );
    return ["All Category", ...Array.from(new Set(primaryTags))];
  }, []);

  // Conditional Rendering: Detail View vs. List View
  if (selectedMaterialId !== null && currentMaterial) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 ">
        <div className="max-w-5xl mx-auto">
          <MaterialDetailView
            material={currentMaterial}
            onBack={() => setSelectedMaterialId(null)}
          />
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Header - Line under MATERIALS removed */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            MATERIALS
          </h1>
          <p className="mt-2 text-gray-600">
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
          </p>
        </header>

        {/* Search and Filter Row - Search is now full width/flexible */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search Input - flex-grow ensures it takes up all available space */}
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Identical styling to dropdown: border-gray-300, rounded-lg, shadow-sm, bg-white
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 shadow-sm transition duration-150 bg-white"
            />
          </div>

          {/* Category Dropdown - Now takes full width on mobile and is constrained on desktop */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none w-full pr-8 pl-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-teal-500 focus:border-teal-500 shadow-sm text-gray-700 cursor-pointer transition duration-150"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onView={handleViewMaterial} // Pass the handler
              />
            ))
          ) : (
            <p className="md:col-span-2 text-center text-gray-500 py-10">
              No materials found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
