# Instrucciones de Uso del Script "Generador JSON Gnius Club"

    Este script te ayuda a convertir los datos de tu hoja de Google Sheets al formato JSON necesario para el sitio web de portafolios de Gnius Club.

    ## 🚀 Cómo Usar el Script

    1.  **Abrir la Hoja de Cálculo:** Abre la Google Sheet que contiene los datos de los proyectos.
    2.  **Encontrar el Menú:** Busca el menú personalizado llamado **"Gnius Club Tools"** en la barra de menú de Google Sheets (puede tardar unos segundos en aparecer después de abrir la hoja).
    3.  **Ejecutar el Generador:** Haz clic en `Gnius Club Tools` y luego selecciona la opción **"Generar JSON"**.
    4.  **Autorización (Primera Vez):** La **primera vez** que ejecutes el script, Google te pedirá autorización para que acceda a tus hojas de cálculo.
        *   Haz clic en "Continuar" o "Revisar permisos".
        *   Selecciona tu cuenta de Google.
        *   Es posible que veas una advertencia de "Google no ha verificado esta aplicación". Esto es normal para scripts personales. Haz clic en **"Configuración avanzada"** (o similar) y luego en **"Ir a [Nombre del script] (no seguro)"**.
        *   Finalmente, haz clic en "Permitir" para conceder los permisos necesarios.
    5.  **Ver la Barra Lateral:** Una vez ejecutado (y autorizado si fue la primera vez), aparecerá una **barra lateral** a la derecha de tu hoja de cálculo titulada "Generador JSON Gnius Club".
    6.  **Generar el JSON:** Dentro de la barra lateral, haz clic en el botón **"Generar JSON"**.
    7.  **Revisar Resultados:**
        *   **Estado:** El texto debajo del botón indicará "Generando..." y luego "¡Generación completada!" o "Error...".
        *   **Validación:** Si el script detecta problemas (advertencias o errores leves, como formatos incorrectos que pudo manejar o datos faltantes no críticos), los listará en la sección "Advertencias/Errores Leves". **Revisa estos mensajes** y corrige los datos en la hoja si es necesario (luego vuelve a generar). Los errores graves (ej. falta `projectTitle`) impedirán que se genere JSON útil.
        *   **Salida JSON:** Si la generación fue exitosa (o tuvo solo advertencias), el código JSON resultante aparecerá en el área de texto grande. Este es el código que necesitas para el sitio web.
    8.  **Copiar el JSON:** Haz clic en el botón **"Copiar al Portapapeles"** debajo del área de texto JSON. Esto copiará todo el código JSON generado.
    9.  **Actualizar `data/projects.json`:** Abre el archivo `data/projects.json` en tu editor de código local, **borra todo su contenido** y pega el JSON que acabas de copiar. Guarda el archivo.
    10. **Cerrar la Barra Lateral:** Puedes cerrar la barra lateral haciendo clic en la 'X' en su esquina superior derecha.

    ## ⚙️ ¿Qué Hace el Script?

    *   Lee **todos los datos** de la hoja activa.
    *   Verifica que los **encabezados de columna** sean los correctos (`projectTitle`, `sdgIds`, `rubricInnovation`, etc.).
    *   **Valida formatos básicos:** fechas, URLs relativas, valores numéricos de la rúbrica (1-3), IDs de ODS (1-17), valores predefinidos de Insignias y Niveles en `teamMembers`.
    *   **Parsea** las columnas con formato complejo (`teamMembers`, `technologies`, etc.), separando los elementos y sus propiedades.
    *   **Genera el `slug`** automáticamente a partir del `projectTitle`.
    *   **Calcula la `finalProjectGrade`** (calificación 1-10) a partir de la suma de las 5 puntuaciones de la rúbrica (que deben ser 1, 2 o 3).
    *   Construye la estructura final del archivo JSON.
    *   Muestra los resultados y posibles mensajes de validación en la barra lateral.

    ## ⚠️ Posibles Problemas y Soluciones

    *   **Menú "Gnius Club Tools" no aparece:** Recarga la hoja de cálculo (F5 o Cmd+R). Espera unos segundos. Si sigue sin aparecer, ve a `Extensiones > Apps Script`, asegúrate de que el script esté guardado y no tenga errores obvios (líneas rojas).
    *   **Error de Autorización Persistente:** Intenta quitar los permisos y volver a autorizar. Ve a tu Cuenta de Google > Seguridad > Apps de terceros con acceso a la cuenta > Busca el nombre del script y revoca el acceso. Luego intenta ejecutarlo de nuevo desde Sheets para volver a autorizar.
    *   **Mensajes de Error en la Barra Lateral:** Lee cuidadosamente los mensajes. Indican qué fila y columna tienen problemas. Corrige los datos en la hoja y vuelve a generar el JSON. Los errores más comunes son formatos incorrectos en campos complejos, valores inválidos (ej. rúbrica != 1, 2 o 3), o URLs mal formadas.
    *   **JSON Vacío o Incompleto:** Esto generalmente ocurre si hay errores graves (como falta de `projectTitle` en muchas filas) o si la hoja está casi vacía. Revisa los mensajes de validación y los datos de tu hoja.

    Si sigues las [Instrucciones de Llenado de Google Sheets](enlace_a_tus_instrucciones_de_llenado.md) cuidadosamente, minimizarás los errores.
