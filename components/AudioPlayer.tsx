import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const AudioPlayer = () => {
  const [sound, setSound] = useState<any>(null);

  const playAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { shouldPlay: true }
    );
    setSound(sound);
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Play Audio" onPress={playAudio} />
      <Button title="Stop Audio" onPress={stopAudio} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioPlayer;
