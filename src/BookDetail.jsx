import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Box, Text, Button, Container, HStack, VStack,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb, SimpleGrid, Image
} from "@chakra-ui/react";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

function BookDetail({ user, setBookStatuses }) {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(50);
  const [rating, setRating] = useState(3);
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [droppedRecords, setDroppedRecords] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setBook(data));

    fetch(`${API_URL}/records/${bookId}`)
      .then(res => res.json())
      .then(data => setAllRecords(data));

    fetch(`${API_URL}/records/${bookId}/mine?userId=${user.uid}`)
      .then(res => res.json())
      .then(data => setRecords(data));

      fetch(`${API_URL}/records/${bookId}/dropped`)
      .then(res => res.json())
      .then(data => setDroppedRecords(data));

      fetch(`${API_URL}/records/${bookId}/stats`)
      .then(res => res.json())
      .then(data => setStats(data));

  }, [bookId]);

  const handleRecord = async () => {
    if (!progress || !rating) return;
    const newRecord = {
      bookId,
      bookTitle: book.volumeInfo.title,
      progress,
      rating,
      userId: user.uid,
      userDisplayName: user.displayName
    };
    await fetch(`${API_URL}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord)
    });
    setRecords(prev => {
      const filtered = prev.filter(r => r.progress !== progress);
      return [...filtered, { progress, rating }].sort((a, b) => a.progress - b.progress);
    });
  };

  const handleDrop = async () => {
  const dropRecord = {
    bookId,
    bookTitle: book.volumeInfo.title,
    progress,
    rating: 0,
    userId: user.uid,
    userDisplayName: user.displayName,
    dropped: true
  };
  await fetch(`${API_URL}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dropRecord)
  });
  setBookStatuses(prev => ({ ...prev, [bookId]: "dropped" }));
  alert(`${progress}%で離脱記録を保存しました`);
};

