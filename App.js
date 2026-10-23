import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [activeTab, setActiveTab] = useState<'clips' | 'schedule' | 'analytics'>('clips');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('30-60s');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Platform publishing toggles
  const [platforms, setPlatforms] = useState({
    youtube: true,
    tiktok: true,
    instagram: false,
  });

  const togglePlatform = (key: 'youtube' | 'tiktok' | 'instagram') => {
    setPlatforms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startAnalysis = () => {
    if (!sourceUrl.trim()) {
      Alert.alert('Missing URL', 'Please paste a valid YouTube or Twitch stream link.');
      return;
    }
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => setProcessingStep(2), 2000);
    setTimeout(() => setProcessingStep(3), 4200);
    setTimeout(() => {
      setProcessingStep(4);
      setIsProcessing(false);
      Alert.alert('Analysis Complete', '3 viral 9:16 Shorts extracted & ready to publish.');
    }, 6500);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#05020a" />

      {/* Top Command Bar */}
      <View style={styles.header}>
        <View>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={11} color="#a855f7" />
            <Text style={styles.badgeText}>SDK 58 • AI ENGINE ACTIVE</Text>
          </View>
          <Text style={styles.brandTitle}>ASMO AI STUDIO</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileText}>PRO</Text>
        </TouchableOpacity>
      </View>

      {/* Main Workspace */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. CLIPS T
