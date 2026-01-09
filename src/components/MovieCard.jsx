import React from "react";
import "./MovieCard.css";
import { Link } from "react-router-dom";

const MovieCard = ({ title, year, poster, id }) => {
  return (
    <div className="movie">  
      <Link to={`/info/${id}`} className="movie__card">
        <figure className="movie__poster--wrapper">
          <img src={poster} className="movie__poster" alt="" />
          <div className="poster__wrapper--after">
            <p className="more__info">More Info</p>
          </div>
        </figure>
        <h3 className="movie__title">{title}</h3>
        <p className="movie__year">{year}</p>
        </Link>
      </div>
  );
};

export default MovieCard;
