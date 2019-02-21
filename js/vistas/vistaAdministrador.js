/*
 * Vista administrador
 */
var VistaAdministrador = function (modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function () {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEliminada.suscribir(function () {
    contexto.reconstruirLista();
  });
  this.modelo.preguntasEliminadas.suscribir(function () {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEditada.suscribir(function () {
    contexto.reconstruirLista();
  });

};


VistaAdministrador.prototype = {
  //lista
  inicializar: function () {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    validacionDeFormulario();
    this.reconstruirLista();
    this.configuracionDeBotones();
  },

  construirElementoPregunta: function (pregunta) {
    var contexto = this;
    var nuevoItem;

    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    nuevoItem = $('<li></li>').addClass('list-group-item').attr('id', pregunta.id).text(pregunta.textoPregunta); //chequear si agregué bien el .text
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function (resp) {
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function () {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i = 0; i < preguntas.length; ++i) {
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function () {
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function () {
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function () {
        //contenedor del texto de la respuesta
        let respuesta = $(this).val();
        //cantidad de votos seteada en 0
        if (respuesta !== '') {
          respuestas.push({
            'textoRespuesta': respuesta
          });
        }
      })
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    //asociar el resto de los botones a eventos
    e.botonBorrarPregunta.click(function () {
      let id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.borrarPregunta(id);
    })
    e.borrarTodo.click(function () {
      contexto.controlador.borrarTodo();
    })
  },

  cargarModal: function (idSelecionado) {

    var contexto = this;
    var preguntas = this.modelo.preguntas;
    contexto.elementos.modal.toggle();
    contexto.elementos.fondoModal.toggle();

    let datosPreguntaAEditar = preguntas.find(function (element) {
      if (element.id === idSelecionado) {
        return element;
      }
    });

    $('#pregunta-modal').val(datosPreguntaAEditar.textoPregunta);

    for (let i = 0; i < datosPreguntaAEditar.cantidadPorRespuesta.length; i++) {
      if (i === 0) {
        $('#respuesta-modal').find($('[name="optionModal[]"]')).val(datosPreguntaAEditar.cantidadPorRespuesta[i].textoRespuesta);
      } else {

        var $template = $('#optionModal'),
          $clone = $template
          .clone()
          .removeClass('hide')
          .addClass('borrarOpcionModal')
          .attr('id', "respuesta" + this.cantRespuestas)
          .insertBefore($template)
        $option = $clone.find('[name="optionModal[]"]');
        $option.val(datosPreguntaAEditar.cantidadPorRespuesta[i].textoRespuesta),
          $('#form-modal').formValidation('addField', $option)

      }
    }
  },

  limpiarFormulario: function () {
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};