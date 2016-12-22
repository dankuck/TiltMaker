
function BoardWalker(board) {
  this.active = [];
  this.seen = [];
  this.done = false;

  // Unique solutions. Solutions that do not "get there" the same way as 
  // any other solution.
  this.solutions = [];

  // Failures. The blue piece went in the hole.
  this.failures = [];

  // Paths that doubled back on themselves.
  this.circles = [];

  // Paths that ended up in the same place as some other shorter path.
  // (Not including a winning step, those are unique solutions. And not 
  // including circles.)
  this.shortCircuited = [];

  this.processNewStep(board);
}
BoardWalker.prototype = {
  step: function () {
    if (this.active.length == 0) {
      this.done = true;
      return;
    }
    var board = this.active.shift();
    this.seen.push(board);
    var directions;
    if (!board.lastDirection) {
      directions = ['up', 'down', 'left', 'right'];
    } else if (board.lastDirection == 'up' || board.lastDirection == 'down') {
      directions = ['left', 'right'];
    } else if (board.lastDirection == 'right' || board.lastDirection == 'left') {
      directions = ['up', 'down'];
    } else {
      throw new Error("Unknown direction: " + board.lastDirection);
    }
    for (var i = 0; i < directions.length; i++) {
      var step = board.getShiftedBoard(directions[i]);
      this.processNewStep(step);
    }
  },
  processNewStep: function (step) {
    if (step.isComplete()) {
      this.solutions.push(step); // yay!
    } else if (step.isFail()) {
      this.failures.push(step); // this fails
    } else if (step.isRedundant()) {
      this.circles.push(step); // we're just going in circles
    } else if (this.seenThisBefore(step)) {
      this.shortCircuited.push(step); // this is redundant with another, shorter path
    } else {
      this.active.push(step); // press on soldier
    }
  },
  seenThisBefore: function (board) {
    for (var i = 0; i < this.seen.length; i++) {
      if (this.seen[i].equals(board)) {
        return true;
      }
    }
    return false;
  }
};

module.exports = BoardWalker;
