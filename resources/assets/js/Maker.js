
function randomInt(lower_inc, upper_exc) {
    return Math.floor(Math.random() * (upper_exc - lower_inc) + lower_inc);
};

import Board from './Board.js';
import Piece from './Piece.js';

function generateRandomBoard() {
    function make(symbol) {
        var piece;
        do {
            piece = new Piece(symbol, randomInt(0, 5), randomInt(0, 5));
        } while (Piece.hasConflict(pieces, piece));
        pieces.push(piece);
    }
    var green_count = randomInt(1, 3);
    var blue_count = randomInt(0, 5);
    var grey_count = randomInt(1, 7);
    var pieces = [];
    pieces.push(new Piece(Piece.HOLE, 2, 2));
    for (var i = 0; i < green_count; i++) {
        make(Piece.GREEN);
    }
    for (var i = 0; i < blue_count; i++) {
        make(Piece.BLUE);
    }
    for (var i = 0; i < grey_count; i++) {
        make(Piece.BLOCK);
    }
    return new Board(pieces);
}

module.exports = {
    generateRandomBoard
};
