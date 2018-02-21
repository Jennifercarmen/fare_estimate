var topicId = getParameterByName('topic_id');
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
      let firstChil = $('.respuestas').eq(0);
      $(firstChil).prepend(`<h2>${data.content}</h2><br><p>por:</p><h2>${data.author_name}</h2><hr>`);     
    });
});
const obtenerTema = function() {
  $.ajax({
    url: `http://examen-laboratoria-sprint-5.herokuapp.com/topics/${topicId}`,
    // dataType: 'json',
    contentType: 'aplication/json'
  }).done(obtenerTopic)
    .done(obtenerRespuestas)
    .fail(manejarError);
};

// añadir tema a html
const obtenerTopic = function(data) {
  const contenido_respuesta = data.content;
  const autor = data.author_name;
  $('#topic').append(`<h2>${contenido_respuesta}</h2>  <br>        <p>por:</p><h2>${autor}</h2>`);  
};
const obtenerRespuestas = function() {
  $.ajax({
    url: `http://examen-laboratoria-sprint-5.herokuapp.com/topics/${topicId}/responses`,
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
      $('.respuestas').append(`<h2>${temarespuesta}</h2><br><p>por:</p><h2>${authorespuesta}</h2><hr>`);  
    });
  }
};
const manejarError = function() {
  console.log('Se ha producido un error');  
};
obtenerTema();
