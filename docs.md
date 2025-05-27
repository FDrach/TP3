# Documentación del Sistema de Gestión de Sodería

Este sistema permite la gestión de ventas, stock, clientes, sabores y precios para una sodería. Cuenta con diferentes niveles de acceso y funcionalidades según el rol del usuario.

## Funcionalidades Comunes

### 1. Inicio de Sesión (Login)
Para acceder al sistema, necesitarás un nombre de usuario y contraseña.
-   **Ruta:** `/login`
-   Ingresa tus credenciales en los campos correspondientes.
-   Haz clic en el botón "Login".
-   Si las credenciales son incorrectas, se mostrará un mensaje de error.
-   Si el inicio de sesión es exitoso, serás redirigido a la página principal.

### 2. Barra de Navegación
Una vez dentro del sistema, verás una barra de navegación en la parte superior con las siguientes opciones (pueden variar según tu rol):
-   **Home:** Te lleva a la página de inicio.
-   **Productos:** Muestra el listado de productos disponibles.
-   **Vender:** Permite realizar una nueva venta o compra (según el rol).
-   **Manage (Gestión):** (Solo para Administradores/Empleados) Acceso al panel de gestión.
-   **Información del Usuario:** Muestra tu nombre y rol.
-   **Logout (Cerrar Sesión):** Finaliza tu sesión y te redirige a la página de login.

### 3. Cerrar Sesión (Logout)
-   Haz clic en el botón "Logout" en la barra de navegación.
-   Tu sesión se cerrará y serás redirigido a la página de inicio de sesión.

---

## Documentación para Clientes

Como cliente, tienes acceso a las siguientes funcionalidades:

### 1. Página de Inicio (Home)
-   **Ruta:** `/`
-   Al iniciar sesión, verás una pantalla de bienvenida con accesos directos a:
    -   **Ver Productos:** Te lleva a la lista de productos.
    -   **Vender Productos:** Te permite iniciar una compra.

### 2. Visualización de Productos
-   **Ruta:** `/Productos`
-   Aquí puedes ver un listado de todos los productos disponibles.
-   Cada producto muestra:
    -   Nombre (ej: Lima 320ml)
    -   Una imagen representativa del envase y color.
    -   Precio.
    -   Stock disponible.
    -   Tamaño en ml.

### 3. Realizar una Compra (Sección "Vender")
-   **Ruta:** `/Vender`
-   Esta sección está dividida en dos partes principales: "Productos Disponibles" y "Carrito de Compras".

    #### a. Productos Disponibles:
    -   Se muestra una lista de todos los productos que puedes comprar.
    -   Para cada producto:
        -   Nombre, imagen, precio y stock.
        -   Un campo numérico para indicar la **cantidad** que deseas agregar.
        -   Un botón **"Agregar al Carrito"**.
    -   Si un producto no tiene stock, no podrás agregarlo.

    #### b. Carrito de Compras:
    -   A medida que agregas productos, aparecerán en una tabla en esta sección.
    -   La tabla muestra:
        -   **Producto:** Nombre del producto.
        -   **Cantidad:** Campo editable para modificar la cantidad directamente en el carrito.
        -   **Precio Unit.:** Precio por unidad.
        -   **Subtotal:** Calculado (Cantidad * Precio Unit.).
        -   **Acción:** Un botón **"Eliminar"** para quitar ese producto del carrito.
    -   Debajo de la tabla, verás el **Total** de tu compra.
    -   Un botón **"Vaciar Carrito"** te permite eliminar todos los productos del carrito de una vez.

    #### c. Detalles de la Venta (Checkout):
    -   Una vez que tienes productos en el carrito, aparecerá este formulario.
    -   **Dirección de Entrega:** Se autocompletará con tu dirección registrada. Puedes editarla si es necesario para esta compra específica.
    -   **Método de Pago:** Selecciona cómo deseas pagar (Efectivo, Tarjeta, Transferencia, MercadoPago).
    -   **Notas Adicionales:** Un campo de texto para cualquier instrucción especial sobre tu pedido.
    -   Un botón **"Finalizar Venta"**:
        -   Al hacer clic, se procesará tu pedido.
        -   Se actualizará el stock de los productos.
        -   Se registrará la venta.
        -   Si la venta es exitosa, el carrito se vaciará y verás un mensaje de confirmación.
        -   Si hay algún error (ej: stock insuficiente actualizado por otro usuario), se mostrará un mensaje.

---

## Documentación para Administradores y Empleados

Como Administrador o Empleado, tienes acceso a todas las funcionalidades de cliente, más el panel de gestión.

### 1. Página de Inicio (Home)
-   **Ruta:** `/`
-   Similar a la de cliente, pero el botón **"Panel de Gestión"** te dará acceso a las herramientas administrativas.

### 2. Visualización de Productos
-   **Ruta:** `/Productos`
-   Funcionalidad idéntica a la de cliente.

