from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.database import get_connection

app = FastAPI()
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


# --- INDEX ---
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("pages/index.html", {"request": request})

@app.get("/clientes", response_class=HTMLResponse)
async def mantenimiento_clientes(request: Request):
    return templates.TemplateResponse(
        "pages/mantenimiento.html",
        {"request": request}
    )

# --- VER CLIENTES ---
@app.get("/clientes", response_class=HTMLResponse)
async def ver_clientes(request: Request):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    clientes = cursor.fetchall()
    cursor.close()
    conn.close()
    return templates.TemplateResponse("pages/clientes.html", {"request": request, "clientes": clientes})


# --- NUEVO CLIENTE ---
@app.get("/clientes/nuevo", response_class=HTMLResponse)
async def nuevo_cliente(request: Request):
    return templates.TemplateResponse("pages/nuevo_cliente.html", {"request": request})


@app.post("/clientes/nuevo")
async def crear_cliente(
    nombre: str = Form(...),
    apellido: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(None),
    fecha_nacimiento: str = Form(None),
    genero: str = Form(None),
    tipo_membresia: str = Form(...),
):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, genero, tipo_membresia, fecha_alta)
        VALUES (%s, %s, %s, %s, %s, %s, %s, CURDATE())
        """,
        (nombre, apellido, email, telefono, fecha_nacimiento, genero, tipo_membresia)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return RedirectResponse(url="/clientes", status_code=303)


# --- EDITAR CLIENTE ---
@app.get("/clientes/editar/{cliente_id}", response_class=HTMLResponse)
async def editar_cliente(request: Request, cliente_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes WHERE id = %s", (cliente_id,))
    cliente = cursor.fetchone()
    cursor.close()
    conn.close()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return templates.TemplateResponse("pages/editar_cliente.html", {"request": request, "cliente": cliente})


@app.post("/clientes/editar/{cliente_id}")
async def actualizar_cliente(
    cliente_id: int,
    nombre: str = Form(...),
    apellido: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(None),
    fecha_nacimiento: str = Form(None),
    genero: str = Form(None),
    tipo_membresia: str = Form(...),
    activo: str = Form("off")
):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        UPDATE clientes
        SET nombre=%s, apellido=%s, email=%s, telefono=%s, fecha_nacimiento=%s,
            genero=%s, tipo_membresia=%s, activo=%s
        WHERE id=%s
        """,
        (nombre, apellido, email, telefono, fecha_nacimiento, genero, tipo_membresia, bool(activo=="on"), cliente_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return RedirectResponse(url="/clientes", status_code=303)


# --- ELIMINAR CLIENTE ---
@app.delete("/clientes/{cliente_id}")
async def eliminar_cliente(cliente_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clientes WHERE id=%s", (cliente_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "ok"}
