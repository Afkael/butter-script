# butter-script: Documentación Técnica

## Resumen
**butter-script** es un script de backend diseñado para la gestión de interacciones entre un equipo de soporte y clientes a través de WhatsApp. Este proyecto es parte de **milk toffee project**, enfocado en proporcionar una solución integrada y multiagente para la identificación, etiquetado y seguimiento de interacciones con clientes.


## Metas
- Integración con WhatsApp para gestionar mensajes y casos, evitando aplicaciones adicionales.
- Generar datos detallados para una trazabilidad completa en el proceso de soporte.


## Configuración y Dependencias

El proyecto **butter-script** está construido sobre un entorno de Node.js, específicamente utilizando la versión `18.12.1` de Node.js y la versión `9.7.1` de npm. Este entorno asegura la compatibilidad y el correcto funcionamiento de las dependencias y del script en sí. A continuación, se detallan las dependencias principales del proyecto y sus versiones específicas.

### Dependencias del Proyecto

El script hace uso de las siguientes bibliotecas y frameworks, cada uno de los cuales desempeña un papel crucial en la funcionalidad general del sistema:

- **qrcode**: Versión `1.5.3`
  - Utilizado para generar códigos QR, una parte esencial de la autenticación y conexión con WhatsApp Web.

- **qrcode-terminal**: Versión `0.12.0`
  - Proporciona la capacidad de mostrar códigos QR en terminales de línea de comandos, facilitando la conexión con dispositivos móviles para la autenticación de WhatsApp.

- **whatsapp-web.js**: Versión `1.23.0`
  - Un cliente de WhatsApp Web para Node.js, que permite al script interactuar con WhatsApp, manejando mensajes, grupos y más.

### Configuración del Entorno

Para garantizar que el script funcione correctamente, es importante configurar el entorno de Node.js con las versiones especificadas. Aquí hay una guía general para la configuración:

1. **Instalación de Node.js y npm**:
   - Asegúrese de tener Node.js versión `18.12.1` y npm versión `9.7.1` instalados en su sistema. Estas versiones pueden ser verificadas utilizando los comandos `node -v` y `npm -v` respectivamente.

2. **Instalación de Dependencias**:
   - Las dependencias se pueden instalar ejecutando `npm install` en el directorio del proyecto. Esto leerá el archivo `package.json` y descargará las versiones específicas de las dependencias.

3. **Verificación de Dependencias**:
   - Una vez instaladas las dependencias, puede verificar que las versiones correctas estén en su lugar utilizando `npm list --depth=0`.

### Consideraciones Adicionales

- **Compatibilidad de Dependencias**: Las versiones de las dependencias han sido seleccionadas para asegurar la mejor compatibilidad y estabilidad con la versión de Node.js utilizada.
- **Actualizaciones Futuras**: Es importante tener en cuenta que las actualizaciones de estas dependencias o de Node.js pueden requerir ajustes en el script para mantener su funcionamiento adecuado.


### Estructura de Archivos del Script

#### Archivos de Configuración JSON

1. **`agents.json`**
   - Contiene la información de los agentes de soporte, como nombres y otros identificadores relevantes.

2. **`contacts.json`**
   - Almacena los datos de los contactos, incluyendo identificadores únicos y cualquier otra información relevante como nombres y detalles adicionales.

3. **`config.json`**
   - Este archivo incluye configuraciones generales del bot, como el path hacia Chrome, que es esencial para el manejo de archivos multimedia.

#### Archivos de Funcionamiento JS

1. **`contactManager.js`**
   - Gestiona operaciones relacionadas con los contactos, como búsqueda y actualización.

2. **`groupManager.js`**
   - Administra grupos de WhatsApp, incluyendo la creación y gestión de miembros.

3. **`index.js`**
   - Punto de entrada principal del script. Inicializa las gestiones y maneja la conexión con WhatsApp.

4. **`mediaManager.js`**
   - Maneja archivos multimedia en conversaciones de WhatsApp.

5. **`messageHandler.js`**
   - Procesa y maneja mensajes de WhatsApp, ejecutando comandos y dirigiendo mensajes.

6. **`ticketManager.js`**
   - Responsable de la gestión de tickets, incluyendo creación y seguimiento.

Cada uno de estos archivos contribuye a la funcionalidad integral del bot, proporcionando una estructura modular que facilita la escalabilidad y el mantenimiento del proyecto. Los archivos `.json` proporcionan la base de datos y configuraciones esenciales, mientras que los archivos `.js` se encargan de la lógica y operaciones del bot.


