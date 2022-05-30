import assert from 'assert';
import makeBoard from '@/test/fixtures/makeBoard.js';
import BoardWalker from '@/app/BoardWalker.js';
const {deepStrictEqual: equal} = assert;

describe('BoardWalker.js', function () {
    it('runs to solution', function () {
        const walker = new BoardWalker(makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'O', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '+', 'G', '+', '_'],
        ]));
        while (! walker.done) {
            walker.step();
        }
        equal(1, walker.solutions.length);
        equal(0, walker.failures.length);
        equal(3, walker.circles.length);
        equal(0, walker.shortCircuited.length);
    });

    it('adds an easy probability', function () {
        const walker = new BoardWalker(makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'O', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '+', 'G', '+', '_'],
        ]));
        while (! walker.done) {
            walker.step();
        }
        equal(1, walker.probability);
    });
});
