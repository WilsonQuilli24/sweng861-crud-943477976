import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch, apiPost, apiPut } from "../../services/apiClient.js";
import { useLocale } from '../../useLocale';

function BreedForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [breed, setBreed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLocale();

  useEffect(() => {
    if (id) {
      const fetchBreed = async () => {
        setLoading(true);
        const data = await apiFetch(`/breeds/${id}`);
        if (data && !data.error) setBreed(data.breed);
        else setError("Could not load breed for editing.");
        setLoading(false);
      };
      fetchBreed();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!breed.trim()) {
      setError(t('requiredBreed'));
      return;
    }
    setLoading(true);
    setError("");

    try {
      let result;
      if (id) result = await apiPut(`/breeds/${id}`, { breed });
      else result = await apiPost("/breeds", { breed });

      if (result && !result.error) {
        navigate(id ? `/breeds/${id}` : "/breeds");
        alert(t('save') + 'd');
      } else {
        setError(result?.error || t('couldNotLoad'));
      }
    } catch {
      setError("Could not save. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="entity-form">
      <h2>{id ? "Edit Breed" : "Add New Breed"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Breed Name
          <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>

        {error && <p className="error-msg" role="alert">{error}</p>}
      </form>
    </div>
  );
}

export default BreedForm;