### 3. Realizar una Venta (Sección "Vender")
-   **Ruta:** `/Vender`
-   Funciona de manera muy similar a la compra del cliente, con una diferencia clave en la sección "Detalles de la Venta":
    -   **Seleccionar Cliente:** Deberás elegir un cliente de una lista desplegable para asociar la venta.
    -   **Dirección de Entrega:** Se autocompletará basada en el cliente seleccionado y será de solo lectura (si necesitas cambiarla, debes editar los datos del cliente en "Gestionar Clientes").
    -   El resto de los campos (Método de Pago, Notas Adicionales) y el proceso de finalizar venta son iguales.

### 4. Panel de Gestión (Manage)
-   **Ruta:** `/manage`
-   Este es el centro de control para administrar la sodería. Presenta una barra de navegación con las siguientes secciones:

    #### a. Gestionar Clientes
    -   **Ruta:** `/manage/clientes`
    -   **Visualización:** Una tabla lista todos los clientes con su Nombre Completo, Email, Teléfono, Dirección, Fecha de Registro y User ID (si está vinculado a un usuario del sistema).
    -   **Agregar Nuevo Cliente:**
        -   Un botón "Agregar Nuevo Cliente" abre un modal (ventana emergente).
        -   El formulario solicita: Nombre Completo, Email, Teléfono, Dirección y User ID (opcional).
        -   Campos como Nombre y Email son obligatorios y se valida el formato del email.
    -   **Editar Cliente:**
        -   Cada fila de cliente tiene un botón "Editar".
        -   Abre el mismo modal, pero con los datos del cliente ya cargados para su modificación.
    -   **Eliminar Cliente:**
        -   Cada fila tiene un botón "Eliminar".
        -   Solicita confirmación antes de borrar al cliente.

    #### b. Gestionar Sabores
    -   **Ruta:** `/manage/sabores`
    -   **Visualización:** Una tabla lista los sabores con su Nombre, una muestra de Color (y su código hexadecimal), los Tamaños disponibles (en ml) y Acciones.
    -   **Agregar Nuevo Sabor:**
        -   El botón "Agregar Nuevo Sabor" abre un modal.
        -   Formulario: Nombre del Sabor, Tamaños (ingresados como números separados por comas, ej: "320, 500, 1000"), y Color (seleccionable con un picker o ingresando el código hexadecimal).
    -   **Editar Sabor:**
        -   Botón "Editar" por fila para modificar un sabor existente.
    -   **Eliminar Sabor:**
        -   Botón "Eliminar" por fila. Se pide confirmación, advirtiendo que puede afectar stock y productos.

    #### c. Gestionar Stock
    -   **Ruta:** `/manage/stock`
    -   **Visualización:** Una tabla muestra cada Sabor, su Color, y las Cantidades en stock para cada Tamaño (ml) definido para ese sabor.
    -   **Acciones por Sabor:**
        -   **"Editar Stock" / "Inicializar Stock":**
            -   Si un sabor ya tiene una entrada de stock, el botón dirá "Editar Stock".
            -   Si no tiene entrada (ej: un sabor nuevo), dirá "Inicializar Stock".
            -   Ambos abren un modal donde puedes ingresar/modificar las cantidades numéricas para cada tamaño disponible del sabor.
        -   **"Eliminar Stock":**
            -   Este botón aparece si ya existe una entrada de stock para el sabor.
            -   Al presionarlo (con confirmación), se elimina el registro de stock completo para ese sabor (sus cantidades volverán a N/A o 0 en la vista).

    #### d. Gestionar Precios
    -   **Ruta:** `/manage/precios`
    -   Esta sección permite definir los precios globales para cada tamaño de envase.
    -   **Visualización y Edición:**
        -   Se listan los tamaños (ej: 320ml, 500ml) con un campo de entrada para su precio. Puedes modificar estos precios directamente.
        -   Un botón "Eliminar" junto a cada tamaño permite quitar ese nivel de precio.
    -   **Agregar Nuevo Nivel de Precio:**
        -   Una sección permite ingresar un "Nuevo Tamaño (ml)" y su "Precio ($)".
        -   El botón "Agregar Nivel (No guarda permanentemente)" añade esta nueva combinación a la lista editable localmente.
    -   **Guardar Todos los Cambios:**
        -   Un botón grande al final de la sección.
        -   Al hacer clic, **todos** los cambios realizados (precios editados, niveles agregados o eliminados localmente) se envían y guardan en el servidor.

    #### e. Historial de Ventas
    -   **Ruta:** `/manage/ventas`
    -   **Visualización:** Una tabla muestra todas las ventas registradas, ordenadas por fecha (más recientes primero).
    -   Columnas: ID Venta, Fecha, Cliente, Empleado que realizó la venta, Monto Total, Método de Pago, Estado (ej: pendiente, completado, entregado), Nº de Items en la venta.
    -   **Acciones por Venta:**
        -   **"Ver Items":** Abre un modal que detalla cada producto, cantidad y subtotal de esa venta específica.
        -   **"Completar":**
            -   Si el estado de la venta es "pendiente", este botón estará activo y permitirá cambiar el estado a "completado" (con confirmación).
            -   Si el estado ya es "completado" o "entregado", el botón aparecerá deshabilitado.
            -   El estado "pendiente" se resalta en color amarillo/ámbar y "completado" en verde para fácil identificación.

