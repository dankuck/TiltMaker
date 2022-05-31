import assert from 'assert';
import makeBoard from '@/test/fixtures/makeBoard.js';
const {deepStrictEqual: equal} = assert;

describe('Board.js', function () {
    it('looks right', function () {
        const board = makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'O', '_', '_'],
            ['_', '_', 'G', '_', '_'],
            ['_', '_', '_', '_', '_'],
        ]);
        equal(
              "_ _ _ _ _\n"
            + "_ _ _ _ _\n"
            + "_ _ O _ _\n"
            + "_ _ G _ _\n"
            + "_ _ _ _ _",
            board.asString
        );
    });

    it('shifts right', function () {
        const board = makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'B', '_', '+'],
            ['_', '_', 'O', '_', '_'],
            ['_', '_', 'G', '_', '_'],
            ['_', '_', '_', '_', '_'],
        ])
            .getShiftedBoard('right');
        equal(
              "_ _ _ _ _\n"
            + "_ _ _ B +\n"
            + "_ _ O _ _\n"
            + "_ _ _ _ G\n"
            + "_ _ _ _ _",
            board.asString
        );
    });

    it('has a weird hole', function () {
        const board = makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', 'O', '_'],
            ['_', '_', 'G', '_', '_'],
            ['_', '_', '_', '_', '_'],
        ]);
        equal(
              "_ _ _ _ _\n"
            + "_ _ _ _ _\n"
            + "_ _ _ O _\n"
            + "_ _ G _ _\n"
            + "_ _ _ _ _",
            board.asString
        );
    });

    it('has two holes', function () {
        const board = makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', 'O', '_', 'O', '_'],
            ['_', '_', 'G', '_', '_'],
            ['_', '_', '_', '_', '_'],
        ]);
        equal(
              "_ _ _ _ _\n"
            + "_ _ _ _ _\n"
            + "_ O _ O _\n"
            + "_ _ G _ _\n"
            + "_ _ _ _ _",
            board.asString
        );
    });

    it('has no holes', function () {
        const board = makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'G', '_', '_'],
            ['_', '_', '_', '_', '_'],
        ]);
        equal(
              "_ _ _ _ _\n"
            + "_ _ _ _ _\n"
            + "_ _ _ _ _\n"
            + "_ _ G _ _\n"
            + "_ _ _ _ _",
            board.asString
        );
    });

    it('oops all holes', function () {
        const board = makeBoard([
            ['O', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O'],
        ]);
        equal(
              "O O O O O\n"
            + "O O O O O\n"
            + "O O O O O\n"
            + "O O O O O\n"
            + "O O O O O",
            board.asString
        );
    });

    it('finds the hole even if it is not first', function () {
        const board = makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'GO','_', '_'],
            ['_', '_', 'G', '_', '_'],
            ['_', '_', '_', '_', '_'],
        ])
            .getShiftedBoard('up');
        equal(
              "_ _ _ _ _\n"
            + "_ _ _ _ _\n"
            + "_ _ G _ _\n"
            + "_ _ _ _ _\n"
            + "_ _ _ _ _",
            board.asString
        );
    });
});
