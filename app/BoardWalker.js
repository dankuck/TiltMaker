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

    constructor(board) {
        this.active = [];

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

        // Keep the board's probability in a property for ease-of-use
        this.probability = board.getProbability();
        board.onChange(() => this.probability = board.getProbability());

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

        this.getDirections(board)
            .forEach(direction => {
                const step = board.getShiftedBoard(direction);
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
        // To find proper probabilities I *think* we need to try every
        // direction. The back-tracks will show up as either circles or
        // long-way paths and so they will not do anything infinitely. But they
        // do contribute to greater information about the probabilities from a
        // given Board.
        return ['up', 'down', 'left', 'right'];

        // if (! board.lastDirection) {
        //     // If you have no lastDirection, then this is the starting point
        //     // and every direction makes sense.
        //     return ['up', 'down', 'left', 'right'];
        // } else if (
        //     board.lastDirection == 'up'
        //     || board.lastDirection == 'down'
        // ) {
        //     // If you've just gone up, it stands to reason that in another
        //     // branch you went down. So we don't need to try down again.
        //     return ['left', 'right'];
        // } else if (
        //     board.lastDirection == 'right'
        //     || board.lastDirection == 'left'
        // ) {
        //     // Same as above, if you've just gone left, it stands to reason
        //     // that in another branch you went right. So we don't need to try
        //     // right again.
        //     return ['up', 'down'];
        // } else {
        //     throw new Error(`Unknown direction: ${board.lastDirection}`);
        // }
    }

    /**
     * This adds the board to one of the categories, maybe the active queue.
     *
     * @param  Board board
     * @return void
     */
    categorizeBoard(board) {
        if (board.isComplete) {
            this.solutions.push(board);      // A win!
        } else if (board.isFail) {
            this.failures.push(board);       // A loss.
        } else if (board.isCircle) {
            this.circles.push(board);        // A trap?
        } else if (!board.isShortest) {
            this.shortCircuited.push(board); // A nice long walk.
        } else {
            this.active.push(board);    // An opportunity for more adventure!
        }
    }
}

export default BoardWalker;
