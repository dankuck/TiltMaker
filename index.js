
    var mode = "RANDOM";
    var board;
    var walker;

    function makeBoardAndWalker() {
      if (mode == 'RANDOM') {
        board = generateRandomBoard();
      } else if (mode == 'EASY TEST') {
        board = new Board([
          new Piece(GREEN, 0, 0),
          new Piece(BLOCK, 3, 0),
          new Piece(HOLE, 2, 2)
        ]);
      } else if (mode == 'REDUNDANCY TEST') {
        board = new Board([
          new Piece(GREEN, 1, 2),
          new Piece(HOLE, 2, 2),
          new Piece(BLOCK, 2, 3),
          new Piece(BLOCK, 4, 3)
        ]);
      } else if (mode == 'TRAP') {
        board = new Board([
          new Piece(GREEN, 0, 0),
          new Piece(HOLE, 2, 2),
          new Piece(BLOCK, 0, 1),
          new Piece(BLOCK, 4, 1)
        ]);
      } else if (mode == 'EMPTY') {
        board = new Board([
        ]);
      }

      $('.js-board').html(board.toString());
      $('.js-done').addClass('invisible');

      walker = new BoardWalker(board);
    }

    function show () {
      if (walker.active.length == 0) {
        $('.js-done').removeClass('invisible');
      }
      
      $('.js-solution-count').html(walker.solutions.length);
      var solutions = "";
      for (var i = 0; i < walker.solutions.length; i++) {
        solutions += walker.solutions[i].toPathString() + "\n\n";
      }
      $('.js-solutions').html(solutions || "None");

      
      $('.js-active-count').html(walker.active.length);
      var actives = "";
      for (var i = 0; i < walker.active.length; i++) {
        actives += walker.active[i].toPathString() + "\n\n";
      }
      $('.js-active').html(actives || "None");

      
      $('.js-failure-count').html(walker.failures.length);
      var failures = "";
      for (var i = 0; i < walker.failures.length; i++) {
        failures += walker.failures[i].toPathString() + "\n\n";
      }
      $('.js-failures').html(failures || "None");
      

      $('.js-circle-count').html(walker.circles.length);
      var circles = "";
      for (var i = 0; i < walker.circles.length; i++) {
        circles += walker.circles[i].toPathString() + "\n\n";
      }
      $('.js-circles').html(circles || "None");
      

      $('.js-short-count').html(walker.shortCircuited.length);
      var shorts = "";
      for (var i = 0; i < walker.shortCircuited.length; i++) {
        shorts += walker.shortCircuited[i].toPathString() + "\n\n";
      }
      $('.js-shorts').html(shorts || "None");
    }

    function doStep() {
      walker.step();
      show();
    }

    $('.js-step').on('click', doStep);

    var running = null;
    $('.js-run').on('click', function () {
      if (running) {
        clearInterval(running);
        running = null;
        return;
      }
      running = setInterval(function () {
        if (walker.done) {
          clearInterval(running);
          running = null;
          return;
        }
        doStep();
      }, 100);
    });

    $('.js-reset').on('click', function () {
      makeBoardAndWalker();
      show();      
    });

    makeBoardAndWalker();
    show();

