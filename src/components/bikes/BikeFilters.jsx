import { useLanguage } from "@/contexts/LanguageContext";
import { BIKE_CATEGORIES } from "@/data/bikes";

const BikeFilters = ({ activeFilter, onFilterChange }) => {
  const { language } = useLanguage();

  const filters = Object.entries(BIKE_CATEGORIES);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filters.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
            activeFilter === key
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {label[language]}
        </button>
      ))}
    </div>
  );
};

export default BikeFilters;
