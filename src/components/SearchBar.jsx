export default function SearchBar({
  setSearchInput,
  searchInput,
  autoSubmit = true,
  handleSubmit,
}) {
  return (
    <div className="input-container">
      {!autoSubmit ? (
        <input
          type="text"
          value={searchInput}
          placeholder="Enter movie or show"
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
      ) : (
        <input
          type="text"
          value={searchInput}
          placeholder="Enter movie or show"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      )}
    </div>
  );
}
