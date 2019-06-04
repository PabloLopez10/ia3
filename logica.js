//Pablo Lopez 14509
//Inteligencia Artificial


//Matriz de pesos 
var pesos = 
        [[1,-0.25,0.1,0.05,0.05,0.1,-0.25,1],
	    [-0.5,-0.25,0.01,0.01,0.01,0.01,-0.25,-0.25],
	    [0.1,0.01,0.05,0.02,0.02,0.05,0.01,0.1],
	    [0.05,0.01,0.02,0.01,0.01,0.02,0.01,0.05],
	    [0.05,0.01,0.02,0.01,0.01,0.02,0.01,0.05],
	    [0.1,0.01,0.05,0.02,0.02,0.05,0.01,0.1],
	    [-0.25,-0.25,0.01,0.01,0.01,0.01,-0.25,-0.25],
        [1,-0.25,0.1,0.05,0.05,0.1,-0.25,1]];

//Matrices para plotear el board que manda el server 
//y hacer las pruebas de los movimientos
var board10 = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]];

var boardReal =  
        [[0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0]];

//Nos permite clonar los boards
let clone = (data) => data.slice();

//Nos permite verificar si el movimiento[x][y] es valido para el board dado
var MovimientoValido = function(board, player, x, y) {
    var comidas = [];

    // Si la casilla esta ocupada devulve falso
    if (board[x][y] === 1 || board[x][y] === 2)
      return false;

    var opponent = fichaOponente(player);
    for (var dx = -1; dx <= 1; dx++) {
      for (var dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0)
          continue;
        for (var i = 1; i < 8; i++) {
          var nx = x + i * dx;
          var ny = y + i * dy;
          if (nx < 0 || 8 <= nx || ny < 0 || 8 <= ny)
            break;
          var cell = board[nx][ny];
          if (cell === player && 2 <= i) {
            for (var j = 1; j < i; j++)
              comidas.push([x+j*dx , y+j*dy]);
            break;
          }
          if (cell !== opponent)
            break;
        }
      }
    }
    //Si es valido devuelve todas las casillas que fueron comidas. 
    return comidas;
  }

//Cambiar una ficha por otra cuando es comida
var Mover = function (board,tile,xstart,ystart){

    piezaAmover = MovimientoValido(board,tile,xstart,ystart);
    if(piezaAmover == false){
        return false;
    }
    board[xstart][ystart] = tile;
    piezaAmover.map((item) => {
        var x =  item[0];
        var y = item[1];
        board[x][y] = tile;
    })
    return true;
};

// obtiene los hijos de cada nodo en el arbol y arma el arbol
var getChildren = function() {
    if(this.x==-1 && this.y ==-1){
        var moves = obtenerValidos(this.board,this.playerTile);
    }
    else{

        var tempBoard = clone(this.board);
        Mover(tempBoard,this.playerTile,this.x,this.y);
        var moves = obtenerValidos(tempBoard,this.oponentTile);
    }

    var children = [];
    for(var i = 0;i<moves.length;i++){
        var currentMove = moves[i];
        var currentBoard = clone(this.board);
        if(this.x==-1 && this.y ==-1){
            children.push(new Node(currentBoard,currentMove[0],currentMove[1],this.playerTile));
        }
        else{
            Mover(currentBoard,this.playerTile,this.x,this.y)
            children.push(new Node(currentBoard,currentMove[0],currentMove[1],this.oponentTile));
        }
    }
    return children;
};

// Declaracion de un nodo del arbol.
function Node(board,x,y,t){
    this.board = board;
    this.x = x;
    this.y = y;
    this.playerTile = t;
    this.oponentTile = fichaOponente(this.playerTile);
    this.parent = null;
    this.getChildren = getChildren;
};

// devuelve el playerTile que representa el oponente
function fichaOponente(ficha){
    if(ficha == 1){
        return 2;
    }
    return 1;
}

// Declaracion del arbol, con un nodo root con -1,-1 por default
function Tree(data,playerTile){
    var node = new Node(data,-1,-1,playerTile);
    this._root = node;    
}

