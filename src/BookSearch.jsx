import { useState } from "react";
import "./BookSearch.css";
import { useNavigate } from "react-router-dom";


const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

function BookSearch({ user }) {
    const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleSearch = async () => {
    if (!keyword) return;
    
    const [titleRes, authorRes] = await Promise.all([
      fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${keyword}&maxResults=20&key=${API_KEY}`),
      fetch(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${keyword}&maxResults=20&key=${API_KEY}`)
    ]);
    
    const titleData = await titleRes.json();
    const authorData = await authorRes.json();
    
    const titleBooks = titleData.items || [];
    const authorBooks = authorData.items || [];
    
    const ids = new Set(titleBooks.map(b => b.id));
    const merged = [...titleBooks, ...authorBooks.filter(b => !ids.has(b.id))];
    
    setBooks(merged);
  };

  return (
  <div className="book-search">
    <h1>読書離脱率記録</h1>
    <div className="selected-section">
      <h2>追加した本</h2>
      {selectedBooks.map((book) => (
  <div
    key={book.id}
    className="selected-item"
    onClick={() => navigate(`/book/${book.id}`)}
    style={{ cursor: "pointer" }}
  >
    {book.volumeInfo.title}
  </div>
))}
    </div>
    <div className="search-bar">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="タイトルや著者名を入力"
      />
      <button onClick={handleSearch}>検索</button>
    </div>

    <div>
      {books.map((book) => (
        <div key={book.id} className="book-item">
          <div className="book-info">
            <p className="book-title">{book.volumeInfo.title}</p>
            <p className="book-author">{book.volumeInfo.authors?.join(", ")}</p>
          </div>
          <button className="add-button" onClick={() => {
            if (!selectedBooks.find(b => b.id === book.id)) {
              setSelectedBooks([...selectedBooks, book]);
            }
          }}>追加</button>
        </div>
      ))}
    </div>
  </div>
);
}

export default BookSearch;