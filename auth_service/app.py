from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lista de usuarios de ejemplo
usuarios = [
    {"usuario": "admin", "clave": "1234"}
]

@app.post("/auth/login")
async def login(request: Request):
    data = await request.json()
    usuario = data.get("usuario")
    clave = data.get("clave")
    
    for u in usuarios:
        if u["usuario"] == usuario and u["clave"] == clave:
            return {"estado": "exitoso"}
    return {"estado": "fallido", "mensaje": "Credenciales incorrectas"}