// Obtiene los movimientos validos a moverse para un jugador
function obtenerValidos(board,colour){

    for(x = 0 ; x < 8 ; x++){
        for(y = 0 ; y < 8 ; y ++){
            board10[x+1][y+1]= board[x][y];
        }
    }

    var moves= [];
    for(i=1 ; i< 9 ; i++){
        for(j=1 ; j < 9 ; j ++){
            if(es_valido(i,j,colour,board10)){
                moves.push([i-1,j-1]);
            }               
        }
    }
    return moves;
}

//Revisa si es valido el movimiento
function es_valido (x,y,colour,board)
{
    var min_x = x > 1 ? x - 1 : 1;
    var min_y = y > 1 ? y - 1 : 1;
    var max_x = x < 8 ? x + 1 : 8;
    var max_y = y < 8 ? y + 1 : 8;

    var encontrado = false;
    if (board[x][y])
        return false;
    for (test_x = min_x; test_x <= max_x; test_x++) {
        for (test_y = min_y; test_y <= max_y; test_y++) {
            if (test_x == x && test_y == y)
                continue;

            var colorOponente = board[test_x][test_y];

            if (colorOponente != 0 && colorOponente != colour) {
                var x_offset = test_x - x;
                var y_offset = test_y - y;
                for (t=1;;t++) {
                    var probe_x = x+t*x_offset;
                    var probe_y = y+t*y_offset;

                    if (probe_x < 1 || probe_y < 1 ||
                        probe_x > 8 || probe_y > 8)
                        break;                  
                    if (board[probe_x][probe_y] == 0)
                        break;
                    if (board[probe_x][probe_y] == colour) {
                        encontrado = true;
                        break;
                    }
                }
            }
        }
    }
    return encontrado;
}

function oneToTwoArray(board){
    var counter= 0;
    for(x = 1 ; x < 9 ; x++){
        for(y = 1 ; y < 9 ; y ++){
            board10[x][y]= board[counter];
            boardReal[x-1][y-1] = board10[x][y];
            counter++;
        }
    }
}

//Funcion que se llama desde el cliente y realiza el movimiento, 
exports.intelligentMove = function(board,playerId){
    oneToTwoArray(board);
    var validMoves = obtenerValidos(boardReal,playerId);
    var treeMinMax = new Tree(boardReal,playerId);
    var move = minMax(treeMinMax._root,6,true,-10000000,10000000);
    var number = xyToNumber(move.x,move.y);
    return number;
}

//Devuelve el entero que representa la posicion en el array 1D
function xyToNumber(x,y){
    return y+(8*x);
}

//Devuelve el valor del nodo en base a la matriz de pesos
function evaluate(node){
    var x = node.x;
    var y = node.y;
    var counter = pesos[x][y];
    return counter;
}

//Minimax
function minMax(node,depth,maximizingPlayer,alpha,beta){
    var children = node.getChildren();
    if(depth==0 || children.length==0){
        return {value:evaluate(node),x:node.x,y:node.y};
    }

    var x = -1;
    var y = -1;
    if(maximizingPlayer){
        var bestValue = -999999;

        for( var i=0;i<children.length;i++ ){
            var child = children[i];
            var v = minMax(child,depth-1,false).value;

            if(parseFloat(bestValue)<parseFloat(v)){
                bestValue = v;
                x = child.x;
                y = child.y;
                alpha = Math.max(alpha,bestValue);
                if(beta<=alpha){
                    break;
                }
            }
            else{
                alpha = Math.max(alpha,bestValue);
                if(beta<=alpha){
                    break;
                }
            }
        }
        return {value:bestValue,x:x,y:y};
    }
    else{
        var bestValue = 999999;
        for(var i=0;i<children.length;i++ ){
            var child = children[i];
            var v = minMax(child,depth-1,true).value;
            if(parseFloat(bestValue)>parseFloat(v)){
                bestValue = v;
                x = child.x;
                y = child.y;
                beta = Math.min(beta,bestValue);
                if(beta<=alpha){
                    break;
                }
            }
            else{
                beta = Math.min(beta,bestValue);
                if(beta<=alpha){
                    break;
                }
            }
        }
        return {value:bestValue,x:x,y:y};
    }
}