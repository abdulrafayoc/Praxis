from fastapi import APIRouter, Request, Response, WebSocket, WebSocketDisconnect
from twilio.twiml.voice_response import VoiceResponse, Connect
from app.config import settings
from app.pipeline.pipecat_factory import create_pipecat_pipeline
import uuid

router = APIRouter()

@router.post("/twilio/voice")
async def twilio_voice_webhook(request: Request):
    form_data = await request.form()
    call_sid = form_data.get('CallSid', '')
    
    response = VoiceResponse()
    connect = Connect()
    connect.stream(url=f"{settings.twilio_websocket_url}/{call_sid}")
    response.append(connect)
    
    return Response(content=str(response), media_type="application/xml")

@router.websocket("/ws/call/{call_sid}")
async def websocket_endpoint(websocket: WebSocket, call_sid: str):
    await websocket.accept()
    call_session_id = str(uuid.uuid4())
    
    try:
        runner, task = await create_pipecat_pipeline(call_session_id, call_sid, websocket)
        await runner.run(task)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"Error in websocket for {call_sid}: {e}")
    finally:
        pass
