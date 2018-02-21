$(document).ready(function() {
  var $imageUser = $('#img-user');
  var $nameUser = $('#name-user');
  const $temas = $('.secinfo');
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var displayName = user.displayName;
      console.log(displayName);
      var photoURL = user.photoURL;
      var uid = user.uid;
      var providerData = user.providerData;
      $imageUser.attr('src', photoURL);
      $nameUser.text(displayName);
      // ...
    } else {
      console.log('No ha iniciado sesion');
    }
  });
  
  
  const añadirTemas = function(temas) {
    temas.forEach(function(tema) {
      const temita = tema.content;
      const id = tema.id;
      const autor = tema.author_name;
      const contadorRespuesta = tema.responses_count;
  
      $temas.append(`        
          <div class="container shadow">
          <div class="row">
              <div>
              <a href="verTopic.html?topic_id=${id}">${temita}</a>
               </div>
               
          </div>
          <div class="row">
              <div>
              ${autor}
                </div>
               
          </div>
          <div class="row">
              <div >
              ${contadorRespuesta}
                </div>
               
          </div>
          <hr>
      </div>
          
          `);
    });
  };
  
  const buscar = function(temas) {
    let temasCoincidentes = temas.map((val) => val.content);
    $('#buscador').autocomplete({
      source: temasCoincidentes
    });
  };
  
    /* Función para manejar errores */
  const manejarError = function() {
    console.log('Se ha producido un error');
  };
    // obtener temas
  $.ajax({
    url: 'https://examen-laboratoria-sprint-5.herokuapp.com/topics',
    // dataType: 'json',
    contentType: 'aplication/json'
  }).done(añadirTemas)
    .done(buscar)
    .fail(manejarError);
  
  $temas.html('');
 
  $('#guardar').click(function() {
    let nuevoAutor = $('#input-nombre').val();
    let nuevoTema = $('#input-mensaje').val();
    $.post('https://examen-laboratoria-sprint-5.herokuapp.com/topics',
      {
        author_name: nuevoAutor,
        content: nuevoTema
      },
      function(data, status) {
        $('#exampleModal').modal('hide');
        let firstChil = $('#todos-los-temas').eq(0);
        $(firstChil).prepend(` <h2 data-id=${data.id}>${data.author_name}</h2>  <h4><span class="totalRespon"> respuestas</span></h4>
          <p><a href="">${data.content}</a></p>`);
      });
  });
});