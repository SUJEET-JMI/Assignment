const SearchPanel = ({ onSearch }) => {
  const submit = (e) => {
    e.preventDefault();
    const f = e.target;
    onSearch({
      name: f.name.value,
      country: f.country.value,
      language: f.language.value,
      tag: f.tag.value,
    });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <input
        name="name"
        placeholder="Station Name"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
      />
      <input
        name="country"
        placeholder="Country"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
      />
      <input
        name="language"
        placeholder="Language"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
      />
      <input
        name="tag"
        placeholder="Tag/Genre"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:shadow-md"
      />
      <button className="w-full sm:col-span-2 lg:col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:scale-105">
        <span className="flex items-center justify-center gap-2">
          <span>🔍</span>
          <span>Search</span>
        </span>
      </button>
    </form>
  );
};

export default SearchPanel;