## Comandos y Funcionalidades

Cada comando en **butter-script** tiene un propósito específico para manejar los casos de soporte. Además, la ejecución de estos comandos provoca cambios en la imagen de perfil del grupo en WhatsApp, proporcionando una indicación visual del estado del caso y del agente involucrado.

### Comandos Disponibles

- **#take**: Captura el nombre del agente que ejecuta el comando y el timestamp del momento de su ejecución. Cambia la imagen de perfil para mostrar al agente que ha tomado el caso.
- **#global**: Se utiliza cuando el caso se ha derivado a una instancia superior. Este comando puede actualizar la imagen de perfil para reflejar que el caso está siendo manejado a un nivel más alto.
- **#resolved**: Marca un caso como resuelto. Al usarlo, la imagen de perfil puede modificarse para indicar que el caso ha llegado a una conclusión satisfactoria.
- **#tag**: Permite agregar una etiqueta a un caso para su categorización o referencia rápida.
- **#id**: Agrega un identificador de establecimiento del usuario al caso.
- **#close**: Cierra el caso. Al ejecutar este comando, la imagen de perfil puede actualizarse para mostrar que el caso ha sido cerrado y ya no está activo.

Cada uno de estos comandos juega un papel crucial en la gestión eficiente de los casos de soporte, proporcionando no solo un sistema de seguimiento y gestión textual, sino también visual a través de las imágenes de perfil en WhatsApp.

### Instrucciones de Instalación y Configuración para butter-script

1. **Preparar el Entorno**:
   - Asegúrate de tener Node.js y npm instalados en tu sistema. Debes usar Node.js versión 18.12.1 y npm versión 9.7.1.
   - Verifica las versiones con los comandos `node -v` y `npm -v` en tu terminal.

2. **Clonar el Repositorio**:
   - Usa el comando `git clone https://github.com/Afkael/butter-script.git` o copia el proyecto a tu disco local.

3. **Instalar Dependencias**:
   - Navega al directorio del proyecto clonado o copiado.
   - Ejecuta `npm install` en la terminal. Esto instalará todas las dependencias necesarias (`qrcode`, `qrcode-terminal`, `whatsapp-web.js`) según lo definido en tu archivo `package.json`.

4. **Configuración del Proyecto**:
   - Configura los archivos `agents.json`, `contacts.json` y `config.json` con la información necesaria.
     - En `agents.json`, añade los detalles de los agentes de soporte.
     - En `contacts.json`, registra los datos de los contactos.
     - En `config.json`, especifica el path hacia Chrome para el manejo de archivos multimedia.

5. **Ejecución del Script**:
   - Una vez configurado, puedes iniciar el script ejecutando `node index.js` en la terminal.
   - Sigue las instrucciones en pantalla para autenticar y conectar el bot con WhatsApp.

6. **Verificaciones Adicionales**:
   - Asegúrate de que Chrome esté correctamente instalado y accesible en el path especificado en `config.json` para el manejo de archivos multimedia.

7. **Pruebas**:
   - Realiza pruebas para verificar que el bot se conecta y responde como se espera.
   - Puedes usar comandos de prueba y verificar la gestión de tickets y mensajes.

### Consideraciones Adicionales

- **Seguridad y Privacidad**: Asegúrate de manejar todos los datos con las precauciones de seguridad y privacidad necesarias.
- **Actualizaciones**: Mantén tu sistema y las dependencias actualizadas para asegurar la estabilidad y seguridad del bot.


## Uso y Ejemplos

### Iniciar el Bot
- **Ejecución del Bot**: Para iniciar el bot, ejecuta `node index.js` en tu terminal. Sigue las instrucciones para autenticar el bot con WhatsApp Web escaneando el código QR.

### Gestión de Grupos
- **Creación de Grupos para Casos de Soporte**:
  - *Descripción*: El bot crea automáticamente un grupo para cada caso de soporte. Este grupo se nombra con el formato "Nombre de Usuario (TK-00001)".
  - *Ejemplo*: Al contactar por primera vez, se crea un grupo representando el caso "Nombre de Usuario (TK-00001)".
  - *Nota Importante*: Cada grupo representa un caso de soporte individual. Una vez que un caso se cierra con el comando `#close`, y el mismo usuario contacta nuevamente, el bot creará un nuevo grupo para el nuevo caso, por ejemplo, "Nombre de Usuario (TK-00002)".

