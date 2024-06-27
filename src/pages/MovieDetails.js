import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase-config";
import {
  getDoc,
  doc,
  where,
  getDocs,
  collection,
  query,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ReviewCard } from "../components/ReviewCard";
import { useAuth } from "../contexts/AuthContext";

export const MovieDetails = () => {
  const { id } = useParams();

  const { currentUser } = useAuth();

  const [username, setUsername] = useState("");

  const commentsRef = useRef();
  const ratingRef = useRef();

  const [title, setTitle] = useState("");
  const [release, setRelease] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getDetails() {
      try {
        const docSnap = await getDoc(doc(db, "movies", id));
        const data = docSnap.data();
        setTitle(data.title);
        setRelease(data.release);
        setGenre(data.genre);
        setRating(data.rating);
        setImage(data.image);
      } catch (err) {
        return console.log(err.message);
      }
    }
    getDetails();
  }, [id]);

  useEffect(() => {
    async function getUsername() {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", currentUser.email)
          )
        );
        if (!querySnapshot.empty)
          setUsername(querySnapshot.docs[0].data().username);
      } catch (err) {
        console.log(err.message);
      }
    }
    getUsername();
  }, [currentUser]);

  async function getReviews() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "reviews"), where("movie", "==", title))
      );
      const reviewList = [];
      querySnapshot.forEach((doc) => reviewList.push(doc.data()));
      setReviews(reviewList);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    async function getReviews() {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "reviews"), where("movie", "==", title))
        );
        const reviewList = [];
        querySnapshot.forEach((doc) => reviewList.push(doc.data()));
        setReviews(reviewList);
      } catch (err) {
        console.log(err.message);
      }
    }
    getReviews();}, [title]);

  async function onAddReview(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, "reviews"), {
        movie: title,
        rating: ratingRef.current.value,
        comments: commentsRef.current.value,
        username: username,
      });
      getReviews();
      ratingRef.current.value="";
      commentsRef.current.value="";
    } catch (err) {
      return console.log(err);
    }
  }

  return (
    <>
      <Navbar />

      <div className="flex w-full flex-col md:flex-row text-gray-800 md:justify-evenly justify-center items-center">
        <div className="mx-4 mt-4 md:mt-10 mb-3 w-10/12 md:w-5/12">
          <img
            className="w-full shadow-lg shadow-black"
            src={image}
            alt={title}
          ></img>
        </div>
        <div className="pt-12 w-10/12 md:w-5/12 h-screen pr-1 md:pr-4 pb-32">
          <p className="font-mono text-5xl border-b-black">{title}</p>
          <br />
          <div className="flex flex-col rounded-2xl text pl-2 md:pl-6 py-4 pr-0 shadow-md">
            <span>
              <strong>Released on:</strong> {release}
            </span>
            <span>
              <strong>Genre: </strong> {genre}
            </span>
            <span>
              <strong>Rating: </strong>
              {rating}
            </span>
          </div>

          <div className="flex flex-col rounded-2xl text-lg pl-2 md:pl-6 mt-2 py-4 shadow-md gap-6 pr-3 pb-10">
            <div className="flex justify-between items-center">
              <span className="text-lg font-sans">REVIEWS</span>
            </div>

            <div className="mx-1 flex">
              <form className="flex gap-1">
                <input
                  type="text"
                  ref={commentsRef}
                  placeholder="Add a review"
                  className=" text-sm focus:outline-none bg-transparent border-b-gray-600 border-b-2 w-3/5 "
                ></input>
                <input
                  type="number"
                  ref={ratingRef}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="Rate"
                  className=" text-sm focus:outline-none bg-transparent border-b-gray-600 border-b-2 w-1/6"
                  required
                ></input>
                <button
                  onClick={(e) => onAddReview(e)}
                  type="submit"
                  className=" rounded-sm text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 "
                >
                  Submit
                </button>
              </form>
            </div>

            {reviews.length > 0 ? (
              reviews.map((review) => <ReviewCard review={review} getReviews={getReviews} />)
            ) : (
              <div className="text-sm text-gray-500 ml-4">
                {" "}
                Be the first to review this movie{" "}
              </div>
            )}
          </div>
          <div className="h-20"></div>
        </div>
      </div>
    </>
  );
};
