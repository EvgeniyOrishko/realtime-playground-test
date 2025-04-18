import { AccessToken } from "livekit-server-sdk";
import { PlaygroundState } from "@/data/playground-state";

export async function POST(request: Request) {
  let playgroundState: PlaygroundState;

  try {
    playgroundState = await request.json();
  } catch (error) {
    return Response.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  const {
    instructions,
    openaiAPIKey,
    sessionConfig: {
      turnDetection,
      modalities,
      voice,
      temperature,
      maxOutputTokens,
      vadThreshold,
      vadSilenceDurationMs,
      vadPrefixPaddingMs,
    },
  } = playgroundState;

  if (!openaiAPIKey) {
    return Response.json(
      { error: "OpenAI API key is required" },
      { status: 400 },
    );
  }



  
  const roomName = Math.random().toString(36).slice(7);
  const apiKey = 'APIT9646NWUryq4';
  const apiSecret = 'd9SAAXsva8Qbhgiv9TLIZnZJJ7vfymjyfJzNqkZ32euB';
  if (!apiKey || !apiSecret) {
    throw new Error("LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set");
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: "human",
    metadata: JSON.stringify({
      instructions: instructions,
      modalities: modalities,
      voice: voice,
      temperature: temperature,
      max_output_tokens: maxOutputTokens,
      openai_api_key: openaiAPIKey,
      turn_detection: JSON.stringify({
        type: turnDetection,
        threshold: vadThreshold,
        silence_duration_ms: vadSilenceDurationMs,
        prefix_padding_ms: vadPrefixPaddingMs,
      }),
      agent_id: "mastegpt_agent",
      agent_name: "Universal Agent",
      user_id: "123",
    }),
  });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
    canUpdateOwnMetadata: true,
  });
  return Response.json({
    accessToken: await at.toJwt(),
    url: 'wss://voiceagent-oeb995pb.livekit.cloud',
  });
}
