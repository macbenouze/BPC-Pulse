import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { saveMetrics, getMetrics, MetricsData } from '../storage/morningMetrics';

export default function Index() {
  const [heartRate, setHeartRate] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [wellness, setWellness] = useState('');

  useEffect(() => {
    async function load() {
      const metrics = await getMetrics();
      if (metrics) {
        setHeartRate(String(metrics.heartRate));
        setSleepQuality(String(metrics.sleepQuality));
        setWellness(String(metrics.wellness));
      }
    }
    load();
  }, []);

  const validate = (): MetricsData | null => {
    const hr = Number(heartRate);
    const sq = Number(sleepQuality);
    const wel = Number(wellness);
    if (
      isNaN(hr) || hr < 30 || hr > 220 ||
      isNaN(sq) || sq < 1 || sq > 10 ||
      isNaN(wel) || wel < 1 || wel > 5
    ) {
      Alert.alert('Invalid input', 'Please enter valid numbers.');
      return null;
    }
    return { heartRate: hr, sleepQuality: sq, wellness: wel };
  };

  const save = async () => {
    const data = validate();
    if (data) {
      await saveMetrics(data);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'Your metrics have been saved.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Morning Check-In</Text>
      <View style={styles.inputRow}>
        <Ionicons name="heart" size={24} />
        <TextInput
          style={styles.input}
          placeholder="Heart Rate"
          keyboardType="numeric"
          value={heartRate}
          onChangeText={setHeartRate}
        />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="bed" size={24} />
        <TextInput
          style={styles.input}
          placeholder="Sleep Quality (1-10)"
          keyboardType="numeric"
          value={sleepQuality}
          onChangeText={setSleepQuality}
        />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="happy" size={24} />
        <TextInput
          style={styles.input}
          placeholder="Wellness (1-5)"
          keyboardType="numeric"
          value={wellness}
          onChangeText={setWellness}
        />
      </View>
      <Button title="Save" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', gap: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
});
