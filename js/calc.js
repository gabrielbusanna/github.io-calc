/**
 * Executado ao carregar a página:
 */
$(document).ready(function(){
       
      // total de horas padrão
	$("#totalHorasDia").val('08:48'); 
    
	// mascara de hora
	$(".hora").mask('99:99'); 

	// ação para o evento onblur das horas: verificar se o horário digitado é válido e refazer os cálculos
	$('.hora').blur(function() { 
		if( preencheuHoraCompleta($(this).val()) && ! isHoraValida($(this).val()) ) {
			alert('Horário inválido! Por favor, informe um horário válido.');
			$(this).val('');
			$(this).focus();
		}
		
		// Refaz os cálculos
		calculaHoras();
	});
});
/**
 * Realiza os cálculos dos horários, com base nas horas informadas.
 */
function calculaHoras(){
	
    // valores inseridos
	totalHorasDia = $("#totalHorasDia").val();
	horaEntrada = $("#horaEntrada").val();
	horaIdaAlmoco = $("#horaIdaAlmoco").val();
	horaVoltaAlmoco = $("#horaVoltaAlmoco").val();	
	horaSaida = $("#horaSaida").val();	
	
	// Limpa os campos calculados
	$("#diferencaPrimeiroTurno").html('');
	$("#tempoRestante").html('');
	$("#horaSaidaMinima").html('');
	$("#saldoHoras").html('');
	
	if( possuiValor(horaEntrada) && possuiValor(horaIdaAlmoco) ) {
		
		// Calcula o intervalo entre a entrada e o almoco
		diffEntradaAlmoco = diferencaHoras( horaEntrada, horaIdaAlmoco );
		$("#diferencaPrimeiroTurno").html(diffEntradaAlmoco);
		
		if( possuiValor(totalHorasDia) ){
		
			// A partir do tempo que ja passou entre a entrada e o almoco,
			// calcula o tempo que falta para completar o total de horas do dia
			tempoRestante = diferencaHoras( diffEntradaAlmoco, totalHorasDia);
			$("#tempoRestante").html(tempoRestante);
			
			if( possuiValor(horaVoltaAlmoco) ){
			
				// Calcula, a partir da hora do retorno do almoço e do tempo restante
				// para completar as horas, qual o horário ideal para ir embora
				horaSaidaCerta = somaHora(horaVoltaAlmoco, tempoRestante);
				$("#horaSaidaMinima").html(horaSaidaCerta);
				
				if( possuiValor(horaSaida) ){
			
					// Caso a pessoa vá embora antes ou depois do horário ideal, calcula
					// o tempo q mais ou a menos que ela trabalhou do total que ela devia
					// trabalhar
					saldoHoras = diferencaHoras(horaSaidaCerta, horaSaida);
					$("#saldoHoras").html(saldoHoras);
					
					// Se ela ficou tempo a mais, o saldo é positivo; se a pessoa
					// saiu mais cedo do que devia, o saldo é negativo
					if( isHoraInicialMenorHoraFinal(horaSaida, horaSaidaCerta) )
						$("#saldoHoras").html("-"+ $("#saldoHoras").html());
                                   
                    
				}
			}
		}
	}
}

/**
* Retona a diferença entre duas horas.
* Exemplo: 14:35 a 17:21 = 02:46
* Adaptada de http://stackoverflow.com/questions/2053057/doing-time-subtraction-with-jquery
*/
function diferencaHoras(horaInicial, horaFinal) {

	// Tratamento se a hora inicial é menor que a final	
	if( ! isHoraInicialMenorHoraFinal(horaInicial, horaFinal) ){
	 	aux = horaFinal;
		horaFinal = horaInicial;
		horaInicial = aux;
	}

    hIni = horaInicial.split(':');
    hFim = horaFinal.split(':');

	horasTotal = parseInt(hFim[0], 10) - parseInt(hIni[0], 10);
	minutosTotal = parseInt(hFim[1], 10) - parseInt(hIni[1], 10);
	
    if(minutosTotal < 0){
        minutosTotal += 60;
        horasTotal -= 1;
    }
	
    horaFinal = completaZeroEsquerda(horasTotal) + ":" + completaZeroEsquerda(minutosTotal);
    return horaFinal;
}

/**
* Soma duas horas.
* Exemplo:  12:35 + 07:20 = 19:55.
*/
function somaHora(horaInicio, horaSomada) {
	
    horaIni = horaInicio.split(':');
    horaSom = horaSomada.split(':');

    horasTotal = parseInt(horaIni[0], 10) + parseInt(horaSom[0], 10);
	minutosTotal = parseInt(horaIni[1], 10) + parseInt(horaSom[1], 10);
	
    if(minutosTotal >= 60){
        minutosTotal -= 60;
        horasTotal += 1;
    }
	
    horaFinal = completaZeroEsquerda(horasTotal) + ":" + completaZeroEsquerda(minutosTotal);
    return horaFinal;
}

/**
 * Verifica se a hora inicial é menor que a final.
 */
function isHoraInicialMenorHoraFinal(horaInicial, horaFinal){
	horaIni = horaInicial.split(':');
    horaFim = horaFinal.split(':');

	// Verifica as horas. Se forem diferentes, é só ver se a inicial 
	// é menor que a final.
	hIni = parseInt(horaIni[0], 10);
	hFim = parseInt(horaFim[0], 10);
	if(hIni != hFim)
		return hIni < hFim;
	
	// Se as horas são iguais, verifica os minutos então.
    mIni = parseInt(horaIni[1], 10);
	mFim = parseInt(horaFim[1], 10);
	if(mIni != mFim)
		return mIni < mFim;
}

/**
 * Verifica se o usuário informou todos os campos da hora (hh:mm).
 */
function preencheuHoraCompleta( horario ){
	var hora = horario.replace(/[^0-9:]/g ,''); // deixa só números e o ponto
	return hora.length == 5;
}

/**
 * Verifica se a hora é válidas. Exemplo: 12:34 é válido, 03:89 é inválido.
 */
function isHoraValida( horario ) {
	var regex = new RegExp("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$");
	return regex.exec( horario ) != null;
}

/**
 * Verifica se um campo está vazio.
 */
function possuiValor( valor ){
	return valor != undefined && valor != '';
}

/**
 * Completa um número menor que dez com um zero à esquerda.
 * Usado aqui para formatar as horas... Exemplo: 3:10 -> 03:10 , 10:5 -> 10:05
 */
function completaZeroEsquerda( numero ){
	return ( numero < 10 ? "0" + numero : numero);
}