const handleFinish = async () => {
  const finishRecord = {
    bookId,
    bookTitle: book.volumeInfo.title,
    progress: 100,
    rating,
    userId: user.uid,
    userDisplayName: user.displayName,
    finished: true
  };
  await fetch(`${API_URL}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finishRecord)
  });
  setBookStatuses(prev => ({ ...prev, [bookId]: "finished" }));
  alert("読了記録を保存しました");
};

  if (!book) return (
    <Box minH="100vh" bg="#f7f6f2" display="flex" alignItems="center" justifyContent="center">
      <Text color="#9a9a8a">読み込み中...</Text>
    </Box>
  );

  return (
    <Box minH="100vh" bg="#f7f6f2" py={{ base: 6, md: 10 }}>
      <Container maxW="720px" px={{ base: 5, md: 8 }}>

        <Text
          fontSize="sm" color="#9a9a8a" cursor="pointer" mb={6}
          onClick={() => navigate("/")}
          _hover={{ color: "#3a3a3a" }}
        >
          ← 戻る
        </Text>

        <HStack align="flex-start" mb={8} spacing={5}>
          {book.volumeInfo.imageLinks?.thumbnail && (
            <Image
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              w={{ base: "70px", md: "90px" }}
              borderRadius="lg"
              boxShadow="0 2px 8px rgba(0,0,0,0.12)"
              flexShrink={0}
            />
          )}
          <Box>
            <Text fontFamily="'Noto Serif JP', serif" fontSize={{ base: "lg", md: "xl" }} color="#3a3a3a" fontWeight="bold">
              {book.volumeInfo.title}
            </Text>
            <Text fontSize="sm" color="#9a9a8a" mt={1}>{book.volumeInfo.authors?.join(", ")}</Text>
            <Text fontSize="sm" color="#9a9a8a">
              {book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount}ページ` : "ページ数不明"}
            </Text>
          </Box>
        </HStack>

        {stats && stats.total > 0 && (
          <Box mt={3} p={3} bg="white" borderRadius="xl" boxShadow="0 2px 8px rgba(0,0,0,0.06)">
            <Text fontSize="xs" color="#9a9a8a">
              この本を読んだ <Text as="span" fontWeight="bold" color="#3a3a3a">{stats.total}人</Text> 中{" "}
              <Text as="span" fontWeight="bold" color="#c07070">{stats.dropped}人</Text> が途中でやめています
              （離脱率 <Text as="span" fontWeight="bold" color="#c07070">{stats.dropRate}%</Text>）
            </Text>
          </Box>
        )}

        {(records.length > 0 || allRecords.length > 0) && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
            {records.length > 0 && (
              <Box bg="white" borderRadius="2xl" boxShadow="0 2px 8px rgba(0,0,0,0.06)" p={4}>
                <Text fontSize="xs" fontWeight="bold" color="#9a9a8a" letterSpacing="0.1em" mb={3}>MY RECORD</Text>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={records}>
                    <XAxis dataKey="progress" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${v}`, "面白さ"]} labelFormatter={(l) => `${l}%時点`} />
                    <Line type="monotone" dataKey="rating" stroke="#7a9e8e" strokeWidth={2} dot={{ fill: "#7a9e8e" }} />
                  </LineChart>
                </ResponsiveContainer>
                <VStack align="stretch" mt={3} spacing={1}>
                  {records.map((r, i) => (
                    <Text key={i} fontSize="xs" color="#9a9a8a" borderBottom="1px solid #f0ede8" pb={1}>
                      {r.progress}%時点 ／ 面白さ {r.rating} / 5
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}

            {allRecords.length > 0 && (
              <Box bg="white" borderRadius="2xl" boxShadow="0 2px 8px rgba(0,0,0,0.06)" p={4}>
                <Text fontSize="xs" fontWeight="bold" color="#9a9a8a" letterSpacing="0.1em" mb={3}>ALL RECORDS</Text>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={allRecords}>
                    <XAxis dataKey="progress" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${v}`, "面白さ"]} labelFormatter={(l) => `${l}%時点`} />
                    <Line type="monotone" dataKey="rating" stroke="#b0a99a" strokeWidth={2} dot={{ fill: "#b0a99a" }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
          </SimpleGrid>
        )}
        {droppedRecords.length > 0 && (
          <Box bg="white" borderRadius="2xl" boxShadow="0 2px 8px rgba(0,0,0,0.06)" p={4} mb={8}>
            <Text fontSize="xs" fontWeight="bold" color="#9a9a8a" letterSpacing="0.1em" mb={3}>
              DROPOUT POINTS
            </Text>
            <Text fontSize="xs" color="#b0a99a" mb={3}>
              {droppedRecords.length}人が途中でやめています
            </Text>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={droppedRecords}>
                <XAxis dataKey="progress" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip labelFormatter={(l) => `${l}%で離脱`} formatter={() => [""]} />
                <Line type="monotone" dataKey="progress" stroke="#e0a0a0" strokeWidth={2} dot={{ fill: "#e0a0a0" }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        <Box bg="white" borderRadius="2xl" boxShadow="0 2px 8px rgba(0,0,0,0.06)" p={6}>
          <Text fontSize="xs" fontWeight="bold" color="#9a9a8a" letterSpacing="0.1em" mb={5}>ADD RECORD</Text>

          <Box mb={6}>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="#3a3a3a">読んだ割合</Text>
              <Text fontSize="sm" color="#7a9e8e" fontWeight="bold">
                {progress}%
                {book.volumeInfo.pageCount && (
                  <Text as="span" fontSize="xs" color="#b0a99a" ml={2}>
                    （約{Math.round(book.volumeInfo.pageCount * progress / 100)}ページ）
                  </Text>
                )}
              </Text>
            </HStack>
            <Slider min={0} max={100} value={progress} onChange={setProgress}>
              <SliderTrack bg="#f0ede8" borderRadius="full">
                <SliderFilledTrack bg="#7a9e8e" />
              </SliderTrack>
              <SliderThumb boxSize={5} bg="#7a9e8e" />
            </Slider>
          </Box>

          <Box mb={6}>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="#3a3a3a">面白さ</Text>
              <Text fontSize="sm" color="#7a9e8e" fontWeight="bold">{rating} / 5</Text>
            </HStack>
            <Slider min={1} max={5} value={rating} onChange={setRating}>
              <SliderTrack bg="#f0ede8" borderRadius="full">
                <SliderFilledTrack bg="#7a9e8e" />
              </SliderTrack>
              <SliderThumb boxSize={5} bg="#7a9e8e" />
            </Slider>
          </Box>

          <Button
            onClick={handleRecord}
            bg="#7a9e8e"
            color="white"
            borderRadius="2xl"
            w="full"
            _hover={{ bg: "#6a8e7e" }}
          >
            記録する
          </Button>
          <Button
          onClick={handleDrop}
          variant="outline"
          borderColor="#e0a0a0"
          color="#c07070"
          borderRadius="2xl"
          w="full"
          mt={3}
          _hover={{ bg: "#fdf0f0" }}
        >
          途中でやめた
        </Button>
        <Button
        onClick={handleFinish}
        variant="outline"
        borderColor="#a0c0e0"
        color="#6090b0"
        borderRadius="2xl"
        w="full"
        mt={3}
        _hover={{ bg: "#f0f5fa" }}
      >
        読了
      </Button>
        </Box>

      </Container>
    </Box>
  );
}

export default BookDetail;