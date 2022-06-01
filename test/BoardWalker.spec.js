import assert from 'assert';
import makeBoard from '@/test/fixtures/makeBoard.js';
import BoardWalker from '@/app/BoardWalker.js';
const {deepStrictEqual: equal} = assert;
const appr = (a, b, precision) => {
    assert(a > b - precision, `Failed test: ${a} > ${b} - precision`);
    assert(a < b + precision, `Failed test: ${a} < ${b} + precision`);
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
        equal(1.00, walker.probability);
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
        appr(0.5, walker.probability, .0001);
    });

    it('is already done', function () {
        const walker = new BoardWalker(makeBoard([
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'OG','_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_'],
        ]));
        while (! walker.done) {
            walker.step();
        }
        equal(1, walker.solutions.length);
        equal(0, walker.failures.length);
        equal(0, walker.circles.length);
        equal(0, walker.shortCircuited.length);
        equal(1.00, walker.probability);
    });

    it('has no solution', function () {
        const walker = new BoardWalker(makeBoard([
            ['_', '_', '_', '+', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', 'O', '_', '_'],
            ['_', '_', '_', '_', '_'],
            ['_', '_', '_', '+', 'G'],
        ]));
        while (! walker.done) {
            walker.step();
        }
        equal(0.00, walker.probability);
    });

    describe('published solutions', function () {
        it('Card 1', function () {
            const walker = new BoardWalker(makeBoard([
                ['G', '+', '_', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', 'O', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', '+', '_', '_'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'down,right,up,right,up,left,down',
                shortSolution.toPathString()
            );

            equal(1.00, walker.probability);
            // This really should give probability 1.00. A human can see that
            // every path leads eventually to success. So where is our
            // probability leaking out?
        });
    });
});

function show(board, path) {
    console.log(board.lastDirection || 'ROOT');
    console.log('Probability:', board.getProbability());
    console.log('Bits:', getBits(board));
    console.log(board + '');

    path.forEach(direction => {
        board = [...board.probabilities.keys()]
            .reduce(
                (found, next) => found || (next.lastDirection == direction && next),
                null
            );

        console.log(board.lastDirection || 'ROOT');
        console.log('Probability:', board.getProbability());
        console.log('Bits:', getBits(board));
        console.log(board + '');
    });

    [...board.probabilities.keys()].forEach(child => {
        console.log('= = = = = = = = = = =');
        console.log(child.lastDirection || 'ROOT');
        console.log('Probability:', child.getProbability());
        console.log('Bits:', getBits(child));
    });
}

function getBits(board)
{
    return Object.keys(board)
        .filter(key => board[key] === true);
}
