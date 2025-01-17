import { OpenAI } from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatCompletionStreamParams } from 'openai/resources/beta/chat/completions';

export function getClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

export async function getChatCompletion(
  client: OpenAI,
  messages: ChatCompletionMessageParam[],
  maxTokens: number,
  onChunk: (chunk: string) => void = () => {},
  onSentMessage: (message: string) => void = () => {},
  onCutoff: (message: string) => void = () => {}
): Promise<void> {

  const payload: ChatCompletionStreamParams = {
    // TODO: Getting the function name here programmatically is a little bit tricky since we need the original contents of the message
    // which contains the name of the function call. The embellished contents of the message is (at time of writing) a human readable
    // markdown version of the message which would be too awkward to parse the name out of. There's some work to be done here to make
    // it less ambiguous about whether a message is a function call, whether it's been embellished, etc.
    messages,
    model: 'gpt-4o-mini',
    max_tokens: maxTokens,
    temperature: 0.2,
    stream: true
  }
  // if (functions.length > 0) {
  //   payload.tools = functions.map(functionOption => ({ type: "function", function: functionOption }));

  //   if (lockedFunction && functions.findIndex(functionOption => functionOption.name === lockedFunction.name) !== -1) {
  //     payload.tool_choice = { type: "function", function: { name: lockedFunction.name }};
  //   }
  //   else {
  //     payload.tool_choice = "auto";
  //   }
  // }

  const stream = client.beta.chat.completions.stream(payload);

  stream.on('content', (_chunk: string, snapshot: string) => {
    onChunk(snapshot);
  })

  stream.on('chatCompletion', (completion: ChatCompletion) => {
    const message = completion.choices[0].message;
    const finishReason = completion.choices[0].finish_reason;

    if (message.content && message.content.length > 0) {
      if (finishReason === "length") {
        onCutoff(message.content);
      }
      else {
        onSentMessage(message.content);
      }
    }

    //if (message.function_call) onFunctionCall({name: message.function_call.name, parameters: JSON5.parse(message.function_call.arguments) as FunctionParameters, uuid: uuidv4()});

    // if (message.tool_calls) {
    //   message.tool_calls.forEach(toolCall => {
    //     onFunctionCall({name: toolCall.function.name, parameters: JSON5.parse(toolCall.function.arguments) as FunctionParameters, id: toolCall.id, uuid: uuidv4()});
    //   })
    // }
  });

  await stream.done();
}

// The signature is a little confusing, but basically call this function to start recording audio input - when the return resolves,
// it will yield a function that you can call to stop recording and get the audio blob as a promise.
async function saveAudioInput(): Promise<() => Promise<Blob>> {
  //console.log("Please say something...");

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks: Blob[] = [];

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  const audioBlobPromise = new Promise<Blob>((resolve) => {
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      resolve(audioBlob);
    });
  });

  const stopRecording = () => { // TODO: Why not have this return the audioBlobPromise?
    if (mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    return audioBlobPromise;
  };

  mediaRecorder.start();

  return stopRecording;
}

async function getTranscript(client: OpenAI, stopRecording: () => Promise<Blob>): Promise<string> {
  try {
    const audioBlob = await stopRecording();
    const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });
    const transcription = await client.audio.transcriptions.create({file: audioFile, model: "whisper-1"});
    const transcript = transcription.text;
    console.log("Transcript:", transcript);
    return transcript;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
}

export async function getTranscription(client: OpenAI): Promise<{ getTranscript: () => Promise<string> }> {
  const stopRecording = await saveAudioInput();

  return { getTranscript: () => getTranscript(client, stopRecording) };
}