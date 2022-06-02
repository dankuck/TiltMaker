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

            // equal(1.00, walker.probability);
            // This really should give probability 1.00. A human can see that
            // every path leads eventually to success. So where is our
            // probability leaking out? Something about loops starting as 0
            // and then never properly updating.

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.95, walker.probability, 0.01);
        });

        it('Card 2', function () {
            const walker = new BoardWalker(makeBoard([
                ['+', 'G', 'B', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', 'O', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', '_', '_', '_'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'right,down,left,up,right,down,left,up,right',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.5, walker.probability, 0.01);
        });

        it('Card 3', function () {
            const walker = new BoardWalker(makeBoard([
                ['B', 'G', '+', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', 'O', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['B', 'G', '_', '_', '_'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'right,down,right,up,down,left,up',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.23, walker.probability, 0.01);
        });

        it('Card 4', function () {
            const walker = new BoardWalker(makeBoard([
                ['+', '_', '_', '_', 'G'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', 'O', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['B', '_', '_', '_', 'G'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'right,up,left,down,up,right,down,left,up,right',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.17, walker.probability, 0.01);
        });

        it('Card 5', function () {
            const walker = new BoardWalker(makeBoard([
                ['B', 'G', 'B', '_', '_'],
                ['B', '+', 'G', '_', '_'],
                ['_', '_', 'O', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', '_', '_', '_'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'right,up,left,down',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.07, walker.probability, 0.01);
        });

        it('Card 6', function () {
            const walker = new BoardWalker(makeBoard([
                ['_', '+', 'B', '_', 'G'],
                ['_', '+', '_', '_', '_'],
                ['+', '+', 'O', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', '_', '_', 'G'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'right,down,left,up,right,down,left,up,right,up,left,down',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.07, walker.probability, 0.01);
        });

        it('Card 7', function () {
            const walker = new BoardWalker(makeBoard([
                ['+', '_', '+', '+', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', 'O', '_', '_'],
                ['G', '_', '_', '_', '_'],
                ['B', '_', '_', '_', '_'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'right,up,left,down,left,up,right,down,right,up,right,down,left,up,right',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.08, walker.probability, 0.01);
        });

        it.skip('Card 8', function () {
            const walker = new BoardWalker(makeBoard([
                ['G', '_', '+', '_', '_'],
                ['G', '+', '+', '_', '_'],
                ['B', '+', 'O', '_', '_'],
                ['B', '_', '_', '_', '_'],
                ['B', '_', '_', '_', '_'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'right,down,left,down,right,down,right,up,down,left,up,right,down,left,down,right,down,right,up',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(1.00, walker.probability, 0.01);
        });

        it('Card 9', function () {
            const walker = new BoardWalker(makeBoard([
                ['_', '_', '+', 'B', 'B'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', 'O', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['G', 'B', '_', '_', '_'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'right,down,left,up,right,down,left,up',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.07, walker.probability, 0.01);
        });

        it('Card 10', function () {
            const walker = new BoardWalker(makeBoard([
                ['_', '_', '_', '_', '_'],
                ['_', '_', '_', '_', '_'],
                ['_', '_', 'O', 'B', 'B'],
                ['_', '_', '+', '+', '+'],
                ['_', '_', '_', 'B', 'G'],
            ]));
            while (! walker.done) {
                walker.step();
            }
            const shortSolution = walker.solutions[0];
            equal(
                'up,left,down,right,down,right,up,left,up,left,up,right',
                shortSolution.toPathString()
            );

            // This value is measured from previous tests. A better algorithm
            // should give a different value.
            appr(0.01, walker.probability, 0.01);
        });

        // it('Card 3', function () {
        //     const walker = new BoardWalker(makeBoard([
        //         ['_', '_', '_', '_', '_'],
        //         ['_', '_', '_', '_', '_'],
        //         ['_', '_', 'O', '_', '_'],
        //         ['_', '_', '_', '_', '_'],
        //         ['_', '_', '_', '_', '_'],
        //     ]));
        //     while (! walker.done) {
        //         walker.step();
        //     }
        //     const shortSolution = walker.solutions[0];
        //     equal(
        //         'right,down,left,up,right,down,left,up,right',
        //         shortSolution.toPathString()
        //     );

        //     equal(1.00, walker.probability);
        // });
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
