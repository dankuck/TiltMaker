import Piece from './Piece.js';
const { BLUE, GREEN, HOLE, BLOCK } = Piece;

/**
 * These sort functions are used to sort a pieces array so the x-most pieces
 * are first.
 */
const up = (a, b) => {
    if (a.y < b.y) {
        return -1;
    } else if (a.y > b.y) {
        return 1;
    } else {
        return 0;
    }
};
const down = (a, b) => -1 * up(a, b);
const left = (a, b) => {
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

/**
 * This sort function is used to ensure immobile objects are first, which
 * helps with efficiency and ensures The Hole is always recognized in
 * Piece.hasConflict().
 */
const immobileFirst = (a, b) => {
    if ((a.symbol == HOLE || a.symbol == BLOCK)
        && ! (b.symbol == HOLE || b.symbol == BLOCK))
    {
        return -1;
    } else if (! (a.symbol == HOLE || a.symbol == BLOCK)
        && (b.symbol == HOLE || b.symbol == BLOCK))
    {
        return 1;
    } else {
        return 0;
    }
};

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

    constructor(
        pieces,
        lastDirection = null,
        lastBoard = null,
        shortestPaths = {}
    ) {
        this.callbacks = [];
        this.probabilities = new Map();

        // The array of pieces in this board. Immutable.
        this.pieces        = pieces;

        // The tilt direction which led to this state. Immutable.
        this.lastDirection = lastDirection;

        // The Board that preceded this Board. Immutable.
        this.lastBoard     = lastBoard;

        // This object maps Board strings to the first instance of an
        // equivalent Board. This is shared by all Boards in the tree. Assuming
        // a breadth first search pattern is followed, this will contain the
        // shortest path to any state.
        this.shortestPaths = shortestPaths;

        // Generate the string. It's based on immutable things, so it's safe to
        // store in a property.
        this.asString = this.toString();

        // Find out if this Board is just a longer-path version of some other
        // Board. If it's not, register it as the shortest-path version.
        // If it is a long-path version, check if it's redundant with one of
        // its ancestors. That's interesting information.
        const shorterVersion = this.shortestPaths[this.asString];
        if (shorterVersion) {
            this.isShortest  = false;
            const redundancy = this.isRedundant();
            this.isCircle    = Boolean(redundancy);
            this.noMove      = redundancy === this.lastBoard;
            if (! this.isCircle) {
                // By adding the shorter version of this state to our children
                // list (and assuming it remains the only child) we can just
                // copy its probability to our own and we don't have to make
                // any extra concessions to ensure our parent receives the
                // probability updates
                shorterVersion.onChange(board => this.updateProbabilities(board));
                this.updateProbabilities(shorterVersion);
            } // if it was a circle we don't want to wind up in an event loop
        } else {
            this.isShortest = true;
            this.isCircle   = false;
            this.noMove     = false;
            this.shortestPaths[this.asString] = this;
        }

        // Any blues in The Hole?
        this.isFail = this.pieces
            .some(({symbol, inTheHole}) => symbol == BLUE && inTheHole);

        // No blues and all greens in The Hole?
        this.isComplete = ! this.isFail
            && ! this.pieces
                .some(
                    ({symbol, inTheHole}) => symbol == GREEN && !inTheHole
                );
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
        const array = [
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
        ];
        this.pieces.forEach(
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
    getSortedPieces(direction) {
        const sort = sorts[direction];
        if (! sort) {
            throw new Error(`Unknown direction: ${direction}`);
        }
        return this.pieces.slice()
            .sort((a, b) => immobileFirst(a, b) || sort(a, b));
    }

    /**
     * Get a new instance of Board representing where the pieces would settle
     * if this Board was shifted in the direction indicated.
     *
     * @param  String direction up|down|left|right
     * @return Array
     */
    getShiftedBoard(direction) {
        const pieces = this.getSortedPieces(direction);
        // pieces starts as an array of Piece objects in original position.
        // One by one we replace a Piece with a new Piece in the location it
        // would be in if it shifted in the direction given.
        // That's why we started with the *sorted* pieces array. That ensures
        // that the first Piece that could shift is the first Piece that does
        // shift.
        pieces.forEach(
            (piece, i) => pieces[i] = piece.getShiftedPiece(pieces, direction)
        );
        const board = new Board(pieces, direction, this, this.shortestPaths);
        if (!board.isCircle) {
            board.onChange(board => this.updateProbabilities(board));
            this.updateProbabilities(board);
        }
        return board;
    }

    /**
     * This registers a callback to fire whenever the mutable parts of this
     * object are mutated. Namely when the probability undergoes update, the
     * callback will be called with one parameter: this object.
     *
     * This method is careful to avoid event loops.
     *
     * @param  Function cb
     * @return undefined
     */
    onChange(cb) {
        // The callback most not be re-entrant. If it winds up right back here
        // we'll detect it with `hot` and avoid an infinite loop.
        let hot = false;
        this.callbacks.push(() => {
            if (!hot) {
                hot = true;
                cb(this);
                hot = false;
            }
        });
    }

    /**
     * This calls all the registered callbacks. Used internally when something
     * changes on this object.
     *
     * @return undefined
     */
    fireChange() {
        this.callbacks.forEach(cb => cb());
    }

    /**
     * This adds the child to the probabilities map with its probability. Then
     * it fires the onChange callbacks so interested parties can do the same
     * thing.
     *
     * @param  Board child
     * @return undefined
     */
    updateProbabilities(child) {
        this.probabilities.set(child, child.getProbability());
        this.fireChange();
    }

    /**
     * Determine this Board's probability of reaching the goal based on
     * the child Boards it has generated.
     *
     * If this Board has already reached the goal => 1.00.
     * If this Board has no children => 0.00
     * If this Board has children => average(children.getProbabilities())
     *
     * @return double
     */
    getProbability() {
        if (this.isComplete) {
            return 1.00;
        } else if (this.probabilities.size == 0) {
            return 0.00;
        } else {
            return [...this.probabilities.values()]
                .reduce((sum, plus) => sum + plus, 0)
                / this.probabilities.size;
        }
    }

    /**
     * Is this Board identical to a Board in its ancestry?
     * @return Boolean
     */
    isRedundant() {
        let board = this;
        while (board = board.lastBoard) {
            if (board.equals(this)) {
                return board;
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

    toPathString() {
        const directions = [];
        for (let board = this; board && board.lastDirection; board = board.lastBoard) {
            directions.push(board.lastDirection);
        }
        return directions.reverse().join(',');
    }
}

export default Board;
