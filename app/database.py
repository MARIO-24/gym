from dotenv import load_dotenv, find_dotenv
import os
import mysql.connector
from mysql.connector.cursor import MySQLCursorDict

# Cargar variables de entorno desde .env
load_dotenv(find_dotenv())

def get_connection():
    """
    Retorna una conexión a MySQL usando las variables de entorno.
    """
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "gym_db"),
        port=int(os.getenv("DB_PORT", "3306")),
        charset="utf8mb4"
    )

def init_db():
    """
    Inicializa la base de datos: crea la tabla 'clientes' si no existe.
    """
    conn = get_connection()
    cursor: MySQLCursorDict = conn.cursor(dictionary=True)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS clientes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL,
            apellido VARCHAR(50) NOT NULL,
            email VARCHAR(100),
            telefono VARCHAR(20),
            fecha_nacimiento DATE,
            genero ENUM('M','F','Otro'),
            tipo_membresia VARCHAR(50)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)

    conn.commit()
    cursor.close()
    conn.close()
    print("Tabla 'clientes' inicializada correctamente.")

# Opcional: inicializar al importar el módulo
if __name__ == "__main__":
    init_db()
