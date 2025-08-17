"use client";

import VoiceRecorder from '@/components/voice-recorder'
import { useState } from "react"
import ThemeSelector from "@/components/theme-selector"

export default function Home() {
  const [theme, setTheme] = useState("from-indigo-600 to-purple-600")

  return (
    <main className={`min-h-screen bg-gradient-to-br ${theme} p-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-bold mb-4">🎵 SoundWave Template</h1>
          <p className="text-xl opacity-90">Build amazing audio experiences!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Voice Recorder</h2>
            <VoiceRecorder />
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Audio Features</h2>
            <div className="space-y-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Real-time audio recording</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Audio playback controls</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Voice transcription ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Audio visualization</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-black/20 rounded-lg p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to build your audio app?</h3>
            <p className="text-white/80">This template includes everything you need to get started with audio processing, recording, and playback.</p>

            <ThemeSelector setTheme={setTheme} />
          </div>
        </div>
      </div>
    </main>
  )
} 