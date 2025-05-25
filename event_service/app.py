from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Evento(BaseModel):
    nombre: str
    fecha: str
    lugar: str

client = MongoClient("mongodb://mongodb:27017/")
db = client["eventos_db"]
coleccion = db["eventos"]

@app.post("/events/eventos")
async def crear_evento(evento: Evento):
    resultado = coleccion.insert_one(evento.dict())
    return {
        "_id": str(resultado.inserted_id),
        **evento.dict(),
        "mensaje": "Evento creado exitosamente"
    }

@app.get("/events/eventos")
async def obtener_eventos():
    eventos = []
    for evento in coleccion.find():
        evento["_id"] = str(evento["_id"])
        eventos.append(evento)
    return eventos

@app.put("/events/eventos/{evento_id}")
async def editar_evento(evento_id: str, evento: Evento):
    resultado = coleccion.update_one(
        {"_id": ObjectId(evento_id)},
        {"$set": evento.dict()}
    )
    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return {"estado": "actualizado"}

@app.delete("/events/eventos/{evento_id}")
async def eliminar_evento(evento_id: str):
    resultado = coleccion.delete_one({"_id": ObjectId(evento_id)})
    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return {"estado": "eliminado"}
