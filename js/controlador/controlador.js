/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },

  borrarPregunta: function(id) {
      this.modelo.borrarPregunta(id);
  },

  borrarTodo: function() {
      this.modelo.borrarTodo();
  },

  getPreguntaByID: function(id) {
      this.modelo.getPreguntaByID(id);
  },

  agregarRespuesta: function(id, respuesta) {
      this.modelo.agregarPregunta(id, respuesta);
  },

  editarPregunta: function(id, nuevaPregunta, nuevasRespuestas) {
      this.modelo.editarPregunta(id, nuevaPregunta, nuevasRespuestas);
  },

  agregarVoto: function(id, textoRespuesta) {
      this.modelo.agregarVoto(id, textoRespuesta);
  },

  getPreguntas: function() {
      this.modelo.getPreguntas();
  }
};
