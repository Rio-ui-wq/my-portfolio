import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(50);
  const [rating, setRating] = useState(3);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setBook(data));
  }, [bookId]);

  const handleRecord = () => {
    setRecords([...records, { progress, rating }]);
  };

  if (!book) return <div className="book-search"><p>読み込み中...</p></div>;

  return (
    <div className="book-search">
      <p
        style={{ color: "#888", fontSize: "0.9rem", cursor: "pointer", marginBottom: "24px" }}
        onClick={() => navigate("/")}
      >
        ← 戻る
      </p>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginBottom: "32px" }}>
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            style={{ width: "100px", borderRadius: "2px" }}
          />
        )}
        <div>
          <h1 style={{ marginBottom: "8px" }}>{book.volumeInfo.title}</h1>
          <p style={{ color: "#888", fontSize: "0.9rem", margin: 0 }}>
            {book.volumeInfo.authors?.join(", ")}
          </p>
          <p style={{ color: "#888", fontSize: "0.9rem", margin: "4px 0 0" }}>
            {book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount}ページ` : "ページ数不明"}
          </p>
        </div>
      </div>

      {records.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h2>記録グラフ</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={records}>
              <XAxis dataKey="progress" tickFormatter={(v) => `${v}%`} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
              <Tooltip formatter={(value) => [`${value}`, "面白さ"]} labelFormatter={(label) => `${label}%時点`} />
              <Line type="monotone" dataKey="rating" stroke="#2c2c2c" dot={true} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: "16px" }}>
            {records.map((r, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #eee", fontSize: "0.9rem" }}>
                {r.progress}%時点 ／ 面白さ {r.rating} / 5
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "32px" }}>
        <h2>記録を追加</h2>

        <div style={{ marginTop: "16px" }}>
          <label style={{ fontSize: "0.9rem", color: "#555" }}>
            読んだ割合：{progress}%
            {book.volumeInfo.pageCount && (
              <span style={{ color: "#aaa", marginLeft: "8px" }}>
                （約{Math.round(book.volumeInfo.pageCount * progress / 100)}ページ）
              </span>
            )}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ width: "100%", marginTop: "8px" }}
          />
        </div>

        <div style={{ marginTop: "24px" }}>
          <label style={{ fontSize: "0.9rem", color: "#555" }}>
            面白さ：{rating} / 5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ width: "100%", marginTop: "8px" }}
          />
        </div>

        <button onClick={handleRecord} style={{
          marginTop: "24px",
          padding: "10px 24px",
          background: "#2c2c2c",
          color: "#fff",
          border: "none",
          borderRadius: "2px",
          fontFamily: "inherit",
          cursor: "pointer"
        }}>記録する</button>
      </div>
    </div>
  );
}

export default BookDetail;