### Ejemplos de Comandos
- **Uso del Comando #take**:
  - *Descripción*: Asigna un agente a un caso abierto.
  - *Ejemplo*: Cuando un usuario envía un mensaje, un agente puede escribir `#take` para tomar el caso.
- **Uso del Comando #global**:
  - *Descripción*: Deriva el caso a una instancia superior.
  - *Ejemplo*: Si un caso requiere atención especial, el agente puede usar `#global` para escalarlo.
- **Uso del Comando #resolved**:
  - *Descripción*: Marca un caso como resuelto.
  - *Ejemplo*: Una vez que el agente ha solucionado el problema, puede marcar el caso como resuelto usando `#resolved`.
- **Uso del Comando #tag**:
  - *Descripción*: Agrega una etiqueta específica a un caso.
  - *Ejemplo*: Para categorizar un caso, un agente puede usar `#tag [etiqueta]`.
- **Uso del Comando #id**:
  - *Descripción*: Añade un identificador único a un caso.
  - *Ejemplo*: Para referenciar un establecimiento del usuario, se utiliza `#id [identificador]`.
- **Uso del Comando #close**:
  - *Descripción*: Cierra un caso.
  - *Ejemplo*: Cuando un caso ha concluido completamente, se usa `#close` para cerrarlo.

### Manejo de Archivos Multimedia
- **Envío y Recepción de Medios**:
  - *Descripción*: El bot puede manejar el envío y recepción de archivos multimedia utilizando Chrome.
  - *Ejemplo*: Los agentes pueden enviar imágenes o documentos relevantes al caso directamente a través del grupo de WhatsApp.


## Problemas Conocidos y Soluciones

### 1. Problemas con la Transferencia de Archivos de Video
- **Descripción del Problema**: El bot puede experimentar caídas durante la transferencia de archivos de video. Este problema ha sido reportado en el entorno de producción, pero no se ha reproducido en otros entornos.
- **Estado Actual**: Se está investigando la causa del problema. Se recomienda a los usuarios evitar el envío de archivos de video de gran tamaño hasta que se encuentre una solución.
- **Soluciones Temporales**: No hay soluciones conocidas en este momento.

### 2. Errores en el Reenvío de Tarjetas de Contacto
- **Descripción del Problema**: Las tarjetas de contacto reenviadas a través del bot llegan con errores.
- **Estado Actual**: Se está trabajando para identificar y corregir las causas de estos errores.
- **Soluciones Temporales**: Se sugiere enviar la información de contacto en formato de texto hasta que se resuelva el problema.

### 3. Reacciones a Mensajes No Se Reenvían
- **Descripción del Problema**: Las reacciones a mensajes enviadas por los usuarios no se reenvían correctamente.
- **Estado Actual**: Este comportamiento está en revisión para mejorar la funcionalidad de reenvío de reacciones.
- **Soluciones Temporales**: Actualmente no hay una solución alternativa; las reacciones deben considerarse como no soportadas en la versión actual del bot.


## Estado del Proyecto y Contribuciones

**butter-script** es un proyecto de código abierto. Esto significa que cualquiera es libre de utilizar, estudiar, modificar y distribuir el software para cualquier propósito. Al ser un proyecto open source, fomentamos la colaboración y agradecemos cualquier contribución que ayude a mejorar y expandir sus capacidades.

### Cómo Contribuir

Invitamos a desarrolladores, entusiastas del código y cualquier persona interesada a contribuir al proyecto de las siguientes maneras:

- **Reportar Problemas**: Si encuentras errores o problemas, no dudes en abrir un 'issue' en nuestro repositorio de GitHub.
- **Sugerencias y Mejoras**: Ideas para nuevas características o mejoras en las existentes son siempre bienvenidas.
- **Pull Requests**: Si deseas contribuir directamente con código, puedes hacerlo mediante 'pull requests'. Asegúrate de seguir las directrices de contribución especificadas en el repositorio.

### Contacto

Para preguntas, colaboraciones o cualquier otro tipo de consulta relacionada con **butter-script**, puedes contactarme a través de mi página web:

- **PixelCandy**: [www.pixelcandy.com.ar](https://www.pixelcandy.com.ar)

También puedes seguir el progreso y las actualizaciones del proyecto en nuestro repositorio de GitHub: [butter-script](https://github.com/Afkael/butter-script)
