import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, signInWithGoogle, signOutUser } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Button, Text, HStack } from "@chakra-ui/react";
import BookSearch from "./BookSearch";
import BookDetail from "./BookDetail";

function App() {
  const [user, setUser] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookStatuses, setBookStatuses] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  if (!user) {
    return (
      <Box minH="100vh" bg="#f7f6f2" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center" fontFamily="'Noto Serif JP', serif">
          <Text fontSize="2xl" color="#3a3a3a" mb={2}>読書離脱率記録</Text>
          <Text fontSize="sm" color="#9a9a8a" mb={8}>ログインして読書記録をはじめよう</Text>
          <Button
            onClick={signInWithGoogle}
            bg="#3a3a3a"
            color="white"
            borderRadius="2xl"
            px={8}
            py={6}
            fontSize="sm"
            _hover={{ bg: "#555" }}
          >
            Googleでログイン
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="#f7f6f2" minH="100vh">
      <Box maxW="680px" mx="auto" px={6} py={4}>
        <HStack justify="flex-end">
          <Text fontSize="xs" color="#9a9a8a">{user.displayName}</Text>
          <Button
            onClick={signOutUser}
            size="xs"
            variant="outline"
            borderColor="#ccc"
            color="#9a9a8a"
            borderRadius="xl"
            _hover={{ bg: "gray.100" }}
          >
            ログアウト
          </Button>
        </HStack>
      </Box>
      <Routes>
        <Route path="/" element={<BookSearch user={user} selectedBooks={selectedBooks} setSelectedBooks={setSelectedBooks} bookStatuses={bookStatuses} />} />
        <Route path="/book/:bookId" element={<BookDetail user={user} setBookStatuses={setBookStatuses} />} />
      </Routes>
    </Box>
  );
}

export default App;