import assert from 'assert';
import makeBoard from '@/test/fixtures/makeBoard.js';
import BoardWalker from '@/app/BoardWalker.js';
const {deepStrictEqual: equal} = assert;
const appr = (a, b, precision) => {
    assert(a > b - precision, `${a} < ${b} - precision`);
    assert(a < b + precision, `${a} > ${b} + precision`);
};

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

    it('has an easy probability', function () {
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

    it('has a 50/50 probability', function () {
        // ~50% chance of landing in the trap on the right.
        const walker = new BoardWalker(makeBoard([
            ['_', '_', '_', '+', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'O', '_', '_'],
            ['_', '+', 'G', '_', '_'],
            ['_', '_', '+', '+', '_'],
        ]));
        while (! walker.done) {
            walker.step();
        }
        appr(.5, walker.probability, .00000001);
    });
});
