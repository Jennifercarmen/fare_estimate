$(document).ready(function() {

var topicId = getParameterByName('topic_id');
var $imageUser = $('#img-user');
var $nameUser = $('#name-user');
const $h2Autor = $('#author');
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var displayName = user.displayName;
    console.log(displayName);
    var photoURL = user.photoURL;
    var uid = user.uid;
    var providerData = user.providerData;
    $imageUser.attr('src', photoURL);
    $nameUser.text(displayName);
    $h2Autor.val(displayName)
  } else {
    console.log('No ha iniciado sesion');
  }
});
const obtenerTema = function() {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  const url = `http://examen-laboratoria-sprint-5.herokuapp.com/topics/${topicId}`;

  $.ajax({
    url: proxy + url,
    contentType: 'aplication/json'
  }).done(obtenerTopic)
    .done(obtenerRespuestas)
    .fail(manejarError);
};

// añadir tema a html
const obtenerTopic = function(data) {
  const contenidoRespuesta = data.content;
  const autor = data.author_name;
  $('#topic').append(`
  <div class="container shadow">
      <div class="row">
          <div>
          ${contenidoRespuesta}
           </div>
      </div>
      <div class="row">
          <div>
          ${autor}
            </div>
      </div>
      <hr>`);  
};
const obtenerRespuestas = function() {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  const url = `http://examen-laboratoria-sprint-5.herokuapp.com/topics/${topicId}/responses`;
  $.ajax({
    url: proxy + url,
    contentType: 'aplication/json'
  }).done(añadirRespuestas)
    .fail(manejarError);
};
/* visualizar respuestas */
const añadirRespuestas = function(response) {
  if (response.error === 'Aún no hay respuestas') {
    console.log(response.error);
  }else {
    response.forEach(function(resp) {
      const temarespuesta = resp.content;
      const authorespuesta = resp.author_name;
      let firstChil = $('.respuestas').eq(0); 
      firstChil.prepend(`
      <div class="container shadow">
      <div class="row">
          <div>
          ${temarespuesta}
           </div>
      </div>
      <div class="row">
          <div>
          ${authorespuesta}
            </div>
      </div>
      <hr>
    </div>`);  
    });
  }
};
const manejarError = function() {
  console.log('Se ha producido un error');  
};
obtenerTema();

$('#btn_enviar').click(function() {
  let nuevoAutor = $('#author').val();
  let nuevoTema = $('#message').val();
  $.post(`https://examen-laboratoria-sprint-5.herokuapp.com/topics/${topicId}/responses`,
    {
      author_name: nuevoAutor,
      content: nuevoTema,
      topic_id: topicId
    },
    function(data, status) {
      let respuestas = $('.respuestas');
      respuestas.prepend(`
      <div class="container shadow">
      <div class="row">
          <div>
          ${data.author_name}
           </div>
      </div>
      <div class="row">
          <div>
          ${data.content}
            </div>
      </div>
      <hr>
    </div>`);     
    });
});
});