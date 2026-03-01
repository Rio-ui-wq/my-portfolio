import { useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

function BookSearch() {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState([]);

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
  
  // 重複を除いてマージ
  const ids = new Set(titleBooks.map(b => b.id));
  const merged = [...titleBooks, ...authorBooks.filter(b => !ids.has(b.id))];
  
  setBooks(merged);
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>本を追加</h2>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="タイトルや著者名を入力"
      />
      <button onClick={handleSearch}>検索</button>

      <div style={{ marginTop: "20px" }}>
        {books.map((book) => (
          <div key={book.id} style={{ marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>{book.volumeInfo.title}</p>
            <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>
              {book.volumeInfo.authors?.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookSearch;