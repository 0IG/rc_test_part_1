import React, { useState } from "react";
import axios from "axios";
import "./SearchMovies.scss";

const SearchMovies = () => {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:3001/search?title=${title}`
      );
      console.log(response);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="search">
      <div className="search__info">
        Only search movie titles below:
        <ul className="search__list">
          <li className="search__list-item">The Matrix</li>
          <li className="search__list-item">The Godfather</li>
          <li className="search__list-item">The Dark Knight</li>
          <li className="search__list-item">Pulp Fiction</li>
          <li className="search__list-item">Inception</li>
          <li className="search__list-item">Avatar</li>
          <li className="search__list-item">Titanic</li>
        </ul>
      </div>
      <form onSubmit={handleSearch} className="search__form">
        <label className="search__label">
          Movie Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="search__input"
          />
        </label>
        <button type="submit" className="search__btn">Search</button>
      </form>
      {results.length === 1 && results.length < 21 && (
        <ul>
          {results.map((result, index) => {
            const date = new Date(result.release_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            const formattedDate = `${year}-${month}-${day}`;
            return (
              <li key={index}>
                {result.title} release date: {formattedDate}{" "}
              </li>
            );
          })}
        </ul>
      )}
      ------------------------
      <div>
        Insert the line below into the input box:(including the ')
        <br />
        <span>' OR 1=1; SELECT * FROM users --</span>
      </div>
      <div>
        {results.length > 1 && (
          <ol>
            {results.map((result, index) => (
              <li key={index}>{result.name}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default SearchMovies;
