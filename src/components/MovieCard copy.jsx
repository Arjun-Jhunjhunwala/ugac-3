import {doc, deleteDoc, collection, where, getDocs, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { useAuth } from "../contexts/AuthContext";

export const MovieCard = ({ movie,fetchMovies }) => {

  const [id, setId] = useState(null);
  const {currentUser} = useAuth();
  const [username, setUsername] = useState();

  useEffect(() => { async function getUID () {
    try{
      const querySnapshot = await getDocs(query(collection(db,'movies'), where("title","==",movie.title)));
      if (!querySnapshot.empty){
        setId(querySnapshot.docs[0].id);
      }
    }catch(err){
      console.log(err.message)
    }
  }
  getUID();} ,[movie.title]);

  async function onDeleteClick (e) {
    e.preventDefault();
    try{
      await deleteDoc(doc(db, 'movies', id))
      fetchMovies();
    }catch(err){
      return console.log(err.message);
    }
    
  }

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

  return (
    
    <div data-aos="fade-up" data-aos-once="true" className="card flex flex-col gap-2">
      
        <div>
          <Link to={`/details/${id}`}>
            <img src={movie.image} alt={movie.title} className="card-image shadow-lg shadow-gray-700 hover:scale-105 duration-300"/>
          </Link>
        </div>
        <div className="px-1">
          <div className="flex justify-between">
            <p className="truncate font-semibold w-10/12">{movie.title}</p>
            <p className="flex justify-center items-center"><span className=" text-sm">{movie.rating}</span><span className="material-symbols-outlined text-sm text-amber-300">star</span></p> 
          </div>
          <div className="flex justify-between">
            <p className=" text-sm">{movie.release}</p>
            <div className="w-1/4 flex justify-between">
              {username === "admin" && <Link to={`/edit/${id}`}> <button className="flex items-center">
                <span className="material-symbols-outlined icons">edit</span>
              </button></Link>}
              {username === "admin" &&  <button onClick={(e) => onDeleteClick(e)} className="flex items-center ">
                <span className="material-symbols-outlined text-red-700 icons">delete</span>
              </button>}
            </div>
          </div>
        </div>
        {/* <div className="flex">
          <div className="flex w-1/2">
            <button className="flex items-center w-full">
              <span className="material-symbols-outlined w-5 ml-1">edit</span>
              <span className="font-sans pl-8 text-sm py-0.5">Edit</span>
            </button>
          </div>
          <div className="flex w-1/2 border-">
            <button className="flex items-center w-full">
              <span className="material-symbols-outlined w-5 ml-1">delete</span>
              <span className="font-sans pl-8 text-sm py-0.5">Delete</span>
            </button>
          </div>
        </div> */}
    </div>
  );
};
