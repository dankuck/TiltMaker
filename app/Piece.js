/**
 * ----------------------
 * Piece
 * ----------------------
 * A Piece is an immutable representation of a game element. Most are pieces,
 * but The Hole is also represented by a Piece.
 *
 * Each Piece has a symbol, x and y coordinates, and the Boolean inTheHole.
 *
 * Symbols:
 *   Piece.GREEN
 *   Piece.BLUE
 *   Piece.HOLE
 *   Piece.BLOCK
 *
 * A Piece can determine where it would slide on a Board using
 * getShiftedPiece().
 *
 * If a Piece is at the same coordinates as The Hole, inTheHole will be true,
 * and getShiftedPiece() will return a Piece in the same location as this.
 */
class Piece {

    constructor(symbol, x, y, inTheHole) {
        this.symbol = symbol;
        this.x = x;
        this.y = y;
        this.inTheHole = inTheHole || false;
    }

    /**
     * Copy this Piece
     * @return Piece
     */
    clone() {
      return new Piece(this.symbol, this.x, this.y, this.inTheHole);
    }

    /**
     * This yields a new Piece in the location it would settle among the pieces
     * given when shifted in the direction given.
     *
     * @param  Array pieces
     * @param  String direction up|down|left|right
     * @return Piece
     */
    getShiftedPiece(pieces, direction) {
        // Don't let Blocks or The Hole move, and don't let any trapped piece
        // leave The Hole.
        if (
            this.symbol == Piece.BLOCK
            || this.symbol == Piece.HOLE
            || this.inTheHole
        ) {
            return this.clone();
        }

        const spaces = this.getSpaces(direction)

        // Iterate over all the spaces we found, checking to see if it
        // has anything in it, and if so, is it The Hole?

        const {x, y, hole} = this.findSpace(pieces, spaces);

        return new Piece(this.symbol, x, y, hole);
    }

    /**
     * This builds an array of spaces that this Piece might go to in the given
     * direction, sorted from closest to furthest.
     *
     * @param  String direction up|down|left|right
     * @return Array
     */
    getSpaces(direction) {
        const {x, y} = this;
        const spaces = [];
        if (direction == 'up') {
            for (let i = y - 1; i >= 0; i--) {
                spaces.push({x: x, y: i});
            }
        } else if (direction == 'down') {
            for (let i = y + 1; i < 5; i++) {
                spaces.push({x: x, y: i});
            }
        } else if (direction == 'left') {
            for (let i = x - 1; i >= 0; i--) {
                spaces.push({x: i, y: y});
            }
        } else if (direction == 'right') {
            for (let i = x + 1; i < 5; i++) {
                spaces.push({x: i, y: y});
            }
        } else {
            throw new Error(`Unknown direction: ${direction}`);
        }
        return spaces;
    }

    /**
     * Find the last open space in the list or The Hole. This returns an object
     * formatted as {x, y, hole}, where `hole` is true if x, y is the location
     * of The Hole.
     *
     * @param  Array spaces     As from getSpaces()
     * @return Object           {x, y, hole}
     */
    findSpace(pieces, spaces) {
        let {x, y} = this;
        for (let i = 0; i < spaces.length; i++) {
          const conflict = Piece.hasConflict(pieces, spaces[i]);
          if (! conflict) {
            x = spaces[i].x;
            y = spaces[i].y;
          } else if (conflict.symbol == Piece.HOLE) {
            return {
                x: spaces[i].x,
                y: spaces[i].y,
                hole: true,
            }
          } else { // We encountered a conflict that is not The Hole
            break;
          }
        }
        return {
            x,
            y,
            hole: false
        };
    }
};

Piece.hasConflict = function hasConflict(pieces, {x, y}) {
    for (var i = 0; i < pieces.length; i++) {
        if (x == pieces[i].x && y == pieces[i].y) {
            return pieces[i];
        }
    }
    return null;
}

Piece.BLOCK = '+';
Piece.HOLE = 'O';
Piece.GREEN = 'G';
Piece.BLUE = 'B';

export default Piece;
