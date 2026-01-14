-- =========================================================
-- SCRIPT INICIALIZADOR DE BASE DE DATOS PARA GIMNASIO
-- Autor: MArio Sánchez Rufino
-- Fecha: 2026-12-01
-- Descripción:
--   Script que crea la base de datos de un gimnasio
--   y define la tabla 'clientes' (socios del gimnasio).
-- =========================================================

-- 1️⃣ Eliminar la base de datos si ya existe
DROP DATABASE IF EXISTS gym_db;

-- 2️⃣ Crear la base de datos del gimnasio
CREATE DATABASE gym_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

-- 3️⃣ Usar la base de datos
USE gym_db;

-- 4️⃣ Crear tabla 'clientes' (socios)
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    genero ENUM('Masculino', 'Femenino', 'Otro'),
    tipo_membresia ENUM('Mensual', 'Trimestral', 'Anual') NOT NULL,
    fecha_alta DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- 5️⃣ Insertar clientes de ejemplo (socios del gimnasio)
INSERT INTO clientes 
(nombre, apellido, email, telefono, fecha_nacimiento, genero, tipo_membresia, fecha_alta, activo) 
VALUES
('Mario', 'Sánchez', 'mario.sanchez@gym.com', '600123456', '2004-03-15', 'Masculino', 'Mensual', '2025-01-08', TRUE),
('Laura', 'Ruiz', 'laura.ruiz@gym.com', '611234567', '1999-07-21', 'Femenino', 'Trimestral', '2024-12-15', TRUE),
('David', 'Moreno', 'david.moreno@gym.com', '622345678', '1992-11-03', 'Masculino', 'Anual', '2024-10-01', TRUE),
('Carmen', 'López', 'carmen.lopez@gym.com', '633456789', '1988-02-18', 'Femenino', 'Mensual', '2025-02-20', FALSE),
('Sergio', 'Navarro', 'sergio.navarro@gym.com', '644567890', '1995-09-09', 'Masculino', 'Trimestral', '2025-03-01', TRUE);

-- 6️⃣ Mostrar todos los clientes del gimnasio
SELECT * FROM clientes;
