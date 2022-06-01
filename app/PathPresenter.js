/**
 * ----------------------
 * PathPresenter
 * ----------------------
 * Display a path of Boards as a string in case that's helpful.
 */

export default class PathPresenter
{
    constructor(board) {
        this.board = board;
    }

    /**
     * This yields a human-readable string representation of the board and its
     * ancestors. The whole path from beginning to here.
     *
     * This is not used in the app, but it's useful for debugging.
     *
     * @return String
     */
    toString() {
        return this.board.arrayToString(
            this.toArray()
        );
    }

    /**
     * This supports toPathString() by gathering all the ancestral data and
     * formatting it in a way that is easy to compile to a string.
     *
     * @return Array
     */
    toArray() {
        let array = this.board.toGrid();
        if (! this.board.lastDirection) {
          return array;
        }
        let direction = ' ' + this.board.lastDirection + ' ';
        for (let i = 0; i < array.length; i++) {
            array[i].splice(0, 0, direction);
        }
        let prev = this.board.lastBoard.toArray();
        for (let i = 0; i < array.length; i++) {
            array[i] = prev[i].concat(array[i]);
        }
        return array;
    }
};
