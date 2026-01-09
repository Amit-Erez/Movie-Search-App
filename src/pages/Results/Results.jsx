import React, { useEffect, useState } from "react";
import "./Results.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import filmheader from "../../assets/filmheader.jpg";
import Nav from "../../components/Nav";
import MovieCard from "../../components/MovieCard";
import { useSearchParams } from "react-router-dom";

const Results = () => {
const [showSpinner, setShowSpinner] = useState(false);
const [loading, setLoading] = useState(false);
const [movies, setMovies] = useState([]);
const [filter, setFilter] = useState("DEFAULT");
const [searchParams, setSearchParams] = useSearchParams();
const query = searchParams.get("query");

async function getMovies(entry) {
if (!entry) return;
if (!showSpinner) setLoading(true);

try {
  const { data } = await axios.get(
    `https://www.omdbapi.com/?apikey=46d82378&s=${entry}`
  );
  const firstSix = data.Search ? data.Search.slice(0, 8) : [];
  setMovies(firstSix);
  setFilter("DEFAULT");
} catch (err) {
  console.error("Error fetching movies:", err);
  setMovies([]);
} finally {
  if (!showSpinner) {
    setTimeout(() => setLoading(false), 500);
  }
}
}

function runSearch(entry) {
  const q = entry.trim();
  if (!q) return;
  setSearchParams({ query: q });
}


useEffect(() => {
  if (query) {
    setEntry(query);
    setShowSpinner(true);
    getMovies(query).finally(() => {
    setTimeout(() => setShowSpinner(false), 500); 
  });
}
}, [query]);

const [entry, setEntry] = useState("");

function onSearchKeyPress(key) {
  key === "Enter" && runSearch(entry);
}


function filterMovies(filter) {
  console.log(movies);
  if (filter === "Old_to_New") {
    setMovies(movies.slice().sort((a, b) => a.Year - b.Year));
  } else if (filter === "New_to_Old") {
    setMovies(movies.slice().sort((a, b) => b.Year - a.Year));
  } else if (filter === "By_Title_A-Z") {
    setMovies(movies.slice().sort((a, b) => a.Title.localeCompare(b.Title)));
  } else if (filter === "By_Title_Z-A") {
    setMovies(movies.slice().sort((a, b) => b.Title.localeCompare(a.Title)));
  }
  setFilter(filter);
}

function showResults() {
  if (!query) {
    return
  }
  return (
    <>
      {
      movies.length === 0 ? 
        <h1 className="no__results">No results found...</h1> : 
      movies.map((movie) => (
        <MovieCard
          title={movie.Title}
          year={movie.Year}
          poster={movie.Poster}
          id={movie.imdbID}
          key={movie.Poster}
        />
      ))}
    </>
  );
}

return showSpinner ? (
  <>
    <figure className="bg__img--wrapper">
      <img src={filmheader} className="bg__img .image-fade-bottom" alt="" />
    </figure>
    <div className="loading__spinner">
      <FontAwesomeIcon icon="fa-solid fa-spinner" />
    </div>
  </>
) : (
  <div>
    <header>
      <Nav />
      <div className="ResultsTitle__content">
        <h1 className="ResultsTitle__content--title">Browse our movies</h1>
        <div className="input-wrap">
          <input
            type="text"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            onKeyUp={(e) => onSearchKeyPress(e.key)}
            placeholder="Search movie"
          />
          <div className="search-wrapper">
            <FontAwesomeIcon
              icon="fa-solid fa-magnifying-glass"
              onClick={() => runSearch(entry)}
              style={{ width: "24px", height: "24px", minWidth: "24px", minHeight: "24px", maxWidth: "24px", maxHeight: "24px" }}
            />
          </div>
        </div>
      </div>
      <figure className="bg__img--wrapper">
        <img src={filmheader} className="bg__img .image-fade-bottom" alt="" />
      </figure>
    </header>
    <section id="results">
      <div className="container">
        <div className="row">
          <div className="results__bar">
            <h1 className="search__info">Search Results:</h1>
            <select
              id="filter"
              value={filter}
              onChange={(event) => filterMovies(event.target.value)}
            >
              <option value="DEFAULT" disabled>
                Sort
              </option>
              <option value="By_Title_A-Z" className="sort__option">
                By Title A-Z
              </option>
              <option value="By_Title_Z-A" className="sort__option">
                By Title Z-A
              </option>
              <option value="Old_to_New" className="sort__option">
                Old to New
              </option>
              <option value="New_to_Old" className="sort__option">
                New to Old
              </option>
            </select>
          </div>
          <div className="movies__list--container">
            {loading ? (
              <div className="movies__list">
                <>
                  {new Array(6).fill(0).map((_, i) => (
                    <div className="movie" key={i}>
                      <div className="skeleton__card">
                        <div className="poster__skeleton"></div>
                        <div className="title__skeleton">
                          <div className="title__skeleton--para"></div>
                        </div>
                        <div className="year__skeleton">
                          <div className="year__skeleton--para"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              </div>
            ) : (
              <div className="movies__list">{showResults()}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  </div>
);
};

export default Results;

