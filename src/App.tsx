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

  /** Start a brand new recording session */
  const handleRecord = async () => {
    if (!client) return
    try {
      const session = await getTranscription(client)
      setRecordingSession(session)
    } catch (error) {
      console.error("Failed to start transcription:", error)
    }
  }

  /**
   * Stop the current recording session, get the transcript,
   * then immediately start a new session automatically.
   */
  const handleStopAndReRecord = async () => {
    if (!recordingSession) return
    try {
      const text = await recordingSession.getTranscript()
      setTranscriptions((prev) => [...prev, text])
      setRecordingSession(null)
    } catch (error) {
      console.error("Failed to get transcription:", error)
      setRecordingSession(null) // clean up in case of error
    }
    // Start new recording after stopping
    handleRecord()
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* If we don't have a client set up, ask for the key */}
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
          {/* Recording control button */}
          <div style={{ marginBottom: '1rem' }}>
            {!recordingSession ? (
              // If NOT recording, show a mic icon
              <button onClick={handleRecord} style={{ fontSize: '2rem', cursor: 'pointer' }}>
                🎤
              </button>
            ) : (
              // If recording, show a red dot icon
              <button onClick={handleStopAndReRecord} style={{ fontSize: '2rem', cursor: 'pointer' }}>
                🔴
              </button>
            )}
          </div>

          {/* Transcriptions list */}
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
