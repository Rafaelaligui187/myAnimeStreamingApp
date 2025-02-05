import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";

export default function Home({ navigation }) {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debounceTimeout = useRef(null);

  const fetchAnimeData = (query, page, isInitial = false) => {
    const url = query
      ? `https://consumet-api-3hiw.onrender.com/anime/gogoanime/${query}`
      : `https://consumet-api-3hiw.onrender.com/anime/gogoanime/top`;

    setLoading(true);
    axios
      .get(url, { params: { page } })
      .then((response) => {
        if (response.data.results.length === 0) {
          setHasMore(false);
        } else {
          setAnimeData((prevData) =>
            isInitial || page === 1
              ? response.data.results
              : [...prevData, ...response.data.results]
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnimeData("", 1, true);
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (searchQuery) {
        setPage(1);
        setAnimeData([]);
        setHasMore(true);
        fetchAnimeData(searchQuery, 1);
      }
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  const renderAnimeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.animeItem}
      onPress={() => navigation.navigate("AnimeDetails", { id: item.id })} // Use navigation to go to AnimeDetails screen
    >
      <Image source={{ uri: item.image }} style={styles.animeImage} />
      <Text style={styles.animeTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchAnimeData(searchQuery, nextPage);
        return nextPage;
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperbg}>
        <Text style={styles.text}>myAnimeApp</Text>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search Anime"
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Anime List */}
      <FlatList
        data={animeData}
        renderItem={renderAnimeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={3}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color="#795C97" style={styles.loader} />
          ) : null
        }
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#303030",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  upperbg: {
    backgroundColor: "#795C97",
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#000",
    marginTop: 10,
  },
  list: {
    width: "100%",
    padding: 10,
    paddingBottom: 16,
  },
  animeItem: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    margin: 15,
  },
  animeImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  animeTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    maxWidth: 120,
    flexWrap: "wrap",
  },
  loader: {
    marginVertical: 10,
  },
};
