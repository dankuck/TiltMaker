
function Piece(symbol, x, y, inTheHole) {
  this.symbol = symbol;
  this.x = x;
  this.y = y;
  this.inTheHole = inTheHole || false;
}
Piece.prototype = {
  clone: function () {
    return new Piece(this.symbol, this.x, this.y, this.inTheHole);
  },
  getShiftedPiece: function (pieces, direction) {
    if (this.symbol == Piece.BLOCK || this.symbol == Piece.HOLE || this.inTheHole) {
      return this.clone();
    }
    var x = this.x,
      y = this.y;
    var spaces = [];
    if (direction == "up") {
      for (var i = y - 1; i >= 0; i--) {
        spaces.push({x: x, y: i});
      }
    } else if (direction == "down") {
      for (var i = y + 1; i < 5; i++) {
        spaces.push({x: x, y: i});
      }
    } else if (direction == "left") {
      for (var i = x - 1; i >= 0; i--) {
        spaces.push({x: i, y: y});
      }
    } else if (direction == "right") {
      for (var i = x + 1; i < 5; i++) {
        spaces.push({x: i, y: y});
      }
    } else {
      throw new Error("Unknown direction: " + direction);
    }
    var inTheHole = false;
    for (var i = 0; i < spaces.length; i++) {
      var conflictPiece = Piece.hasConflict(pieces, spaces[i]);
      if (conflictPiece.symbol == Piece.HOLE) {
        x = spaces[i].x;
        y = spaces[i].y;
        inTheHole = true;
        break;
      } else if (!conflictPiece) {
        x = spaces[i].x;
        y = spaces[i].y;
      } else {
        break;
      }
    }
    return new Piece(this.symbol, x, y, inTheHole);
  }
};

Piece.hasConflict = function hasConflict(pieces, coord) {
  for (var i = 0; i < pieces.length; i++) {
    if (coord.x == pieces[i].x && coord.y == pieces[i].y) {
      return pieces[i];
    }
  }
  return false;
}

Piece.BLOCK = '+';
Piece.HOLE = 'O';
Piece.GREEN = 'G';
Piece.BLUE = 'B';

module.exports = Piece;
