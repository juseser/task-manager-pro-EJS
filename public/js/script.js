const btn = document.querySelector('#btnNuevaTarea');//boton para agregar nueva tarea
const btnEditar = document.querySelectorAll('.btn-editar');//boton para editar una tarea
const btnEliminar= document.querySelectorAll('.btn-eliminar');//boton para eliminar una tarea
const modal = document.querySelector('#modalTarea');
const cerrar = document.querySelector('#cerrarModal'); //span que se usa para cerrar el modal
const form = document.querySelector('#formTarea');//formulario para editar o crear tarea
const modalTitulo = document.querySelector('#modalTitulo');
const btnGuardar = document.querySelector('#btnGuardar');
const tituloInput = document.querySelector('#tituloInput');
const estatusInput = document.querySelector('#estatusInput');
const fechaInput = document.querySelector('#fechaInput');
const toast = document.querySelector('#toast');
const toastAgregar = document.querySelector('#toastAgregar');
const toastEditar = document.querySelector('#toastEditar');
const mensajeErrorTarea = document.querySelector('#mensajeErrorTarea');//div que va a mostrar el mensaje de error retornado al crear o editar una tarea en el form madal

const modalConfirmacion = document.querySelector('#confirmacionEliminar');
const btnCancelar = document.querySelector('#cancelarEliminar');
const btnConfirmar = document.querySelector('#confirmarEliminar');

let idTareaAEliminar = null;
let elementoTareaAEliminar = null;
let editandoId = null;

// ==============================
// Modal para crear Tarea
// ==============================
btn.addEventListener('click', () => {
  form.dataset.editando = 'false';//indicamos que vamos a crear
  tituloInput.value = '';
  estatusInput.value = 'pendiente';
  fechaInput.value = '';
  modalTitulo.textContent = 'Nueva Tarea';
  btnGuardar.textContent = 'Guardar tarea';
  mensajeErrorTarea.classList.add('oculto');
  modal.classList.remove('oculto');
});

// ==============================
// Modal para editar tarea
// ==============================
btnEditar.forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    try {
      const res = await fetch(`/tareas/${id}`);// Hace una petición al backend para obtener los datos de la tarea
      const tarea = await res.json();// Convierte la respuesta del servidor a formato JSON
      if (tarea.error) return alert(tarea.error);
      form.dataset.editando = 'true';//indicamos que vamos a editar
      form.dataset.idTareaEdit = id;
      tituloInput.value = tarea.titulo;
      estatusInput.value = tarea.estatus;
      fechaInput.value = tarea.fechaLimite ? new Date(tarea.fechaLimite).toISOString().split('T')[0] : '';
      modalTitulo.textContent = 'Editar Tarea';
      btnGuardar.textContent = 'Actualizar';
      mensajeErrorTarea.classList.add('oculto');
      modal.classList.remove('oculto');
    } catch (err) {
      alert('❌ Error al cargar la tarea');
    }
  });
});

// ==============================
// Funcionalidad cerrar modal
// ==============================
cerrar.addEventListener('click', () => {//Cerrar desde un boton
  modal.classList.add('oculto');
  mensajeErrorTarea.classList.add('oculto');
});

window.addEventListener('click', e => {//Cerrar dando click por fuera del modal
  if (e.target === modal) modal.classList.add('oculto');
  if (e.target === modalConfirmacion) modalConfirmacion.classList.add('oculto');
});

// ==============================
// Registrar o editar tarea
// ==============================
form.addEventListener('submit', async (e) => {
  e.preventDefault();// Previene que el formulario se envíe de forma tradicional y recargue la página
  //Crea un objeto con los datos del formulario
  const datos = {
    titulo: tituloInput.value.trim(),// Quita espacios al inicio y fin del título ingresado
    estatus: estatusInput.value,// Obtiene el valor del campo de estatus (ej. "pendiente")
    fechaLimite: fechaInput.value ? fechaInput.value : null //Asignamos la fecha, en caso de que venga vacia asignamos null
  };
  const esEdicion = form.dataset.editando === 'true';//validamos si vamos a editar o a crear
  const url = esEdicion ? `/tareas/${form.dataset.idTareaEdit}` : '/tareas'; //asignamos la ruta, si es para editar o para crear
  const metodo = esEdicion ? 'PUT' : 'POST'; //asignamos el verbo http, si es para editar put y si es para crear post

  try {
     // Envía una petición HTTP a la URL definida (puede ser POST o PUT dependiendo si es edición o creación)
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },// Indica que el cuerpo es JSON
      body: JSON.stringify(datos),// Convierte el objeto JS a JSON para enviarlo al servidor
    });
    const resultado = await res.json();// Espera la respuesta del servidor y la convierte de JSON a objeto JS
    // Si la respuesta fue exitosa (código HTTP 2xx)
    if (res.ok) {
      const redir = esEdicion ? '?editada=true' : '?creada=true';// Define un query param para indicar el tipo de operación
      window.location.href = `/tareas${redir}`;//Redirige al usuario a la página de tareas, incluyendo en la URL un indicador de si se creó o editó una tarea
    } else {
      mensajeErrorTarea.textContent = resultado.mensaje ? resultado.mensaje : '❌ Error al guardar tarea'; // Si hubo error en la respuesta del servidor, muestra el mensaje de error recibido o uno genérico en el modal
      mensajeErrorTarea.classList.remove('oculto');// Muestra el mensaje de error en pantalla
    }
  } catch (err) {
    // Si ocurrió un error inesperado en JS (problema de red, error en el fetch, etc.)
    console.error('Error:', err);// Lo muestra en consola
    mensajeErrorTarea.textContent = '❌ Error inesperado en JS: ' + err.message;// Muestra el mensaje de error al usuario
    mensajeErrorTarea.classList.remove('oculto');// Muestra el contenedor del mensaje de error
  }
});

