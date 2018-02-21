$(document).ready(function() {
  var $imageUser = $('#img-user');
  var $nameUser = $('#name-user');
  const $temas = $('.secinfo');
  const $input_autor=$('#input-autor');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var displayName = user.displayName;
      console.log(displayName);
      var photoURL = user.photoURL;
      var uid = user.uid;
      var providerData = user.providerData;
      $imageUser.attr('src', photoURL);
      $nameUser.text(displayName);
      $input_autor.val(displayName)
    } else {
      console.log('No ha iniciado sesion');
    }
  });
  
  
  const añadirTemas = function(temas) {
    temas.forEach(function(tema) {
      const content = tema.content;
      const id = tema.id;
      const autor = tema.author_name;
      const contadorRespuesta = tema.responses_count;
  
      $temas.append(`        
          <div class="container shadow">
          <div class="row">
              <div>
  
              <a href="verTopic.html?topic_id=${id}">${content}</a>
               </div>
               
          </div>
          <div class="row">
              <div>
              ${autor}
                </div>
               
          </div>
          <div class="row">
              <div >
              ${contadorRespuesta} respuestas
                </div>
               
          </div>
          <hr>
      </div>
          
          `);
    });
  };
  
  const temasDeBusqueda = function(temas) {
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
    contentType: 'aplication/json'
  }).done(añadirTemas)
    .done(temasDeBusqueda)
    .fail(manejarError);
  
  $temas.html('');
 
  $('#guardar').click(function() {
    let nuevoAutor = $('#input-autor').val();
    let nuevoTema = $('#input-content').val();
    $.post('https://examen-laboratoria-sprint-5.herokuapp.com/topics',
      {
        author_name: nuevoAutor,
        content: nuevoTema
      },
      function(data, status) {
        $('#exampleModal').modal('hide');
        let firstChil = $('.secinfo').eq(0);
        $(firstChil).prepend(` 
        <div class="container shadow">
        <div class="row">
            <div>
            <a href="verTopic.html?topic_id=${data.id}">${data.content}</a>
             </div>
             
        </div>
        <div class="row">
            <div>
            ${data.author_name}
              </div>
             
        </div>
        <div class="row">
        <div>
        0 respuestas
          </div>
         
    </div>
        <hr>
    </div>`);
      });
  });
});