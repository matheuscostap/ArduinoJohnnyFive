var five = require('johnny-five');
var http = require('http');
var fs = require('fs');

var board = new five.Board({port:"COM3"});

var lm35; //Variável para o Sensor
var lm35Value; //Variável para o valor do Sensor

//Quando a placa estiver pronta para uso
board.on("ready", function(){

	//Inicializando o sensor no pino analogico 0
	lm35 = new five.Sensor({pin:"A0",freq:1000});

	//Lendo o valor do sensor
	//Eventos
	//Change: esse evento é emitido sempre que o valor do sensor muda 
	//Data: é disparado com a frequencia definida com o parâmetro "freq" no sensor
	lm35.on("data", function(){
		//console.log(this.value);
		//Atribuindo o valor do sensor a uma variável qualquer
		lm35Value = this.value - 27;
		//console.log(getTemperatura());
	});
});



//Função createServer passando como parâmetro uma função requestListener
//A função requestListener é executada toda vez que o ocorrer uma requisição
http.createServer(function(req,res){ //Retorna uma instância de Server
	//Verifica a url da requisição
	//https://nodejs.org/api/http.html#http_class_http_incomingmessage
	if(req.url == "/"){ //Se a url for ex:"192.168.0.2:80/"		
		//fs = file system
		//Função para ler determinado arquivo
		//Parâmetros: caminho do arquivo, função de callback
		//https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
		fs.readFile("index_temp.html", function(err,data){ 
			//Função de callback recebe dois parâmetros
			//err - para quando ocorrer algum erro em ler o arquivo
			//data - o conteudo do arquivo
			if (err) {
				console.log(err); //imprime o erro
			}else{
				//https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers
				//Função que serve para enviar um response header. Parâmetros: statusCode, objeto com os Headers
				//Pode usar também a função setHeader e setar um por um
				res.writeHead(200,{'Content-Type':'text-html'}); 
				//Envia o arquivo  
				res.write(data); 
				//Sinaliza para o server que tudo foi enviado e o server considera a mensagem como completa
				//Essa função precisa ser chamada em todas as respostas
				res.end(); 
			}
		});
	}

	if (req.url == "/getTemperatura") {
		res.writeHead(200,{'Content-Type':'application-json'}); 
		res.write(JSON.stringify(objTemperatura(lm35Value)));
		res.end();
	}

}).listen(3000); //"Escuta" conexões em determinada porta

console.log('listen 3000');


var objTemperatura = function(temperatura){
	return{
		temperatura: temperatura
	}
}