    var BLOCK = '+';
    var HOLE = 'O';
    var GREEN = 'G';
    var BLUE = 'B';

    Math.randomInt = function(lower_inc, upper_exc) {
        return Math.floor(Math.random() * (upper_exc - lower_inc) + lower_inc);
    };

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
            array[i] = array[i].join("");
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
          pieces[i] = getShiftedPiece(pieces, pieces[i], direction);
        }
        return new Board(pieces, direction, this);
      },
      isComplete: function () {
        if (this.isFail()) {
          return false;
        }
        for (var i = 0; i < this.pieces.length; i++) {
          if (this.pieces[i].symbol == GREEN && !this.pieces[i].inTheHole) {
            return false;
          }
        }
        return true;
      },
      isFail: function () {
        for (var i = 0; i < this.pieces.length; i++) {
          if (this.pieces[i].symbol == BLUE && this.pieces[i].inTheHole) {
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

    function Piece(symbol, x, y, inTheHole) {
      this.symbol = symbol;
      this.x = x;
      this.y = y;
      this.inTheHole = inTheHole || false;
    }
    Piece.prototype = {
      clone: function () {
        return new Piece(this.symbol, this.x, this.y, this.inTheHole);
      }
    };

    function getShiftedPiece(pieces, piece, direction) {
      if (piece.symbol == BLOCK || piece.symbol == HOLE || piece.inTheHole) {
        return piece.clone();
      }
      var x = piece.x,
        y = piece.y;
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
        var conflictPiece = hasConflict(pieces, spaces[i]);
        if (conflictPiece.symbol == HOLE) {
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
      return new Piece(piece.symbol, x, y, inTheHole);
    }

    function hasConflict(pieces, coord) {
      for (var i = 0; i < pieces.length; i++) {
        if (coord.x == pieces[i].x && coord.y == pieces[i].y) {
          return pieces[i];
        }
      }
      return false;
    }

    function generateRandomBoard() {
      function make(symbol) {
        var piece;
        do {
          piece = new Piece(symbol, Math.randomInt(0, 5), Math.randomInt(0, 5));
        } while (hasConflict(pieces, piece));
        pieces.push(piece);
      }
      var green_count = Math.randomInt(1, 2);
      var blue_count = Math.randomInt(0, 4);
      var grey_count = Math.randomInt(1, 6);
      var pieces = [];
      pieces.push(new Piece(HOLE, 2, 2));
      for (var i = 0; i < green_count; i++) {
        make(GREEN);
      }
      for (var i = 0; i < blue_count; i++) {
        make(BLUE);
      }
      for (var i = 0; i < grey_count; i++) {
        make(BLOCK);
      }
      return new Board(pieces);
    }

    function BoardWalker(board) {
      this.active = [];
      this.seen = [];
      this.done = false;

      // Unique solutions. Solutions that do not "get there" the same way as 
      // any other solution.
      this.solutions = [];

      // Failures. The blue piece went in the hole.
      this.failures = [];

      // Paths that doubled back on themselves.
      this.circles = [];

      // Paths that ended up in the same place as some other shorter path.
      // (Not including a winning step, those are unique solutions. And not 
      // including circles.)
      this.shortCircuited = [];

      this.processNewStep(board);
    }
    BoardWalker.prototype = {
      step: function () {
        if (this.active.length == 0) {
          this.done = true;
          return;
        }
        var board = this.active.shift();
        this.seen.push(board);
        var directions;
        if (!board.lastDirection) {
          directions = ['up', 'down', 'left', 'right'];
        } else if (board.lastDirection == 'up' || board.lastDirection == 'down') {
          directions = ['left', 'right'];
        } else if (board.lastDirection == 'right' || board.lastDirection == 'left') {
          directions = ['up', 'down'];
        } else {
          throw new Error("Unknown direction: " + board.lastDirection);
        }
        for (var i = 0; i < directions.length; i++) {
          var step = board.getShiftedBoard(directions[i]);
          this.processNewStep(step);
        }
      },
      processNewStep: function (step) {
        if (step.isComplete()) {
          this.solutions.push(step); // yay!
        } else if (step.isFail()) {
          this.failures.push(step); // this fails
        } else if (step.isRedundant()) {
          this.circles.push(step); // we're just going in circles
        } else if (this.seenThisBefore(step)) {
          this.shortCircuited.push(step); // this is redundant with another, shorter path
        } else {
          this.active.push(step); // press on soldier
        }
      },
      seenThisBefore: function (board) {
        for (var i = 0; i < this.seen.length; i++) {
          if (this.seen[i].equals(board)) {
            return true;
          }
        }
        return false;
      }
    };