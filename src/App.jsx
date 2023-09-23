import "./App.css";
import { useEffect, useState } from "react";
import { Auth } from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);
  // Create new movie
  const [newMovie, setNewMovie] = useState({
    title: "",
    realeseDate: 0,
    recievedAnOscar: false,
  });
  const [fileUpload, setFileUpload] = useState(null);

  // Especifico que coleccion quiero leer
  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      // LEER LOS DATOS
      // SETEAR LA LISTA DE PELICULAS
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id, newName) => {
    if (newName === "") return;
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: newName });
    getMovieList();
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const handleSubmitMovie = async () => {
    const { title, realeseDate, recievedAnOscar } = newMovie;
    try {
      await addDoc(moviesCollectionRef, {
        title,
        realeseDate,
        recievedAnOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(auth?.currentUser);

  return (
    <div>
      <Auth />
      <div style={{ marginTop: "100px" }}>
        <input
          placeholder="Movie title..."
          onChange={({ target }) =>
            setNewMovie({ ...newMovie, title: target.value })
          }
        />
        <input
          placeholder="Realese Date..."
          type="number"
          onChange={({ target }) =>
            setNewMovie({ ...newMovie, realeseDate: target.value })
          }
        />
        <input
          type="checkbox"
          onChange={({ target }) =>
            setNewMovie({ ...newMovie, recievedAnOscar: target.checked })
          }
        />
        <label htmlFor="">Recieved an Oscar</label>
        <button onClick={handleSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie, index) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.recievedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.realeseDate}</p>

            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input placeholder="New title..." className="newName" />
            <button
              onClick={() => {
                const newName = document.querySelectorAll(".newName");
                updateMovieTitle(movie.id, newName[index].value);
              }}
            >
              New title
            </button>
          </div>
        ))}
      </div>
      <div>
        <input
          type="file"
          onChange={({ target }) => setFileUpload(target.files[0])}
        />
        <button onClick={uploadFile}> Upload File </button>
      </div>
    </div>
  );
}

export default App;
