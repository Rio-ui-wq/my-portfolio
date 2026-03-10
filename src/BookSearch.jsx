import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Heading, Input, Button, Text, VStack, HStack,
  Container, Tag
} from "@chakra-ui/react";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

function BookSearch({ user, selectedBooks, setSelectedBooks, bookStatuses }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState([]);
  useEffect(() => {
  if (!user) return;
  fetch(`${API_URL}/bookshelf/${user.uid}`)
    .then(res => res.json())
    .then(data => {
      const books = data.map(item => ({
        id: item.bookId,
        volumeInfo: {
          title: item.bookTitle,
          authors: item.bookAuthor ? [item.bookAuthor] : [],
          imageLinks: item.bookThumbnail ? { thumbnail: item.bookThumbnail } : undefined
        }
      }));
      setSelectedBooks(books);
    });
}, [user]);


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
    <Box minH="100vh" bg="#f7f6f2" py={{ base: 8, md: 14 }}>
      <Container maxW="620px" px={{ base: 5, md: 8 }}>

        <Box mb={10}>
          <Heading
            fontFamily="'Noto Serif JP', serif"
            fontSize={{ base: "2xl", md: "3xl" }}
            color="#3a3a3a"
            letterSpacing="0.05em"
            mb={1}
          >
            読書離脱率記録
          </Heading>
          <Text fontSize="sm" color="#9a9a8a">
            {user?.displayName} さんの本棚
          </Text>
        </Box>

        {selectedBooks.length > 0 && (
        <Box mb={8}>
          <Text fontSize="xs" fontWeight="bold" color="#9a9a8a" letterSpacing="0.1em" mb={3}>
            MY BOOKS
          </Text>
          <VStack align="stretch" spacing={2}>
            {selectedBooks.map((book) => (
              <Box
                key={book.id}
                p={4}
                bg="white"
                borderRadius="2xl"
                boxShadow="0 2px 8px rgba(0,0,0,0.06)"
                transition="all 0.2s"
                _hover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)", transform: "translateY(-1px)" }}
              >
                <HStack justify="space-between" align="center">
                  <Box
                    flex="1"
                    cursor="pointer"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="#3a3a3a" fontWeight="medium">
                        {book.volumeInfo.title}
                      </Text>
                      {bookStatuses[book.id] === "finished" && (
                        <Text fontSize="xs" color="#6090b0" bg="#f0f5fa" px={2} py={0.5} borderRadius="full">
                          読了
                        </Text>
                      )}
                      {bookStatuses[book.id] === "dropped" && (
                        <Text fontSize="xs" color="#c07070" bg="#fdf0f0" px={2} py={0.5} borderRadius="full">
                          離脱
                        </Text>
                      )}
                    </HStack>
                    <Text fontSize="xs" color="#b0a99a" mt={0.5}>
                      {book.volumeInfo.authors?.join(", ")}
                    </Text>
                  </Box>
    <Button
      size="xs"
      variant="ghost"
      color="#c0b9aa"
      _hover={{ color: "#c07070" }}
      onClick={async (e) => {
        e.stopPropagation();
        await fetch(`${API_URL}/bookshelf/${user.uid}/${book.id}`, {
          method: "DELETE"
        });
        setSelectedBooks(selectedBooks.filter(b => b.id !== book.id));
      }}
    >
      ✕
    </Button>
  </HStack>
</Box>
            ))}
          </VStack>
        </Box>
      )}

        <Box mb={6}>
          <Text fontSize="xs" fontWeight="bold" color="#9a9a8a" letterSpacing="0.1em" mb={3}>
            SEARCH
          </Text>
          <HStack>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="タイトルや著者名を入力"
              bg="white"
              border="none"
              borderRadius="2xl"
              boxShadow="0 2px 8px rgba(0,0,0,0.06)"
              fontSize="sm"
              color="#3a3a3a"
              _placeholder={{ color: "#c0b9aa" }}
              _focus={{ boxShadow: "0 2px 12px rgba(0,0,0,0.12)", outline: "none" }}
              h="48px"
            />
            <Button
              onClick={handleSearch}
              bg="#7a9e8e"
              color="white"
              borderRadius="2xl"
              h="48px"
              px={6}
              fontSize="sm"
              fontWeight="medium"
              _hover={{ bg: "#6a8e7e" }}
              flexShrink={0}
            >
              検索
            </Button>
          </HStack>
        </Box>

        <VStack align="stretch" spacing={3}>
          {books.map((book) => (
            <HStack
              key={book.id}
              p={4}
              bg="white"
              borderRadius="2xl"
              boxShadow="0 2px 8px rgba(0,0,0,0.06)"
              justify="space-between"
              align="center"
            >
              <Box flex="1" mr={3}>
                <Text fontSize="sm" fontWeight="medium" color="#3a3a3a">
                  {book.volumeInfo.title}
                </Text>
                <Text fontSize="xs" color="#b0a99a" mt={0.5}>
                  {book.volumeInfo.authors?.join(", ")}
                </Text>
              </Box>
              <Button
                size="sm"
                bg={selectedBooks.find(b => b.id === book.id) ? "#e8f0ec" : "#f0f0ea"}
                color={selectedBooks.find(b => b.id === book.id) ? "#7a9e8e" : "#8a8a7a"}
                borderRadius="xl"
                fontSize="xs"
                fontWeight="medium"
                _hover={{ bg: "#e8f0ec", color: "#7a9e8e" }}
                onClick={async () => {
                    if (!selectedBooks.find(b => b.id === book.id)) {
                      setSelectedBooks([...selectedBooks, book]);
                      await fetch(`${API_URL}/bookshelf`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userId: user.uid,
                          bookId: book.id,
                          bookTitle: book.volumeInfo.title,
                          bookAuthor: book.volumeInfo.authors?.join(", "),
                          bookThumbnail: book.volumeInfo.imageLinks?.thumbnail
                        })
                      });
                    }
                  }}
              >
                {selectedBooks.find(b => b.id === book.id) ? "追加済み" : "追加"}
              </Button>
            </HStack>
          ))}
        </VStack>

      </Container>
    </Box>
  );
}

export default BookSearch;