// =============================================
// Inicialización de toasts al cargar la página
// =============================================
document.addEventListener('DOMContentLoaded', () => {//Espera a que todo el contenido del DOM esté completamente cargado antes de ejecutar el código
  const url = new URL(window.location.href);// Crea un objeto URL a partir de la URL actual del navegador
  if (url.searchParams.get('creada') === 'true' && toastAgregar) { // Verifica si el parámetro de la URL 'creada' es igual a 'true' y si existe el elemento 'toastAgregar'
    toastAgregar.classList.remove('oculto'); // Quita la clase 'oculto' para que el toast de "tarea creada" se muestr
    toastAgregar.classList.add('visible');// Agrega la clase 'visible' para mostrar el toast con estilos visibles
    // Después de 3 segundos (3000 ms), oculta nuevamente el toast
    setTimeout(() => {
      toastAgregar.classList.remove('visible');// Quita la clase 'visible'
      toastAgregar.classList.add('oculto'); // Agrega la clase 'oculto' para que desaparezca
    }, 3000);
    url.searchParams.delete('creada');//Elimina el parámetro 'creada' de la URL para que no vuelva a mostrarse el toast al recargar la página
    history.replaceState(null, '', url.toString()); //Reemplaza la URL en la barra de direcciones sin recargar la página
  }
  if (url.searchParams.get('editada') === 'true' && toastEditar) { //Verifica si el parámetro de la URL 'editada' es igual a 'true' y si existe el elemento 'toastEditar'
    toastEditar.classList.remove('oculto');
    toastEditar.classList.add('visible');
    // Después de 3 segundos, lo oculta nuevamente
    setTimeout(() => {
      toastEditar.classList.remove('visible');
      toastEditar.classList.add('oculto');
    }, 3000);
    url.searchParams.delete('editada');
    history.replaceState(null, '', url.toString());
  }
});

// ==============================
// Eliminar Tarea
// ==============================

// Itera sobre todos los botones con clase btnEliminar
btnEliminar.forEach(btn => {
  // Agrega un evento al hacer clic en cada botón de eliminar
  btn.addEventListener('click', e => {
    idTareaAEliminar = e.target.dataset.id; // Guarda el ID de la tarea que se va a eliminar
    elementoTareaAEliminar = e.target.closest('.tarea-item'); // Guarda el contenedor DOM (elemento padre del botón) que representa la tarea a eliminar, 
                                                              // para luego removerlo del DOM si la eliminación es exitosa
    modalConfirmacion.classList.remove('oculto'); // Muestra el modal de confirmación
  });
});

// Evento para cancelar la eliminación
btnCancelar.addEventListener('click', () => {
  modalConfirmacion.classList.add('oculto'); // Oculta el modal de confirmación
  idTareaAEliminar = null; // Resetea el ID de la tarea
  elementoTareaAEliminar = null; // Resetea el elemento DOM de la tarea
});

// Evento para confirmar la eliminación
btnConfirmar.addEventListener('click', async () => {
  if (!idTareaAEliminar) return; // Si no hay tarea seleccionada, no hace nada

  try {
    // Envia petición DELETE al backend para eliminar la tarea
    const res = await fetch(`/tareas/${idTareaAEliminar}`, { method: 'DELETE' });
    const data = await res.json(); // Convierte la respuesta en JSON

    // Muestra un mensaje en el toast (puede ser éxito o error)
    toast.innerText = data.mensaje || data.error || '❌ Error inesperado';
    toast.classList.remove('oculto');
    toast.classList.add('visible');

    // Si fue exitosa la eliminación, remueve el elemento de la tarea del DOM
    if (data.mensaje) elementoTareaAEliminar.remove();

    // Oculta el toast luego de 3 segundos
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.classList.add('oculto');
    }, 3000);
  } catch (error) {
    // En caso de error en la petición, muestra mensaje en el toast
    toast.innerText = '❌ Error al eliminar tarea';
    toast.classList.remove('oculto');
    toast.classList.add('visible');

    // Oculta el toast luego de 3 segundos
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.classList.add('oculto');
    }, 3000);
  }

  // Oculta el modal y resetea variables
  modalConfirmacion.classList.add('oculto');
  idTareaAEliminar = null;
  elementoTareaAEliminar = null;
});

