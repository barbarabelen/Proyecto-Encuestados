/*
 * Modelo
 */
var Modelo = function() {
  this.estado = this.cargar();
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntasEliminadas = new Evento(this);
  this.respuestaAgregada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.votoAgregado = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    let ultimoId = 0;
    let self = this;
    for (let i = 0; i < self.preguntas.length; i++){
      if(self.preguntas[i].id > ultimoId){
        ultimoId = self.preguntas[i].id;
      }
    }
    return ultimoId;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  //se elimina una pregunta dado un id
  borrarPregunta: function(id) {
    const array = this.preguntas.filter(function(pregunta){
      return pregunta.id !== id;
    })
    this.preguntas = array;
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  //se eliminan todas las preguntas
  borrarTodo: function() {
    this.preguntas = [];
    this.ultimoId = 0;
    this.guardar();
    this.preguntasEliminadas.notificar();
  },

  getPreguntaByID: function(id){
    const pregunta = this.preguntas.filter(function(pregunta){
      return pregunta.id === id;
    })
    return pregunta[0];
  },

  agregarRespuesta: function(id, respuesta){
    const pregunta = this.getPreguntaByID(id);
    pregunta.cantidadPorRespuesta.push(respuesta);
    this.guardar();
    this.respuestaAgregada.notificar();
  },

  editarPregunta: function(id, nuevaPregunta, nuevasRespuestas){
    const pregunta = this.getPreguntaByID(id);
    pregunta.textoPregunta= nuevaPregunta;
    pregunta.cantidadPorRespuesta= nuevasRespuestas;
    this.guardar();
    this.preguntaEditada.notificar();
  },

  agregarVoto: function(id, textoRespuesta){
    const pregunta = this.getPreguntaByID(id);
    const respuestaPorVotar = pregunta.cantidadPorRespuesta.filter(function(respuesta){
      return respuesta.textoRespuesta === textoRespuesta;
    })[0];
    respuestaPorVotar.votos+=1;
    this.guardar();
    this.votoAgregado.notificar();
  },

  gerPreguntas: function(){
    return this.preguntas;
  },

  //localstorage incompleto :/
  cargar: function(){
    const estado = localStorage.getItem('estado');
    if(!estado){
      return {
        preguntas: [],
        preguntasEditadas: {}
      }
    }else {
        return JSON.parse(estado);
      }
  },

  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem('estado', JSON.stringify(this.estado))
  },
};
