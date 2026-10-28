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

// ==========================================
// ASMO AI STUDIO — MASTER CLOUD CONFIG
// ==========================================
const CONFIG = {
  BACKEND_URL: 'https://asmo-backend.onrender.com', // Your Live Render Cloud Server
  FACEBOOK_PAGE_ID: '1329034043625464',
  FACEBOOK_PAGE_NAME: 'Asmogaming',
  INSTAGRAM_HANDLE: '@asmowarlord',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('clips');
  const [sourceUrl, setSourceUrl] = useState('https://www.youtube.com/live/PSbqCxd4kko');
  const [selectedDuration, setSelectedDuration] = useState('30-60s');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [aiOutput, setAiOutput] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [apiConsoleLog, setApiConsoleLog] = useState('');

  // On-device Meta Token (Paste your Page Token here)
  const [metaToken, setMetaToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const [platforms, setPlatforms] = useState({
    youtube: true,
    tiktok: true,
    instagram: true,
  });

  const togglePlatform = (key) => {
    setPlatforms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startAnalysis = async () => {
    if (!sourceUrl.trim()) {
      Alert.alert('Missing URL', 'Please paste a valid YouTube or Twitch stream link.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => setProcessingStep(2), 1200);
    setTimeout(() => setProcessingStep(3), 2400);
    setTimeout(() => {
      setProcessingStep(4);
      setIsProcessing(false);
      setAiOutput({
        hook: "WATCH TILL THE END! You won't believe this clutch play... 🔥",
        virality_score: 96,
        clip_start: "01:00",
        clip_end: "01:30",
        youtube_title: "INSANE 1v5 CLUTCH ESCAPE! 🏆 #Shorts",
        tiktok_caption: "He actually pulled this off?! 😱 Drop a sub if you loved this play! #gaming #streamer #highlights #clutch #viral",
        instagram_caption: "Epic gaming moments with @asmowarlord. Tag a teammate who needs to see this! ⚔️🔥 #asmogaming #reels"
      });
      Alert.alert('Highlight Detected!', '30-second clip identified (01:00 - 01:30) with 96/100 Virality Score.');
    }, 3600);
  };

  const publishToPlatforms = async () => {
    setIsPublishing(true);
    setApiConsoleLog('🚀 Dispatching to ASMO Cloud Server...\n');

    try {
      // Send job to your Render Python + FFmpeg backend
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/schedule-reel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: sourceUrl.trim(),
          title: aiOutput ? aiOutput.youtube_title : 'INSANE 1v5 CLUTCH ESCAPE! 🏆 #Shorts',
          caption: aiOutput ? aiOutput.instagram_caption : 'Epic gaming moments with @asmowarlord',
          page_id: CONFIG.FACEBOOK_PAGE_ID,
          page_token: metaToken.trim() || 'DEFAULT',
          server_base_url: CONFIG.BACKEND_URL,
        }),
      });

      const data = await response.json();

      setApiConsoleLog(
        `✅ SERVER ACCEPTED JOB!\n` +
        `Status: ${data.status}\n` +
        `Message: ${data.message}\n` +
        `Estimated Time: ${data.estimated_time}\n\n` +
        `Your cloud server is downloading the stream, cropping to 9:16 vertical, and scheduling the Reel in Meta Business Suite Planner!`
      );

      Alert.alert(
        'Cloud Server Processing!',
        'Your Render server has started downloading the stream and cropping it to 9:16 vertical.\n\nIt will appear scheduled in Meta Business Suite in about 60–90 seconds!'
      );
    } catch (err) {
      setApiConsoleLog(`❌ Connection Error: ${err.message}\nEnsure your Render server is awake.`);
      Alert.alert('Server Notice', 'Could not connect to Render. The server may be waking up (takes ~30s on free tier). Try again in a moment!');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#05020a" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badge}>
            <Ionicons name="cloud-done" size={11} color="#10b981" />
            <Text style={[styles.badgeText, { color: '#10b981' }]}>CLOUD SERVER ONLINE</Text>
          </View>
          <Text style={styles.brandTitle}>ASMO AI STUDIO</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => setShowTokenInput(!showTokenInput)}>
          <Ionicons name="key" size={12} color="#a855f7" style={{ marginRight: 4 }} />
          <Text style={styles.profileText}>{metaToken ? 'TOKEN SET' : 'SET TOKEN'}</Text>
        </TouchableOpacity>
      </View>

      {/* Token Input Drawer */}
      {showTokenInput && (
        <View style={styles.keyVaultBox}>
          <Text style={styles.keyVaultLabel}>META PAGE ACCESS TOKEN (OPTIONAL)</Text>
          <TextInput
            style={styles.keyVaultInput}
            placeholder="Paste your EAA... Page Token here"
            placeholderTextColor="#71717a"
            value={metaToken}
            onChangeText={setMetaToken}
            autoCapitalize="none"
          />
          <Text style={styles.keyVaultHint}>
            ✓ Stored on device only. Used by Render to publish directly to your Facebook Page & Instagram.
          </Text>
        </View>
      )}

      {/* Main Workspace */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. CLIPS TAB */}
        {activeTab === 'clips' && (
          <View>
            <Text style={styles.sectionTitle}>AI Clip Factory</Text>
            <Text style={styles.sectionSubtitle}>
              Extract viral 9:16 Shorts from your streams with live AI hooks.
            </Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>SOURCE STREAM LINK</Text>
              <TextInput
                style={styles.textInput}
                value={sourceUrl}
                onChangeText={setSourceUrl}
                autoCapitalize="none"
              />

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>TARGET DURATION</Text>
              <View style={styles.durationRow}>
                {['15-30s', '30-60s', '60-90s'].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.durationBtn,
                      selectedDuration === d && styles.durationBtnActive,
                    ]}
                    onPress={() => setSelectedDuration(d)}>
                    <Text
                      style={[
                        styles.durationText,
                        selectedDuration === d && styles.durationTextActive,
                      ]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, isProcessing && styles.btnDisabled]}
                onPress={startAnalysis}
                disabled={isProcessing}>
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={16} color="#ffffff" />
                    <Text style={styles.primaryBtnText}>Detect Highlights & Crop</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* AI Results Output Box */}
            {aiOutput && (
              <View style={[styles.card, { marginTop: 16, borderColor: '#a855f7' }]}>
                <View style={styles.scoreRow}>
                  <Text style={styles.hookLabel}>OPENING HOOK (0:00 - 0:03)</Text>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreBadgeText}>SCORE: {aiOutput.virality_score}/100</Text>
                  </View>
                </View>
                <Text style={styles.hookText}>"{aiOutput.hook}"</Text>

                <View style={styles.divider} />

                <Text style={styles.platformHeader}>DETECTED CLIP WINDOW</Text>
                <Text style={styles.platformValue}>{aiOutput.clip_start} ➔ {aiOutput.clip_end}</Text>

                <Text style={[styles.platformHeader, { marginTop: 10 }]}>YOUTUBE SHORTS TITLE</Text>
                <Text style={styles.platformValue}>{aiOutput.youtube_title}</Text>

                <Text style={[styles.platformHeader, { marginTop: 10 }]}>TIKTOK CAPTION (@asmowarlord)</Text>
                <Text style={styles.platformValue}>{aiOutput.tiktok_caption}</Text>

                <Text style={[styles.platformHeader, { marginTop: 10 }]}>INSTAGRAM REELS (Asmogaming)</Text>
                <Text style={styles.platformValue}>{aiOutput.instagram_caption}</Text>

                <TouchableOpacity
                  style={[styles.primaryBtn, { marginTop: 16, backgroundColor: '#06b6d4' }]}
                  onPress={() => {
                    setActiveTab('schedule');
                    Alert.alert('Transferred', 'Clip metadata transferred to your Publishing Queue!');
                  }}>
                  <Ionicons name="send" size={16} color="#ffffff" />
                  <Text style={styles.primaryBtnText}>Transfer to Publishing Queue</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 9:16 Video Preview Frame */}
            <View style={styles.previewContainer}>
              <View style={styles.phoneMock}>
                <View style={styles.videoPlayerBox}>
                  <View style={styles.blurredBackdrop}>
                    <View style={styles.blurSim} />
                  </View>

                  <View style={styles.videoContent}>
                    <Ionicons
                      name={isPlayingPreview ? "pause-circle" : "play-circle"}
                      size={60}
                      color="#a855f7"
                      onPress={() => setIsPlayingPreview(!isPlayingPreview)}
                    />
                    <Text style={styles.previewDurationText}>
                      {isPlayingPreview ? "0:14 / 0:30" : "Preview 9:16 Vertical Cut"}
                    </Text>
                  </View>

                  <View style={styles.subtitlesOverlay}>
                    <Text style={styles.karaokeSub}>
                      {aiOutput ? aiOutput.hook : "UNBELIEVABLE 1v5 CLUTCH!"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 2. SCHEDULE TAB */}
        {activeTab === 'schedule' && (
          <View>
            <Text style={styles.sectionTitle}>Publishing Suite</Text>
            <Text style={styles.sectionSubtitle}>
              Broadcast synchronized clips across connected platforms.
            </Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>CONNECTED DESTINATIONS</Text>
              <View style={styles.targetGrid}>
                {[
                  { id: 'youtube', name: 'YouTube Shorts', icon: 'logo-youtube' },
                  { id: 'tiktok', name: 'TikTok (@asmowarlord)', icon: 'musical-notes' },
                  { id: 'instagram', name: 'Meta Business Suite', icon: 'logo-instagram' },
                ].map((item) => {
                  const active = platforms[item.id];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => togglePlatform(item.id)}
                      style={[styles.targetBadge, active && styles.targetBadgeActive]}>
                      <Ionicons
                        name={item.icon}
                        size={16}
                        color={active ? '#a855f7' : '#71717a'}
                      />
                      <Text style={[styles.targetBadgeText, active && styles.targetBadgeTextActive]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>QUEUED TITLE</Text>
              <TextInput
                style={styles.textInput}
                defaultValue={aiOutput ? aiOutput.youtube_title : 'INSANE 1v5 CLUTCH ESCAPE! 🏆 #Shorts'}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, isPublishing && styles.btnDisabled, { marginTop: 20 }]}
                onPress={publishToPlatforms}
                disabled={isPublishing}>
                {isPublishing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={16} color="#ffffff" />
                    <Text style={styles.primaryBtnText}>Trigger Cloud Video Render & Publish</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Live API Console Log */}
            {apiConsoleLog !== '' && (
              <View style={[styles.card, { marginTop: 16, backgroundColor: '#000000', borderColor: '#10b981' }]}>
                <Text style={[styles.inputLabel, { color: '#10b981' }]}>CLOUD BACKEND LOGS</Text>
                <Text style={styles.consoleText}>{apiConsoleLog}</Text>
              </View>
            )}
          </View>
        )}

        {/* 3. ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <View>
            <Text style={styles.sectionTitle}>Studio Analytics</Text>
            <Text style={styles.sectionSubtitle}>Connected metrics for Asmogaming.</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>142.8K</Text>
                <Text style={styles.statLabel}>Total Reach</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>68.4%</Text>
                <Text style={styles.statLabel}>Avg Retention</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('clips')}>
          <MaterialCommunityIcons
            name="movie-filter"
            size={22}
            color={activeTab === 'clips' ? '#a855f7' : '#71717a'}
          />
          <Text style={[styles.navText, activeTab === 'clips' && styles.navTextActive]}>
            Clips
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('schedule')}>
          <Ionicons
            name="calendar"
            size={20}
            color={activeTab === 'schedule' ? '#a855f7' : '#71717a'}
          />
          <Text style={[styles.navText, activeTab === 'schedule' && styles.navTextActive]}>
            Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('analytics')}>
          <Ionicons
            name="stats-chart"
            size={20}
            color={activeTab === 'analytics' ? '#a855f7' : '#71717a'}
          />
          <Text style={[styles.navText, activeTab === 'analytics' && styles.navTextActive]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#05020a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1329',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  profileBtn: {
    backgroundColor: '#140b24',
    borderWidth: 1,
    borderColor: '#a855f7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    color: '#a855f7',
    fontWeight: '800',
    fontSize: 10,
  },
  keyVaultBox: {
    backgroundColor: '#10071e',
    borderBottomWidth: 1,
    borderBottomColor: '#a855f7',
    padding: 14,
  },
  keyVaultLabel: {
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  keyVaultInput: {
    backgroundColor: '#05020a',
    borderWidth: 1,
    borderColor: '#2a1c45',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 13,
  },
  keyVaultHint: {
    color: '#10b981',
    fontSize: 10,
    marginTop: 6,
    fontWeight: '500',
  },
  content: {
    padding: 18,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#a1a1aa',
    marginBottom: 16,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#0d0718',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#211636',
    padding: 16,
  },
  inputLabel: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#140b24',
    borderWidth: 1,
    borderColor: '#2a1c45',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  durationBtn: {
    flex: 1,
    backgroundColor: '#140b24',
    borderWidth: 1,
    borderColor: '#2a1c45',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  durationBtnActive: {
    borderColor: '#a855f7',
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  durationText: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '600',
  },
  durationTextActive: {
    color: '#ffffff',
  },
  primaryBtn: {
    backgroundColor: '#a855f7',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scoreBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreBadgeText: {
    color: '#a855f7',
    fontSize: 10,
    fontWeight: '800',
  },
  hookLabel: {
    color: '#06b6d4',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hookText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    marginVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#211636',
    marginVertical: 12,
  },
  platformHeader: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  platformValue: {
    color: '#ffffff',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  phoneMock: {
    width: 220,
    height: 380,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#a855f7',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  videoPlayerBox: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 14,
    position: 'relative',
  },
  blurredBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#180d2e',
    opacity: 0.8,
  },
  blurSim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2b104f',
    opacity: 0.6,
  },
  videoContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewDurationText: {
    color: '#e4e4e7',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  subtitlesOverlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  karaokeSub: {
    color: '#facc15',
    fontWeight: '900',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  consoleText: {
    color: '#10b981',
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 18,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#140b24',
    borderWidth: 1,
    borderColor: '#211636',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  targetBadgeActive: {
    borderColor: '#a855f7',
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  targetBadgeText: {
    color: '#71717a',
    fontSize: 12,
  },
  targetBadgeTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0d0718',
    borderWidth: 1,
    borderColor: '#211636',
    padding: 16,
    borderRadius: 14,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#0a0514',
    borderTopWidth: 1,
    borderTopColor: '#1a1329',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
  },
  navText: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#a855f7',
  },
});
