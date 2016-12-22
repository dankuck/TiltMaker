
import Piece from './Piece.js';

function Board(pieces, lastDirection, lastBoard) {
    this.pieces = pieces;
    this.lastDirection = lastDirection;
    this.lastBoard = lastBoard;
}
Board.prototype = {
  toGrid: function () {
    var array = [
      ["_", "_", "_", "_", "_"], 
      ["_", "_", "_", "_", "_"], 
      ["_", "_", "_", "_", "_"], 
      ["_", "_", "_", "_", "_"], 
      ["_", "_", "_", "_", "_"] 
    ];
    for (var i = 0; i < this.pieces.length; i++) {
      array[this.pieces[i].y][this.pieces[i].x] = this.pieces[i].symbol;
    }
    return array;
  },
  toString: function () {
    var array = this.toGrid();
    return this.arrayToString(array);
  },
  arrayToString: function (array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = array[i].join(" ");
    }
    return array.join("\n");
  },
  toPathString: function () {
    return this.arrayToString(this.toPathArray());
  },
  toPathArray: function () {
    var array = this.toGrid();
    if (! this.lastDirection) {
      return array;
    }
    var direction = " " + this.lastDirection + " ";
    for (var i = 0; i < array.length; i++) {
      array[i].splice(0, 0, direction);
    }
    var prev = this.lastBoard.toPathArray();
    for (var i = 0; i < array.length; i++) {
      array[i] = prev[i].concat(array[i]);
    }
    return array;
  },
  getPiecesCopy: function () {
    return this.pieces.slice(0, this.pieces.length);
  },
  getSortedPiecesCopy: function(direction) {
    var sort;
    if (direction == 'up') {
        sort = function (a, b) {
            if (a.y < b.y) {
                return -1;
            } else if (a.y > b.y) {
                return 1;
            } else {
                return 0;
            }
        };
    } else if (direction == 'down') {
        sort = function (a, b) {
            if (a.y < b.y) {
                return 1;
            } else if (a.y > b.y) {
                return -1;
            } else {
                return 0;
            }
        };
    } else if (direction == 'left') {
        sort = function (a, b) {
            if (a.x < b.x) {
                return -1;
            } else if (a.x > b.x) {
                return 1;
            } else {
                return 0;
            }
        };
    } else if (direction == 'right') {
        sort = function (a, b) {
            if (a.x < b.x) {
                return 1;
            } else if (a.x > b.x) {
                return -1;
            } else {
                return 0;
            }
        };
    } else {
        throw new Error("Unknown direction: " + direction);
    }
    return this.getPiecesCopy().sort(sort);
  },
  getShiftedBoard: function (direction) {
    var pieces = this.getSortedPiecesCopy(direction);
    for (var i = 0; i < pieces.length; i++) {
      pieces[i] = pieces[i].getShiftedPiece(pieces, direction);
    }
    return new Board(pieces, direction, this);
  },
  isComplete: function () {
    if (this.isFail()) {
      return false;
    }
    for (var i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].symbol == Piece.GREEN && !this.pieces[i].inTheHole) {
        return false;
      }
    }
    return true;
  },
  isFail: function () {
    for (var i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].symbol == Piece.BLUE && this.pieces[i].inTheHole) {
        return true;
      }
    }
    return false;
  },
  isRedundant: function () {
    var board = this;
    while (board = board.lastBoard) {
      if (board.equals(this)) {
        return true;
      }
    }
    return false;
  },
  equals: function (other) {
    return this.toString() == other.toString();
  }
};

module.exports = Board;
