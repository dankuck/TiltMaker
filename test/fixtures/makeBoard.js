import Board from '@/app/Board.js';
import Piece from '@/app/Piece.js';
const {
    BLOCK,
    HOLE,
    GREEN,
    BLUE,
} = Piece;
const codes = {
    '+': BLOCK,
    'O': HOLE,
    'G': GREEN,
    'B': BLUE,
};

export default function makeBoard(definition) {
    if (
        definition.length != 5
        || definition.some(line => line.length != 5)
    ) {
        throw new Error('Board definition should be a 5x5 array');
    }

    const pieces = [];
    definition.forEach((line, y) => {
        line.forEach((str, x) => {
            [...str].forEach(code => {
                if (code == '_') {
                    // empty space
                } else if (codes[code]) {
                    pieces.push(new Piece(codes[code], x, y));
                } else {
                    throw new Error(`Encountered unknown symbol at ${x}, ${y}: ${code}`);
                }
            });
        });
    });
    return new Board(pieces);
}
