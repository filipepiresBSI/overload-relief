/* **** FUNÇÕES PARA O CRUD DA EXTENSÃO ****
 * Criado por Filipe Pires da Silva e Marllon Oliveira Botelho Guida
 */

/*** VARIÁVEL PARA O BUFFER DO DATABASE ***/
var temp = null;

/*** LIMPA O BUFFER DO DATABASE ***/
function limparBuffer() {
  temp = null;
}

/*** FORMATA A HORA PARA SER EXIBIDA ***/
function formatarHora(hora) {
  var formatado = "";
  formatado += hora.substring(0, 2) + ":" + hora.substring(2);
  return formatado;
}

/*** FUNÇÃO QUE CRIA O DATABASE ***/
function criarDatabase() {
  if(localStorage.getItem("database") == null) {
    temp = {};
    localStorage.setItem("database", JSON.stringify({}));
    limparBuffer();
  }
}

/*** FUNÇÃO QUE CARREGA OS DADOS DO DATABASE ***/
function carregarDatabase() {
  temp = JSON.parse(localStorage.getItem("database"));
}

/*** FUNÇÃO QUE SALVA OS DADOS NO DATABASE ***/
function salvarDatabase() {
  localStorage.setItem("database", JSON.stringify(temp));
}

/*** FUNÇÃO PARA ADICIONAR UMA ATIVIDADE ***/
function adicionarAtividade() {
  criarDatabase();
  carregarDatabase();
  
  var atividade = document.getElementById("nome_atividade").value;
  var hora_min = (document.getElementById("hora_min").value).toString();
  var minuto_dezena_min = (document.getElementById("minuto_dezena_min").value).toString();
  var minuto_unidade_min = (document.getElementById("minuto_unidade_min").value).toString();
  var hora_max = (document.getElementById("hora_max").value).toString();
  var minuto_dezena_max = (document.getElementById("minuto_dezena_max").value).toString();
  var minuto_unidade_max = (document.getElementById("minuto_unidade_max").value).toString();

  var minuto_min = minuto_dezena_min + minuto_unidade_min;
  var minuto_max = minuto_dezena_max + minuto_unidade_max;
  
  if(atividade == "") alert("O NOME DA ATIVIDADE NÃO PODE SER VAZIO!");
  else if(parseInt(hora_min + minuto_min) >= parseInt(hora_max + minuto_max)) alert("O TEMPO DE DURAÇÃO MÍNIMA DEVE SER MENOR QUE A DURAÇÃO MÁXIMA!");
  else {
    var chave = atividade.toString();
    var valores = {"hora_min" : hora_min, "minuto_min" : minuto_min, "hora_max" : hora_max, "minuto_max" : minuto_max};
  
    temp[chave] = valores;
  
    salvarDatabase();
    limparBuffer();
    window.location.reload();
  }
}

/*** FUNÇÃO PARA FORMATAR A DURAÇÃO DAS ATIVIDADES ***/
function formatarHoraAtividade(horas, minutos) {
  if(minutos == 0 && horas == 0) return "";
  else if(minutos == 0 && horas == 1) return horas.toString() + " hora";
  else if(minutos == 0 && horas > 1) return horas.toString() + " horas";
  else if(horas == 0 && minutos == 1) return minutos.toString() + " minuto";
  else if(horas == 0 && minutos > 1) return minutos.toString() + " minutos";
  else if(horas == 1 && minutos == 1) return horas.toString() + " hora e " + minutos.toString() + " minuto";
  else if(horas > 1 && minutos == 1) return horas.toString() + " horas e " + minutos.toString() + " minuto";
  else if(horas == 1 && minutos > 1) return horas.toString() + " hora e " + minutos.toString() + " minutos";
  else return horas.toString() + " horas e " + minutos.toString() + " minutos";
}

