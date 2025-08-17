"use client"
import React, { useState, useRef } from "react"
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react"

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordings, setRecordings] = useState<{ url: string; time: string; volume: number }[]>([])
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [averageVolume, setAverageVolume] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const volumeInterval = useRef<NodeJS.Timeout | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({})

  // Format recording time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunks.current = []

    // Audio context for volume detection
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    volumeInterval.current = setInterval(() => {
      analyser.getByteFrequencyData(dataArray)
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      setAverageVolume(avg)
    }, 200)

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.current.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" }) // ✅ fixed type
      const url = URL.createObjectURL(blob)
      const time = formatTime(recordingTime)

      setRecordings((prev) => [...prev, { url, time, volume: averageVolume }])
      stream.getTracks().forEach((track) => track.stop())

      if (volumeInterval.current) clearInterval(volumeInterval.current) // ✅ stop loop
    }

    mediaRecorder.start()
    setRecording(true)
    setRecordingTime(0)

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  // Play recording
  const playAudio = (url: string) => {
    const audio = audioRefs.current[url]
    if (audio) {
      audio.currentTime = 0 // ✅ restart from beginning
      audio.play()
      setIsPlaying(url)
    }
  }

  // Pause recording
  const pauseAudio = (url: string) => {
    const audio = audioRefs.current[url]
    if (audio) {
      audio.pause()
      setIsPlaying(null)
    }
  }

  // Delete recording
  const deleteRecording = (url: string) => {
    setRecordings((prev) => prev.filter((rec) => rec.url !== url))
    delete audioRefs.current[url]
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 p-4">
      {/* Recorder UI */}
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Audio Recorder</h1>

        <div className="flex flex-col items-center">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 
              ${recording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-green-600 hover:bg-green-700"} 
              text-white shadow-lg`}
          >
            {recording ? <Square size={40} /> : <Mic size={40} />}
          </button>

          <p className="text-white text-lg mt-4 font-mono">{formatTime(recordingTime)}</p>

          <p className="text-sm text-white/70 mt-2">
            Avg. Volume: <span className="font-bold text-white">{averageVolume.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Recordings list */}
      <div className="mt-8 w-full max-w-md space-y-4">
        {recordings.map((rec, index) => (
          <div
            key={rec.url}
            className="flex items-center justify-between bg-black/30 rounded-lg p-4"
          >
            <div className="flex items-center space-x-4">
              <audio
                ref={(el) => {
                  if (el) {
                    audioRefs.current[rec.url] = el
                  } else {
                    delete audioRefs.current[rec.url]
                  }
                }}
                src={rec.url}
                onEnded={() => setIsPlaying(null)}
                className="w-0 h-0 opacity-0 absolute"
              />
              <span className="text-white text-sm">
                Recording {index + 1} ({rec.time})
              </span>
              {isPlaying === rec.url ? (
                <button
                  onClick={() => pauseAudio(rec.url)}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full"
                >
                  <Pause size={16} />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={() => playAudio(rec.url)}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full"
                >
                  <Play size={16} />
                  <span>Play</span>
                </button>
              )}
            </div>
            <button
              onClick={() => deleteRecording(rec.url)}
              className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-full"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
