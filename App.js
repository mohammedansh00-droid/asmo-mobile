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

// Optional: Paste your OpenAI API Key here, or leave as '' for built-in simulation mode
const OPENAI_API_KEY = '';

export default function App() {
  const [activeTab, setActiveTab] = useState('clips');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('30-60s');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [aiOutput, setAiOutput] = useState(null);

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
      Alert.alert('Missing URL', 'Please paste a valid YouTube or Twitch video link first.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1);

    // If no OpenAI key is set, run the built-in generator
    if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '') {
      setTimeout(() => setProcessingStep(2), 1500);
      setTimeout(() => setProcessingStep(3), 3200);
      setTimeout(() => {
        setProcessingStep(4);
        setIsProcessing(false);
        setAiOutput({
          hook: "WATCH TILL THE END! You won't believe this clutch play... 🔥",
          virality_score: 96,
          youtube_title: "INSANE 1v5 CLUTCH ESCAPE! 🏆 #Shorts",
          tiktok_caption: "He actually pulled this off?! 😱 Drop a sub if you loved this play! #gaming #streamer #highlights #clutch #viral",
          instagram_caption: "Epic gaming moments with @asmowarlord. Tag a teammate who needs to see this! ⚔️🔥 #asmogaming #reels"
        });
        Alert.alert('ASMO AI Ready!', 'Viral clip package generated successfully with 96/100 Virality Score.');
      }, 5000);
      return;
    }

    // If key is set, call live OpenAI API
    try {
      setTimeout(() => setProcessingStep(2), 1200);
      setTimeout(() => setProcessingStep(3), 2800);

      const prompt = `You are ASMO AI, the elite short-form video editor for the gaming channel @asmowarlord (Asmogaming).
The user wants to extract the top viral 9:16 Short/Reel from this source: "${sourceUrl}" (Target length: ${selectedDuration}).
Respond strictly in valid JSON adhering to this schema:
{
  "hook": "Punchy 3-second opening hook",
  "virality_score": 95,
  "youtube_title": "Shorts title with emoji and #Shorts",
  "tiktok_caption": "TikTok caption with trending hashtags",
  "instagram_caption": "Instagram Reel caption formatted for @asmowarlord"
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + OPENAI_API_KEY.trim(),
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
      Alert.alert('ASMO AI Ready!', `Generated package with Virality Score: ${parsed.virality_score}/100.`);
    } catch (err) {
      Alert.alert('AI Error', err.message || 'Failed to call OpenAI API.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#05020a" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={11} color="#a855f7" />
            <Text style={styles.badgeText}>AI ENGINE ACTIVE</Text>
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
              Convert long broadcasts into high-retention 9:16 Shorts.
            </Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>SOURCE STREAM LINK</Text>
              <TextInput
                style={styles.textInput}
                placeholder="https://youtube.com/watch?v=... or Twitch"
                placeholderTextColor="#71717a"
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

            {/* Pipeline Stage Tracker */}
            {processingStep > 0 && (
              <View style={[styles.card, { marginTop: 16 }]}>
                <Text style={styles.inputLabel}>ORCHESTRATOR STATUS</Text>
                {[
                  'Ingesting Source & Isolating Audio',
                  'Faster-Whisper Timestamps & Decibel Peaks',
                  'GPT-4o Virality Scoring & Hook Selection',
                  'Dual-Layer 9:16 Center-Crop & ASS Subtitle Burn',
                ].map((stepText, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <Ionicons
                      name={
                        processingStep > idx
                          ? 'checkmark-circle'
                          : processingStep === idx + 1
                          ? 'radio-button-on'
                          : 'ellipse-outline'
                      }
                      size={16}
                      color={processingStep > idx ? '#10b981' : '#a855f7'}
                    />
                    <Text
                      style={[
                        styles.stepText,
                        processingStep > idx && styles.stepTextActive,
                      ]}>
                      {stepText}
                    </Text>
                  </View>
                ))}
              </View>
            )}

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

                <Text style={styles.platformHeader}>YOUTUBE SHORTS TITLE</Text>
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

            {/* 9:16 Video Preview Frame */}
            <View style={styles.previewContainer}>
              <View style={styles.phoneMock}>
                <Ionicons name="videocam" size={44} color="#71717a" />
                <Text style={styles.phoneMockText}>Smart 9:16 Reframer</Text>
                <Text style={styles.phoneMockSub}>Subtitles & Blurred Padding Active</Text>
                {aiOutput && (
                  <View style={styles.readyBadge}>
                    <Text style={styles.readyBadgeText}>✓ Ready to Broadcast</Text>
                  </View>
                )}
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
                defaultValue={aiOutput ? aiOutput.youtube_title : 'UNBELIEVABLE 1v5 CLUTCH! 🏆'}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 20 }]}
                onPress={() => Alert.alert('Dispatched!', 'Dispatched to YouTube Shorts, TikTok, and Instagram Reels queues.')}>
                <Ionicons name="send" size={16} color="#ffffff" />
                <Text style={styles.primaryBtnText}>Publish to Selected Accounts</Text>
              </TouchableOpacity>
            </View>
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

            <View style={[styles.card, { marginTop: 14 }]}>
              <Text style={styles.inputLabel}>TOP PERFORMING CLIPS</Text>
              {[
                { title: 'Impossible 1v5 Clutch', views: '84.2K', plat: 'TikTok' },
                { title: 'Funny Boss Battle Fail', views: '41.1K', plat: 'Shorts' },
                { title: 'Speedrun Skip Glitch', views: '17.5K', plat: 'Reels' },
              ].map((c, i) => (
                <View key={i} style={styles.clipRow}>
                  <Text style={styles.clipRank}>#{i + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clipTitle}>{c.title}</Text>
                    <Text style={styles.clipPlat}>{c.plat}</Text>
                  </View>
                  <Text style={styles.clipViews}>{c.views}</Text>
                </View>
              ))}
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
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  stepText: {
    color: '#71717a',
    fontSize: 12,
  },
  stepTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  phoneMock: {
    width: 170,
    height: 290,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#211636',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  phoneMockText: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  phoneMockSub: {
    color: '#52525b',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  readyBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  readyBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
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
  clipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1329',
  },
  clipRank: {
    color: '#a855f7',
    fontWeight: '800',
    fontSize: 14,
  },
  clipTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  clipPlat: {
    color: '#71717a',
    fontSize: 10,
  },
  clipViews: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 12,
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