/*** FUNÇÃO PARA LISTAR AS ATIVIDADES ***/
function listarAtividades() {
  var lista_atividades = document.getElementById("lista-atividades");
  carregarDatabase();
  
  if(JSON.stringify(temp) != "{}") {
    let lista = "";
    var lista_atividades = document.getElementById("lista-atividades");
    contador = 1;

    for(let x in temp) {
      lista += '<img src="imgs/Logo.png"> <b id="' + contador.toString() + '">' + (JSON.stringify(x)).replace(/"/g,"") + '</b>: De <b>' + formatarHoraAtividade((JSON.stringify(temp[x].hora_min)).replace(/"/g, ""), (JSON.stringify(temp[x].minuto_min)).replace(/"/g, "")) + '</b> a <b>'
      + formatarHoraAtividade((JSON.stringify(temp[x].hora_max)).replace(/"/g, ""), (JSON.stringify(temp[x].minuto_max)).replace(/"/g, "")) + '</b>. <span class="material-icons" title="Deletar" onselectstart="return false" onclick="excluirAtividade(' + contador.toString() + ');">delete</span> &nbsp; <span class="material-icons" title="Editar" onselectstart="return false" onclick="atualizarAtividade(' + contador.toString() + ');">edit</span> <br>';
      contador++;
    }
    lista_atividades.innerHTML = lista;
  } else lista_atividades.innerHTML = "SEM ATIVIDADES!";
  
  limparBuffer();
}  

/*** FUNÇÃO PARA EXCLUIR A ATIVIDADE ***/
function excluirAtividade(id) {
  carregarDatabase();

  var modal = document.getElementById("modalDelete");
  var texto = document.getElementById("delete");
  var confirmBtn = document.getElementById("confirmDelete");
  var cancelBtn = document.getElementById("cancelDelete");

  var atividade = document.getElementById(id).innerHTML;
  texto.innerHTML = "Você realmente deseja apagar a atividade " + atividade + " ?"; 

  modal.style.display = "block";

  confirmBtn.onclick = function() {
    delete temp[atividade];
    salvarDatabase();
    limparBuffer();
      
    window.location.reload();
  }

  cancelBtn.onclick = function () {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}

/*** FUNÇÃO PARA ATUALIZAR A ATIVIDADE ***/
function atualizarAtividade(id) {
  carregarDatabase();
  
  var atividade = document.getElementById(id).innerHTML;

  var modal = document.getElementById("modalUpdate");
  var texto = document.getElementById("update");
  var confirmBtn = document.getElementById("confirmUpdate");
  var cancelBtn = document.getElementById("cancelUpdate");

  texto.innerHTML = atividade + "<br><br>"
  + "Duração mínima " + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Duração máxima"; 

  modal.style.display = "block";

  confirmBtn.onclick = function() {
    var hora_min = (document.getElementById("hora_min_update").value).toString();
    var minuto_dezena_min = (document.getElementById("minuto_dezena_min_update").value);
    var minuto_unidade_min = (document.getElementById("minuto_unidade_min_update").value);
    var hora_max = (document.getElementById("hora_max_update").value).toString();
    var minuto_dezena_max = (document.getElementById("minuto_dezena_max_update").value);
    var minuto_unidade_max = (document.getElementById("minuto_unidade_max_update").value);
  
    var minuto_min = minuto_dezena_min.toString() + minuto_unidade_min.toString();
    var minuto_max = minuto_dezena_max.toString() + minuto_unidade_max.toString();

    if(parseInt(hora_min + minuto_min) >= parseInt(hora_max + minuto_max)) alert("O TEMPO DE DURAÇÃO MÍNIMA DEVE SER MENOR QUE A DURAÇÃO MÁXIMA!");
    else {
      if(JSON.stringify(temp[atividade].hora_min).replace(/"/g, "") != hora_min) temp[atividade].hora_min = hora_min;
      if(JSON.stringify(temp[atividade].minuto_min).replace(/"/g, "") != minuto_min) temp[atividade].minuto_min = minuto_min;
      if(JSON.stringify(temp[atividade].hora_max).replace(/"/g, "") != hora_max) temp[atividade].hora_max = hora_max;
      if(JSON.stringify(temp[atividade].minuto_max).replace(/"/g, "") != minuto_max) temp[atividade].minuto_max = minuto_max;
    
      salvarDatabase();
      limparBuffer();
      window.location.reload();
    }
    
  }

  cancelBtn.onclick = function () {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  
}

/*** FUNÇÃO PARA O BOTÃO MAIS DA HORA ***/
function botaoMaisHora(valor, id) {
  var hora = document.getElementById(id);
  var novo_valor = valor;
  if(novo_valor < 23) novo_valor++;
  hora.value = novo_valor;
}

/*** FUNÇÃO PARA O BOTÃO MENOS DA HORA ***/
function botaoMenosHora(valor, id) {
  var hora = document.getElementById(id);
  var novo_valor = valor;
  if(novo_valor > 0) novo_valor--;  
  hora.value = novo_valor;
}

/*** FUNÇÃO PARA O BOTÃO MAIS DA CASA DE DEZENA DE MINUTO ***/
function botaoMaisMinutoDezena(valor, id) {
  var minuto = document.getElementById(id);
  var novo_valor = valor;
  if(novo_valor < 5) novo_valor++;
  minuto.value = novo_valor;
}

/*** FUNÇÃO PARA O BOTÃO MENOS DA CASA DE DEZENA DE MINUTO ***/
function botaoMenosMinutoDezena(valor, id) {
  var minuto = document.getElementById(id);
  var novo_valor = valor;
  if(novo_valor > 0) novo_valor--;
  minuto.value = novo_valor;
}

/*** FUNÇÃO PARA O BOTÃO MAIS DA CASA DE UNIDADE DE MINUTO ***/
function botaoMaisMinutoUnidade(valor, id) {
  var minuto = document.getElementById(id);
  var novo_valor = valor;
  if(novo_valor < 9) novo_valor++;
  minuto.value = novo_valor;
}

/*** FUNÇÃO PARA O BOTÃO MENOS DA CASA DE UNIDADE DE MINUTO ***/
function botaoMenosMinutoUnidade(valor, id) {
  var minuto = document.getElementById(id);
  var novo_valor = valor;
  if(novo_valor > 0) novo_valor--;
  minuto.value = novo_valor;
}

/*** FUNÇÃO QUE CONTROLA A OPÇÃO DE SALVAR O INÍCIO DO HORÁRIO ÚTIL ***/
function salvarHorarioUtilInicio() {
  var hora = document.getElementById("horas_inicio").value;
  var minuto_d = document.getElementById("minutos_dezena_inicio").value;
  var minuto_u = document.getElementById("minutos_unidade_inicio").value;

  var horario = [hora.toString(), minuto_d.toString(), minuto_u.toString()];

    if(horario[0].length == 1) {
      var antigo = horario[0];
      horario[0] = "0" + antigo;
    }

  localStorage.setItem("inicioHorarioUtil", horario[0] + horario[1] + horario[2]);

}

/*** FUNÇÃO QUE CONTROLA A OPÇÃO DE SALVAR O FIM DO HORÁRIO ÚTIL ***/
function salvarHorarioUtilFim() {
  var hora = document.getElementById("horas_fim").value;
  var minuto_d = document.getElementById("minutos_dezena_fim").value;
  var minuto_u = document.getElementById("minutos_unidade_fim").value;

  var horario = [hora.toString(), minuto_d.toString(), minuto_u.toString()];

  if(horario[0].length == 1) {
      var antigo = horario[0];
      horario[0] = "0" + antigo;
    }

  localStorage.setItem("fimHorarioUtil", horario[0] + horario[1] + horario[2]);

}

/*** FUNÇÃO AUXILIAR DE SALVAR O HORÁRIO ÚTIL ***/
function salvarHorarioUtil() {
  salvarHorarioUtilInicio();
  salvarHorarioUtilFim();
}

/*** ADICIONADOR DE ZEROS A NÚMEROS MENORES QUE 10 ***/
function adicionaZeros(decimal) {
  var str = decimal.toString();
  if(str.length < 2) return '0' + str;
  else return str;
}

/*** FUNÇÃO DE RELÓGIO DIGITAL EM TEMPO REAL ***/
function relogio() {
  const separador = ":";
        
  const intervalo = setInterval(() => {
          
  const agora = new Date();
          
  const hora = adicionaZeros(agora.getHours()) + separador + adicionaZeros(agora.getMinutes()) + separador + adicionaZeros(agora.getSeconds());
          
  document.getElementById("relogio").innerHTML = hora;
          
  }, 1000);  
}

/*** FUNÇÃO QUE EXIBE O HORÁRIO ÚTIL ***/
function exibirHoraUtil() {
  var hora = document.getElementById("hora-final");
  var hora_inicial = formatarHora(localStorage.getItem("inicioHorarioUtil").toString());
  var hora_final = formatarHora(localStorage.getItem("fimHorarioUtil").toString());
  hora.innerHTML = "Hora inicial: " + hora_inicial + "<br> "
  + "Hora final: " + hora_final + "<br>";
}

/*** FUNÇÃO QUE CONTROLA A OPÇÃO DE EDITAR O HORÁRIO ÚTIL ***/
function editarHora() {

  var editar = document.getElementById("formulario");
  var cabecalho = document.getElementById("definir");
  cabecalho.innerHTML = "Definir Horário Útil";
  editar.style.display = "block";
  horario_util.style.display ="none";

}

/*** FUNÇÃO QUE CONTROLA A OPÇÃO DE SALVAR O HORÁRIO ÚTIL ***/
function confirmarHora() {

  var editar = document.getElementById("formulario");
  var cabecalho = document.getElementById("definir");

  cabecalho.innerHTML = "Horário Útil";
  editar.style.display = "none";
  horario_util.style.display ="block";

  var hora_i = document.getElementById("horas_inicio").value;
  var minuto_dez_i = document.getElementById("minutos_dezena_inicio").value;
  var minuto_uni_i = document.getElementById("minutos_unidade_inicio").value;
  var hora_f = document.getElementById("horas_fim").value;
  var minuto_dez_f = document.getElementById("minutos_dezena_fim").value;
  var minuto_uni_f = document.getElementById("minutos_unidade_fim").value;
  
  var hora_inicial = hora_i.toString() + minuto_dez_i.toString() + minuto_uni_i.toString();
  var hora_final = hora_f.toString() + minuto_dez_f.toString() + minuto_uni_f.toString();

  if((parseInt(hora_inicial) >= parseInt(hora_final))) {
    alert("O INÍCIO DO HORÁRIO ÚTIL DEVE SER MENOR QUE O FIM DO HORÁRIO ÚTIL!"); 
    editarHora();
  } else {

    salvarHorarioUtil();
    window.location.reload();

  }
  
}

/*** FUNÇÃO QUE CONTROLA A OPÇÃO DE CANCELAR A EDIÇÃO DO HORÁRIO ÚTIL ***/
function cancelaMudanca() {

  var editar = document.getElementById("formulario");
  var cabecalho = document.getElementById("definir");
  cabecalho.innerHTML = "Horário Útil";
  editar.style.display = "none";
  horario_util.style.display ="block";
}

/*** FUNÇÃO QUE CONTROLA A EDIÇÃO DE ATIVIDADES ***/
function modalEditar(){
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

/*** CHAMADA DE FUNÇÕES ***/
relogio();

exibirHoraUtil();

listarAtividades();
