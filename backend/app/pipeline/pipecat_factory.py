from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.services.elevenlabs import ElevenLabsTTSService
from pipecat.services.deepgram import DeepgramSTTService
from pipecat.transports.network.websocket_server import WebsocketServerParams, WebsocketServerTransport
from app.config import settings
from app.pipeline.langgraph_service import LangGraphLLMService

async def create_pipecat_pipeline(call_session_id: str, call_sid: str, websocket_client):
    transport = WebsocketServerTransport(
        params=WebsocketServerParams(
            audio_out_enabled=True,
            add_wav_header=True,
            custom_client=websocket_client
        )
    )
    
    stt = DeepgramSTTService(
        api_key=settings.deepgram_api_key,
        model="nova-2",
        language="en-US"
    )
    
    tts = ElevenLabsTTSService(
        api_key=settings.elevenlabs_api_key,
        voice_id=settings.elevenlabs_voice_id,
        model="eleven_turbo_v2"
    )
    
    llm_service = LangGraphLLMService(call_session_id, call_sid)
    
    pipeline = Pipeline([
        transport.input(),
        stt,
        llm_service, # Custom wrapper that acts as a Pipecat LLM service but calls LangGraph
        tts,
        transport.output()
    ])
    
    task = PipelineTask(pipeline, PipelineParams(allow_interruptions=True))
    runner = PipelineRunner()
    
    return runner, task
