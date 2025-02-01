import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function AnimePlayer({ route }) {
  const { videoUrl } = route.params; // Get the streaming URL passed from AnimeDetails

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: videoUrl }} 
        startInLoadingState 
        renderLoading={() => <ActivityIndicator size="large" color="#795C97" />}
        allowsFullscreenVideo
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
