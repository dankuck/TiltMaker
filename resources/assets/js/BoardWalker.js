/**
 * ----------------------
 * BoardWalker
 * ----------------------
 * A BoardWalker holds all the Board states and categorizes them as one of
 * Active, Solutions, Failures, Circles, or Short-Circuited.
 *
 * The step() method moves one step forward on a single Board, branching as
 * needed.
 *
 * Call the step() method repeatedly until the `done` property is true.
 */
class BoardWalker {

    construct(board) {
        this.active = [];
        this.seen = {};
        this.done = false;

        // Unique solutions. Green pieces went in the hole.
        this.solutions = [];

        // Failures. The blue piece went in the hole.
        this.failures = [];

        // These paths doubled back on themselves.
        this.circles = [];

        // Paths that joined up with some other shorter path.
        // (Not including a winning step, failure step, or circles.)
        this.shortCircuited = [];

        this.categorizeBoard(board);
    }

    /**
     * This takes one of the active boards and shifts it in whichever
     * directions make sense for it. Then it evaluates each resulting board and
     * categorizes it, maybe putting it on the end of the active queue.
     *
     * @return void
     */
    step() {
        if (this.active.length == 0) {
            this.done = true;
            return;
        }
        const board = this.active.shift();
        this.seen[board.asString] = board;
        this.getDirections(board)
            .each(direction => {
                const step = board.getShiftedBoard(directions[i]);
                this.categorizeBoard(step);
            });
    }

    /**
     * Find the sensible directions for the given Board. At the outset, every
     * direction makes sense, but after that, only two directions make any
     * sense.
     *
     * @param  Board board
     * @return Array
     */
    getDirections(board) {
        if (! board.lastDirection) {
            // If you have no lastDirection, then this is the starting point
            // and every direction makes sense.
            return ['up', 'down', 'left', 'right'];
        } else if (
            board.lastDirection == 'up'
            || board.lastDirection == 'down'
        ) {
            // If you've just gone up, it stands to reason that in another
            // branch you went down. So we don't need to try down again.
            return ['left', 'right'];
        } else if (
            board.lastDirection == 'right'
            || board.lastDirection == 'left'
        ) {
            // Same as above, if you've just gone left, it stands to reason
            // that in another branch you went right. So we don't need to try
            // right again.
            return ['up', 'down'];
        } else {
            throw new Error(`Unknown direction: ${board.lastDirection}`);
        }
    }

    /**
     * This adds the board to one of the categories, maybe the active queue.
     *
     * @param  Board board
     * @return void
     */
    categorizeBoard(board) {
        if (board.isComplete) {
            this.solutions.push(board); // yay!
        } else if (board.isFail) {
            this.failures.push(board); // this fails
        } else if (board.isRedundant()) {
            this.circles.push(board); // we're just going in circles
        } else if (this.seenThisBefore(board)) {
            this.shortCircuited.push(board); // this is redundant with another, shorter path
        } else {
            this.active.push(board); // press on soldier
        }
    }

    /**
     * This tells us if we've already seen the board state before. If we have,
     * we know that it's pointless to pursue this path, especially since the
     * path we saw before was shorter.
     *
     * @param  Board board
     * @return Boolean
     */
    seenThisBefore(board) {
        return Boolean(this.seen[board.asString]);
    }
};

module.exports = BoardWalker;
