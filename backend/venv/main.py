from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import ffmpeg
import os

app = FastAPI()

# Aktivizoni CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rruga për ngarkimin e audios
@app.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    try:
        # Ruani skedarin e ngarkuar përkohësisht
        temp_path = "temp_audio.encoded"
        with open(temp_path, "wb") as buffer:
            buffer.write(await file.read())

        # Dekodoni audion e ngarkuar
        decoded_audio_path = "decoded_audio.wav"
        ffmpeg.input(temp_path).output(decoded_audio_path, ar=22050).run(overwrite_output=True)

        # Pastroni skedarin përkohësisht
        os.remove(temp_path)

        # Kthe filin e konvertuar
        return FileResponse(decoded_audio_path, media_type='audio/wav', filename="decoded_audio.wav")

    except Exception as e:
        return {"error": str(e)}

# Rruga kryesore
@app.get("/")
def read_root():
    return {"message": "Welcome to the Audio Converter API!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
