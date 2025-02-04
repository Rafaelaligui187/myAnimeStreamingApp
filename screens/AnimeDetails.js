import { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import { Video } from 'expo-av'; // Import the Video component from expo-av
import { useNavigation } from "@react-navigation/native"; // Import navigation

export default function AnimeDetails({ route }) {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null); // State to store the selected episode video URL
  const { id } = route.params; // Get the id passed from navigation

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const url = `https://consumet-api-3hiw.onrender.com/anime/gogoanime/info/${id}`;
        const response = await axios.get(url);
        setAnime(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchAnimeDetails();
  }, [id]);

  const navigation = useNavigation();

  const handleEpisodePress = async (episodeId) => {
    try {
      const url = `https://consumet-api-3hiw.onrender.com/anime/gogoanime/watch/${episodeId}`;
      const response = await axios.get(url);
  
      console.log(response.data); // Debugging
  
      // Find a direct .mp4 or .m3u8 link
      const directSource = response.data.sources.find(src => src.isM3U8 || src.url.endsWith(".mp4"));
  
      if (directSource) {
        navigation.navigate("AnimePlayer", { videoUrl: directSource.url });
      } else {
        alert("No direct video source available.");
      }
    } catch (err) {
      alert("Error fetching episode URL");
      console.error(err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#795C97" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error fetching anime details</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Anime Image */}
      <Image source={{ uri: anime.image }} style={styles.animeImage} />

      {/* Anime Title */}
      <Text style={styles.animeTitle}>{anime.title}</Text>

      {/* Genre */}
      <Text style={styles.animeText}>Genre: {Array.isArray(anime.genres) ? anime.genres.join(", ") : "N/A"}</Text>

      {/* Description */}
      <Text style={styles.animeText}>{anime.description || "No description available"}</Text>

      {/* Status */}
      <Text style={styles.animeText}>Status: {anime.status || "Unknown"}</Text>

      {/* Release Date */}
      <Text style={styles.animeText}>Release Date: {anime.releaseDate || "Not Available"}</Text>

      {/* Other Name */}
      {anime.otherName && <Text style={styles.animeText}>Other Name: {anime.otherName}</Text>}

      {/* Episodes */}
      <Text style={styles.animeText}>Total Episodes: {anime.totalEpisodes}</Text>

      <View>
        {anime.episodes?.map((episode) => (
          <TouchableOpacity
            key={episode.id}
            style={styles.episode}
            onPress={() => handleEpisodePress(episode.id)}
          >
            <Text style={styles.episodeText}>Episode {episode.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Video Player */}
      {videoUrl && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: videoUrl }} // Video URL from the episode selection
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            style={styles.videoPlayer}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#303030",
    padding: 20,
  },
  animeImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  animeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  animeText: {
    color: "#ccc",
    marginVertical: 5,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
  },
  episode: {
    marginBottom: 10,
    backgroundColor: "#795C97",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#5f4b8b",
  },
  episodeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  videoContainer: {
    marginTop: 20,
    width: "100%",
    height: 200,
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  episodeContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
};
