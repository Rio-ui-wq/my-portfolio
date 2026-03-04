import { Routes, Route } from "react-router-dom";
import BookSearch from "./BookSearch";
import BookDetail from "./BookDetail";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BookSearch />} />
        <Route path="/book/:bookId" element={<BookDetail />} />
      </Routes>
    </div>
  );
}

export default App;