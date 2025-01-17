import { useState } from 'react'
import './App.css'
import { OpenAI } from 'openai'
import { getClient, getTranscription } from './openaiApi'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [client, setClient] = useState<OpenAI | null>(null)
  const [recordingSession, setRecordingSession] = useState<{ getTranscript: () => Promise<string> } | null>(null)
  const [transcriptions, setTranscriptions] = useState<string[]>([])

  const handleSetKey = () => {
    if (apiKey.trim() === '') return
    const openAiClient = getClient(apiKey.trim())
    setClient(openAiClient)
  }

  const handleRecord = async () => {
    if (!client) return
    try {
      // Begin recording:
      const session = await getTranscription(client)
      setRecordingSession(session)
    } catch (error) {
      console.error("Failed to start transcription:", error)
    }
  }

  const handleStop = async () => {
    if (!recordingSession) return
    try {
      // Stop recording and get transcription:
      const text = await recordingSession.getTranscript()
      setTranscriptions(prev => [...prev, text])
      setRecordingSession(null)
    } catch (error) {
      console.error("Failed to get transcription:", error)
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      {!client ? (
        <div>
          <h2>Enter your OpenAI API key:</h2>
          <input
            type="password"
            placeholder="OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ width: '300px', marginRight: '8px' }}
          />
          <button onClick={handleSetKey}>Set Key</button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            {!recordingSession ? (
              <button onClick={handleRecord} style={{ fontSize: '2rem', cursor: 'pointer' }}>
                🔴
              </button>
            ) : (
              <button onClick={handleStop} style={{ fontSize: '2rem', cursor: 'pointer' }}>
                🛑
              </button>
            )}
          </div>
          
          <h3>Transcriptions:</h3>
          <div>
            {transcriptions.map((t, i) => (
              <p key={i} style={{ borderTop: '1px solid #ccc', padding: '8px 0' }}>
                {t}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
