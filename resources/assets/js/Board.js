import Piece from './Piece.js';

const up = function (a, b) {
    if (a.y < b.y) {
        return -1;
    } else if (a.y > b.y) {
        return 1;
    } else {
        return 0;
    }
};
const down = (a, b) => -1 * up(a, b);
const left = function (a, b) {
    if (a.x < b.x) {
        return -1;
    } else if (a.x > b.x) {
        return 1;
    } else {
        return 0;
    }
};
const right = (a, b) => -1 * left(a, b);
const sorts = {up, down, left, right};

const empty = [
    ['_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_'],
];

/**
 * ----------------------
 * Board
 * ----------------------
 * A Board is an immutable representation of a game board in a specific state.
 * A Board contains pieces, and it has references to the previous Board and
 * the direction it took to get to this state.
 *
 * Boards can be compared using equals().
 *
 * Boards can be tilted using getShiftedBoard(), which yields a new Board
 * instance in a [hopefully] different state.
 */
class Board {
    construct(pieces, lastDirection, lastBoard) {
        this.pieces = pieces;
        this.lastDirection = lastDirection;
        this.lastBoard = lastBoard;
        this.asString = this.toString();
    }

    /**
     * Convert this Board into a unique string.
     *
     * Any two boards that represent the same state will get the same results
     * from toString(). Each Board also has a property `asString` which is
     * faster and gives the same value.
     * @return string
     */
    toString() {
        return this.arrayToString(
            this.toGrid()
        );
    }

    /**
     * This supports toString() by turning the Board data into a 5x5 array of
     * strings representing pieces, empty spaces, or the hole.
     *
     * @return Array
     */
    toGrid() {
        const array = [...empty];
        this.pieces.each(
            ({x, y, symbol}) => array[y][x] = symbol
        );
        return array;
    }

    /**
     * Turn the given array of arrays into a string
     *
     * @param  Array
     * @return String
     */
    arrayToString(array) {
        return array
            .map(subarray => subarray.join(" "))
            .join("\n");
    }

    /**
     * Get a shallow copy of the array of pieces in this Board
     *
     * @return Array
     */
    getPiecesCopy() {
        return this.pieces.slice();
    }

    /**
     * Get a shallow copy of the array of pieces in this Board, sorted so that
     * the first Piece objects are the ones that should be evaluated first
     * when considering where they would shift.
     *
     * E.g., when `direction` is "left", the first pieces in the resulting
     * array will be the ones that are left-most, because they should move
     * (and settle) first during a shift.
     *
     * This does not move any pieces.
     *
     * @param  String direction up|down|left|right
     * @return Array
     */
    getSortedPiecesCopy(direction) {
        const sort = ({up, down, left, right})[direction];
        if (!sort) {
            throw new Error(`Unknown direction: ${direction}`);
        }
        return this.getPiecesCopy().sort(sort);
    }

    /**
     * Get a new instance of Board representing where the pieces would settle
     * if this Board was shifted in the direction indicated.
     *
     * @param  String direction up|down|left|right
     * @return Array
     */
    getShiftedBoard(direction) {
        const pieces = this.getSortedPiecesCopy(direction);
        // pieces starts as an array of Piece objects in original position.
        // One by one we replace a Piece with a new Piece in the location it
        // would be in if it shifted in the direction given.
        // That's why we started with the *sorted* pieces array. That ensures
        // that the first Piece that could shift is the first Piece that does
        // shift.
        pieces.each(
            (piece, i) => pieces[i] = piece.getShiftedPiece(pieces, direction)
        );
        return new Board(pieces, direction, this);
    }

    /**
     * Is the Board in a win position? All greens are in the hole? None of the
     * blues are?
     * @return Boolean
     */
    isComplete() {
        if (this.isFail()) {
            return false;
        }
        return ! this.pieces
            .some(({symbol, inTheHole}) => symbol == Piece.GREEN && !inTheHole)
    }

    /**
     * Is the Board in a fail position? One of the blues is in the hole?
     * @return Boolean
     */
    isFail() {
        return this.pieces
            .some(({symbol, inTheHole}) => symbol == Piece.BLUE && inTheHole);
    }

    /**
     * Is this Board identical to a Board in its ancestry?
     * @return Boolean
     */
    isRedundant() {
        let board = this;
        while (board = board.lastBoard) {
            if (board.equals(this)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Are these two boards in the same state?
     * @param  Board other
     * @return Boolean
     */
    equals(other) {
        return this.asString == other.asString;
    }

    /**
     * This yields a human-readable string representation of the board and its
     * ancestors. The whole path from beginning to here.
     *
     * This is not used in the app, but it's useful for debugging.
     *
     * @return String
     */
    toPathString() {
        return this.arrayToString(
            this.toPathArray()
        );
    }

    /**
     * This supports toPathString() by gathering all the ancestral data and
     * formatting it in a way that is easy to compile to a string.
     *
     * @return Array
     */
    toPathArray() {
        let array = this.toGrid();
        if (! this.lastDirection) {
          return array;
        }
        let direction = ' ' + this.lastDirection + ' ';
        for (let i = 0; i < array.length; i++) {
            array[i].splice(0, 0, direction);
        }
        let prev = this.lastBoard.toPathArray();
        for (let i = 0; i < array.length; i++) {
            array[i] = prev[i].concat(array[i]);
        }
        return array;
    }
}

module.exports = Board;
