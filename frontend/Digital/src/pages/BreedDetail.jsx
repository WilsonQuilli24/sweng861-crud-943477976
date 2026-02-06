import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../services/apiClient.js";

function BreedDetail() {
  const { id } = useParams();
  const [breed, setBreed] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreedAndImage = async () => {
      try {
        const data = await apiFetch(`/breeds/${id}`);
        if (!data) {
          console.error("Could not fetch breed from backend");
          return;
        }

        const actualBreed = data.breed.toLowerCase();
        setBreed(actualBreed);

        try {
          const jsonImg = await fetch(
            `https://dog.ceo/api/breed/${actualBreed}/images/random`
          ).then(res => res.json());

          if (jsonImg.status === "success") {
            setImage(jsonImg.message);
          } else {
            setImage("/placeholder-dog.jpg"); 
          }
        } catch {
          setImage("/placeholder-dog.jpg"); 
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBreedAndImage();
  }, [id]);

  if (loading) return <p>Loading...</p>;

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