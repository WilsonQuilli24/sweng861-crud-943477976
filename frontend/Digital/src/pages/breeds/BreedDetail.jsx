import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { apiFetch } from "../../services/apiClient";

function BreedDetail() {
  const { id } = useParams();
  const [breed, setBreed] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreed = async () => {
      try {
        const breedData = await apiFetch(`/breeds/${id}`);
        setBreed(breedData.breed);

        const imgRes = await fetch(
          `https://dog.ceo/api/breed/${breedData.breed.toLowerCase()}/images/random`
        );
        const imgData = await imgRes.json();
        setImage(imgData.message);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBreed();
  }, [id]);

  if (loading) return <p>Loading breed...</p>;

  return (
    <>
      <Navbar />

      <main className="breed-detail">
        <h1>{breed}</h1>

        {image && (
          <img
            src={image}
            alt={breed}
            className="breed-image"
          />
        )}
      </main>

      <Footer />
    </>
  );
}

export default BreedDetail;