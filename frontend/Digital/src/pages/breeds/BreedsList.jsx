import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../apiClient";

function BreedsList() {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      setError("");
      const data = await apiFetch("/breeds");
      if (data) {
        setBreeds(data);
      } else {
        setError("Failed to load breeds. Please try again.");
      }
      setLoading(false);
    };
    fetchBreeds();
  }, []);

  if (loading) return <p>Loading breeds...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="entity-list">
      <h2>Dog Breeds</h2>
      <ul>
        {breeds.map((b) => (
          <li key={b.id}>
            <span>{b.breed}</span>
            <Link to={`/breeds/${b.id}`}>View Details</Link>
          </li>
        ))}
      </ul>
      <Link to="/breeds/new" className="create-btn">Add New Breed</Link>
    </div>
  );
}

export default BreedsList;