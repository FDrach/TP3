**Trabajo Práctico N° 3 – Programación III**
Tecnicatura Universitaria en Programación – UTN

**Profesor:** Matías Sebastián Chocobar

**Título:** Sistema de gestión de ventas para una sodería
**Modalidad:** Grupal (según los equipos ya confirmados)
**Tecnologías obligatorias:** React + Vite, JSON Server (API fake), React Router DOM, Zustand, Bootstrap, Hooks
**Entrega:** código (repositorio de GitHub) + presentación
**Desarrollo:** La presentación es obligatoria y se **realizará** en clase, de forma presencial

---

**Punto 1 (1 punto): Desarrollo técnico del sistema**

**Objetivo:**

Crear una SPA (Single Page Application) que simule un sistema de gestión para una sodería, permitiendo:

*   Visualizar y gestionar productos, clientes, stock y ventas.
*   Incorporar un sistema de autenticación que distinga al menos dos tipos de usuarios:
    *   **Clientes:** acceden solo a información de productos y pedidos.
    *   **Empleados/Admin:** acceden a funcionalidades administrativas como gestión de productos, ventas, clientes y usuarios.

**Requisitos técnicos mínimos:**

*   **Landing Page** atractiva, responsive y funcional como presentación inicial.
*   **Login/Logout** con lógica de roles para controlar el acceso a las rutas.
*   Implementar navegación con **React Router DOM** con al menos 4 rutas.
*   Uso de **Zustand** para almacenar y compartir al menos 3 variables globales (como sesión, carrito, tipo de usuario).
*   Crear un **custom hook** para todas las operaciones HTTP (GET, POST, PUT, DELETE).
*   Uso obligatorio de **hooks**: `useState`, `useEffect`, `useParams`, `useNavigate`.
*   Separación de lógica y estilos, exportando constantes y componentes.
*   API simulada con **JSON Server**, respetando el estándar REST.
*   Diseño con **Bootstrap** u otro sistema de estilos moderno.

**Importante:** No se provee la estructura de base de datos. El equipo deberá **analizar y deducir** las entidades necesarias para cumplir los requisitos del sistema (productos, stock, clientes, ventas, usuarios, etc.).

---

**Punto 2 (1 punto): Presentación del producto**

**Objetivo:**

Vender el sistema como si fuera un producto real, preparado para presentarse ante un cliente o inversor.

**Requisitos:**

*   Documento `README.md` con:
    *   Nombre del proyecto
    *   Objetivos
    *   Tecnologías utilizadas
    *   Instrucciones claras de instalación y uso
*   Presentar el sistema como una solución profesional: destacar beneficios, escalabilidad, experiencia de usuario.
*   Se valorará la creatividad en:
    *   Interfaz visual
    *   Uso de íconos, imágenes, colores, marca
    *   Agregado de funcionalidades extra como carrito, historial de ventas, buscadores, filtros

---

**Criterios de evaluación:**

*   Cumplimiento de requerimientos funcionales y técnicos
*   Estructura del código y reutilización de componentes
*   Claridad en la separación lógica de responsabilidades
*   Diseño visual y experiencia de usuario
*   Documentación y presentación del proyecto
*   Originalidad y propuesta de valor del sistema

---
