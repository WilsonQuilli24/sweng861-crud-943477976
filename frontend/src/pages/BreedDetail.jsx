import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../services/apiClient.js";
import { useLocale } from '../useLocale';

function BreedDetail() {
  const { id } = useParams();
  const { t } = useLocale();
  const [breed, setBreed] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchBreedAndImage = async () => {
      try {
        const data = await apiFetch(`/breeds/${id}`);
        if (!data) {
          setErrorMsg("Could not fetch breed from backend.");
          return;
        }

        const actualBreed = (data.breed || "").toLowerCase();
        setBreed(actualBreed);
        // Build image URL - use a direct img tag to avoid CORS
        setImage(`https://dog.ceo/api/breed/${actualBreed}/images/random`);
      } catch (err) {
        if (err?.response?.status === 404) {
          setErrorMsg("This item does not exist or has been deleted.");
        } else if (err?.response?.status === 403) {
          setErrorMsg("You are not authorized to view this item.");
        } else {
          console.error(err);
          setErrorMsg("Could not load breed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBreedAndImage();
  }, [id]);

  if (loading) return <p>{t('loading')}</p>;
  if (errorMsg)
    return (
      <>
        <Navbar />
        <main style={{ textAlign: "center", marginTop: "2rem" }}>
          <p style={{ color: "red" }}>{errorMsg}</p>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <main style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>{breed.toUpperCase()}</h1>
        {image && (
          <img
            src={image}
            alt={breed}
            style={{
              maxWidth: "500px",
              width: "90%",
              borderRadius: "12px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

export default BreedDetail;