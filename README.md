# DentalCare - Fichero de Registro Odontológico

¡Bienvenido a **DentalCare**! Esta es una aplicación web moderna y responsiva diseñada para dentistas (particularmente parametrizada para la Dra. Gabriela Díaz) que permite gestionar fichas clínicas de pacientes, programar citas, registrar consultas dentales, prescribir recetas y realizar un seguimiento del progreso de los tratamientos de forma visual e intuitiva.

---

## 🛠️ Tecnologías Actuales de la App

La aplicación está construida bajo un enfoque de desarrollo frontend moderno y ágil, centrado en el rendimiento y la ligereza, libre de dependencias o frameworks externos de terceros (**Zero-Dependency Stack**).

### 1. **Estructura y Semántica (HTML5)**
*   **HTML5 Semántico**: Uso estructurado de etiquetas como `<aside>`, `<main>`, `<section>`, `<header>`, `<nav>` y `<table>` para garantizar una correcta accesibilidad y maquetación limpia.
*   **Formularios Nativos**: Aprovecha la validación integrada en formularios, controles deslizantes interactivos para porcentajes (`<input type="range">`), y selectores nativos de fecha (`type="date"`) y hora (`type="time"`).
*   **Iconografía Vectorial (SVG)**: Todos los íconos del sistema están integrados en formato SVG nativo inline, lo que asegura nitidez a cualquier resolución de pantalla y una velocidad de carga instantánea sin llamadas de red adicionales.

### 2. **Estilos y Diseño Visual (CSS3)**
*   **CSS Grid y Flexbox**: Implementación de layouts dinámicos y bidimensionales para organizar el Dashboard (tarjetas de estadísticas y paneles), el directorio de pacientes y la agenda de citas.
*   **Variables CSS (Custom Properties)**: Declaración de un sistema de diseño consistente con paletas de colores personalizadas (tonos azul/morado premium, alertas HSL para alergias), espaciados estandarizados y efectos de sombreado.
*   **Diseño Responsivo**: Adaptabilidad para múltiples resoluciones mediante breakpoints y media queries.
*   **Glassmorphism & Micro-interacciones**: Efectos visuales de desenfoque tipo cristal (glassmorphism), transiciones suaves de hover y retroalimentación activa en los botones de acción y pestañas de navegación.
*   **Tipografía de Alta Gama**: Uso de la fuente **Outfit** importada desde Google Fonts para brindar un aspecto limpio, moderno y profesional.

### 3. **Lógica de la Aplicación (JavaScript Vanilla - ES6+)**
*   **Renderizado Dinámico**: Funciones JavaScript dedicadas a regenerar fragmentos específicos del DOM (como la lista de citas, estadísticas generales y el perfil del paciente) cuando el estado interno cambia.
*   **Gestión del Estado en Memoria**: Mantenimiento de variables globales de aplicación (`patients`, `currentPatientId`, `activeTab`, `appointmentFilter`) para controlar el flujo de navegación sin necesidad de recargar la página.
*   **Manejo de Eventos Avanzado**: Escuchas de eventos para búsquedas globales en tiempo real (búsqueda instantánea de pacientes por nombre o alergias), cambio de pestañas, manipulación de modales y envío de datos.

---

## 💾 Base de Datos y Persistencia

Actualmente, **DentalCare** es una aplicación que se ejecuta enteramente en el lado del cliente (*client-side*), y utiliza la siguiente solución local para persistir la información:

### **Tecnología de Almacenamiento: LocalStorage (Web Storage API)**

*   **¿Qué es?**: Un mecanismo de almacenamiento web que permite guardar datos estructurados de tipo clave-valor directamente en el navegador web del usuario de forma persistente.
*   **Clave del Almacenamiento**: `dentalcare_patients`
*   **Flujo de Datos en la App**:
    1.  **Inicialización (Seed Data)**: Cuando un usuario ingresa por primera vez y el almacenamiento está vacío, la aplicación detecta la ausencia de datos y carga automáticamente un set de datos de prueba predefinido (**Mock Data**). Este set incluye 4 pacientes detallados con diagnósticos, citas y consultas previas para probar las capacidades de la app.
    2.  **Lectura**: Cada vez que se inicia la app, se realiza un `JSON.parse(localStorage.getItem('dentalcare_patients'))` para cargar los registros en el arreglo en memoria.
    3.  **Escritura/Actualización**: Cualquier acción que altere el estado (crear paciente, editar paciente, eliminar paciente, agendar una cita, cambiar el estado de asistencia, agregar una consulta/receta) invoca la función centralizada `saveToLocalStorage()`, que sincroniza el almacenamiento local mediante `localStorage.setItem('dentalcare_patients', JSON.stringify(patients))`.
*   **Ventajas**:
    *   **Cero Costos de Servidor**: Persistencia de datos inmediata sin necesidad de backend, hosting de bases de datos o configuraciones en la nube.
    *   **Funcionamiento Offline**: La aplicación funciona al 100% sin conexión a Internet una vez cargados los recursos estáticos.
    *   **Persistencia Temporal Fuerte**: Los datos se conservan incluso si el navegador se cierra o la computadora se apaga.
*   **Limitaciones**:
    *   Los datos se guardan a nivel local del navegador y del dispositivo específico. No hay sincronización automática entre dispositivos (e.g., de la laptop al celular).
    *   El límite de almacenamiento del LocalStorage es de aproximadamente 5MB por dominio, lo cual es más que suficiente para miles de registros clínicos planos, pero limita la adición de archivos pesados o radiografías en alta definición en un futuro.

---

## 📁 Estructura del Proyecto

El proyecto está compuesto por los siguientes archivos esenciales en el directorio raíz:

*   📄 [index.html](file:///Users/oscarcaloca/HERD/FICHERO/index.html): Estructura del maquetado principal, definición del sidebar de navegación, contenedores de pestañas (Dashboard, Pacientes, Calendario) y plantillas de modales interactivos.
*   📄 [styles.css](file:///Users/oscarcaloca/HERD/FICHERO/styles.css): Hoja de estilos de la aplicación con la definición del sistema de diseño (variables de color, layouts de cuadrícula, estilo de la línea de tiempo clínica y animaciones).
*   📄 [app.js](file:///Users/oscarcaloca/HERD/FICHERO/app.js): Lógica de negocio. Contiene el estado, funciones de inicialización y actualización de estadísticas, renderizado dinámico de la interfaz, disparadores de modales e integración con el LocalStorage.
*   📄 [README.md](file:///Users/oscarcaloca/HERD/FICHERO/README.md): Este archivo que describe la arquitectura y características de la aplicación.

---

## 🚀 Cómo Ejecutar la Aplicación

Al ser una aplicación 100% estática basada en JavaScript nativo, no requiere ningún paso de compilación previa o instalación de dependencias.

1.  **Doble Clic (Directo)**: Simplemente abre el archivo `index.html` haciendo doble clic en él o arrastrándolo a cualquier navegador web moderno (Chrome, Safari, Firefox, Edge).
2.  **Servidor de desarrollo local (Recomendado para evitar bloqueos por políticas CORS locales en el futuro)**: Puedes servir la carpeta usando herramientas sencillas:
    *   *Si usas Python*:
        ```bash
        python3 -m http.server 8000
        ```
    *   *Si usas Node.js / npm*:
        ```bash
        npx serve
        ```
    *   Posteriormente, abre tu navegador en `http://localhost:8000` (o el puerto que te indique la consola).
