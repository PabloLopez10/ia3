//Pablo Lopez 14509
//Inteligencia artifical
//192.168.1.148:4000
//142857
//localhost
const myModule = require('./logica');
URL = "http://192.168.1.148:4000"
username = "PabloLopez"
var socket;

var io = require('socket.io-client')  
var juegos = 1
var movimientos = 1
start();

function start(){
    socket = io.connect(URL, {reconnect: true});

    socket.on('connect',function(){
        console.log("Conectado como usuario: " + username);
        socket.emit("signin",{game:"othello",user_name:username,tournament_id:142857,user_role:"player"});

    });

    socket.on('ok_signin',function(data){

        console.log("Esperando ready....");
        juegos = 1
        movimientos = 1
    });

    socket.on('error_signin',function(data){
        console.log("Connection Error.");
    });

    socket.on('ready',function(data){
        var player_turn_id = data.player_turn_id;
        var num = myModule.intelligentMove(data.board,data.player_turn_id);
        console.log("Movimiento: " + movimientos)
        socket.emit("play",{game_id:data.game_id,player_turn_id:data.player_turn_id,movement:num,tournament_id:142857});
        movimientos = movimientos + 1
    });

    socket.on("finish",function(data){
        var game_id = data.game_id;
        var player_turn_id = data.player_turn_id;
        console.log("Juego Terminado." + juegos);
        juegos = juegos + 1
        socket.emit("player_ready",{tournament_id:142857,game_id:data.game_id,player_turn_id:data.player_turn_id});
    });

};