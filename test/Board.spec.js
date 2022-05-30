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
});
