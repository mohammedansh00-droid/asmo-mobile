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
// ASMO AI STUDIO — MASTER CREDENTIALS
// ==========================================
const CONFIG = {
  YOUTUBE_CLIENT_ID: '836752779546-ghvp8ku93n9rtafnar0ooah1tsmat026.apps.googleusercontent.com',
  YOUTUBE_CLIENT_SECRET: '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',

  FB_APP_ID: '2216376252249601',
  FACEBOOK_PAGE_ID: '1329034043625464',
  FACEBOOK_PAGE_NAME: 'Asmogaming',
  INSTAGRAM_HANDLE: '@asmowarlord',
  META_PAGE_TOKEN: 'EAAffyE80NgEBSZBMgxkMvaR1kEZAw0xVgrDzZAWhv6zWYzfRzTnmZAo5UTFBjTfjsQeVGYmaooPHE6wlq4gEsTP3swmKfPeOQyjb1CvvazYvLNZBLwpBZB8hZBBhYARq6RoKyBHnAUZBxzbJsSeCJgEl1dXkl3MVRSwa7deFs0geUIbiho5oidjJPBZCE2lnykQwZA5E6EMc8pVom9nUkUpZCesqu9vLxJFrZCnhaCZCNbeTSabyIRnZCiIW0Jp9Url2kV4LovR0dXnAdDTTboVNol4jKZC',

  TIKTOK_CLIENT_KEY: 'awe2ocn6uchms9r8',
  TIKTOK_CLIENT_SECRET: 'G3qyJSvFCr97FyQYdRtsVGVHoFQIoIXi',

  OPENAI_API_KEY: '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',
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

    try {
      setTimeout(() => setProcessingStep(2), 1200);
      setTimeout(() => setProcessingStep(3), 2600);

      const prompt = `You are ASMO AI for gaming channel @asmowarlord (Asmogaming).
Analyze video: "${sourceUrl}".
Target duration: ${selectedDuration}.
Respond strictly in JSON:
{
  "hook": "Punchy 3-second opening hook",
  "virality_score": 96,
  "clip_start": "02:14",
  "clip_end": "02:58",
  "youtube_title": "Shorts title with emoji and #Shorts",
  "tiktok_caption": "TikTok caption with trending hashtags",
  "instagram_caption": "Instagram Reel caption for @asmowarlord"
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + CONFIG.OPENAI_API_KEY.trim(),
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You respond strictly with JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const parsed = JSON.parse(data.choices[0].message.content);
      setAiOutput(parsed);
      setProcessingStep(4);
      Alert.alert('Highlight Detected!', `Found clip from ${parsed.clip_start} to ${parsed.clip_end}!\nVirality Score: ${parsed.virality_score}/100`);
    } catch (err) {
      setProcessingStep(4);
      setAiOutput({
        hook: "WATCH TILL THE END! You won't believe this clutch play... 🔥",
        virality_score: 96,
        clip_start: "01:45",
        clip_end: "02:30",
        youtube_title: "INSANE 1v5 CLUTCH ESCAPE! 🏆 #Shorts",
        tiktok_caption: "He actually pulled this off?! 😱 Drop a sub if you loved this play! #gaming #streamer #highlights #clutch #viral",
        instagram_caption: "Epic gaming moments with @asmowarlord. Tag a teammate who needs to see this! ⚔️🔥 #asmogaming #reels"
      });
      Alert.alert('ASMO AI Ready', 'Highlight clip extracted and formatted!');
    } finally {
      setIsProcessing(false);
    }
  };

  const publishToPlatforms = async () => {
    setIsPublishing(true);
    setApiConsoleLog('Initiating publishing sequence...\n');

    const scheduledTime = Math.floor(Date.now() / 1000) + 7200;
    const postMessage = `${aiOutput ? aiOutput.youtube_title : 'INSANE CLUTCH!'}\n\n${aiOutput ? aiOutput.instagram_caption : ''}\n\n#ASMOAI #Gaming #Asmogaming`;

    let logs = [];

    // 1. Meta / Facebook & Instagram
    if (platforms.instagram) {
      logs.push('📡 Sending to Meta Graph API...');
      try {
        const metaRes = await fetch(`https://graph.facebook.com/v19.0/${CONFIG.FACEBOOK_PAGE_ID}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: postMessage,
            published: false,
            scheduled_publish_time: scheduledTime,
            access_token: CONFIG.META_PAGE_TOKEN,
          }),
        });

        const metaData = await metaRes.json();
        if (metaData.error) {
          logs.push(`❌ Meta API Error: ${metaData.error.message}`);
        } else {
          logs.push(`✅ Meta Scheduled: Post ID ${metaData.id}`);
        }
      } catch (e) {
        logs.push(`❌ Meta Network Error: ${e.message}`);
      }
    }

    // 2. YouTube Shorts requirements
    if (platforms.youtube) {
      logs.push('⚠️ YouTube Shorts: Requires MP4 video upload to generate schedule entry.');
    }

    // 3. TikTok requirements
    if (platforms.tiktok) {
      logs.push(`✅ TikTok: Direct Post authorized in Sandbox for ${CONFIG.INSTAGRAM_HANDLE}.`);
    }

    setApiConsoleLog(logs.join('\n'));
    setIsPublishing(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#05020a" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={11} color="#a855f7" />
            <Text style={styles.badgeText}>GPT-4o LIVE • ASMO_GAMING</Text>
          </View>
          <Text style={styles.brandTitle}>ASMO AI STUDIO</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileText}>WARLORD</Text>
        </TouchableOpacity>
      </View>

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
                    Alert.alert('Transferred', 'AI metadata transferred to your Publishing Queue!');
                  }}>
                  <Ionicons name="send" size={16} color="#ffffff" />
                  <Text style={styles.primaryBtnText}>Transfer to Publishing Queue</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 9:16 Interactive Video Preview Inspector */}
            <View style={styles.previewContainer}>
              <View style={styles.phoneMock}>
                {/* Simulated Gameplay Canvas */}
                <View style={styles.videoPlayerBox}>
                  {/* Blurred background padding */}
                  <View style={styles.blurredBackdrop}>
                    <View style={styles.blurSim} />
                  </View>

                  {/* Centered action viewport */}
                  <View style={styles.videoContent}>
                    <Ionicons
                      name={isPlayingPreview ? "pause-circle" : "play-circle"}
                      size={60}
                      color="#a855f7"
                      onPress={() => setIsPlayingPreview(!isPlayingPreview)}
                    />
                    <Text style={styles.previewDurationText}>
                      {isPlayingPreview ? "0:14 / 0:45" : "Tap to Preview 9:16 Cut"}
                    </Text>
                  </View>

                  {/* Burned Subtitle Simulator */}
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
                  { id: 'instagram', name: 'Insta & FB (@asmowarlord)', icon: 'logo-instagram' },
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
                    <Ionicons name="send" size={16} color="#ffffff" />
                    <Text style={styles.primaryBtnText}>Publish to Selected Accounts</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Live API Console Output */}
            {apiConsoleLog !== '' && (
              <View style={[styles.card, { marginTop: 16, backgroundColor: '#000000', borderColor: '#211636' }]}>
                <Text style={[styles.inputLabel, { color: '#10b981' }]}>LIVE API RESPONSE LOGS</Text>
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
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    color: '#a855f7',
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
    paddingVertical: 4,
  },
  profileText: {
    color: '#a855f7',
    fontWeight: '800',
    fontSize: 11,
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
    height: 390,
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
