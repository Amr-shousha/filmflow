export default function SearchBar({ setSearchInput, searchInput }) {
  return (
    <div className="input-container">
      <input
        type="text"
        value={searchInput}
        placeholder="Enter movie or show"
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  );
}
