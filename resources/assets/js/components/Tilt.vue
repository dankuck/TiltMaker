<template>
    <div class="tilt-maker">
        <board v-if="startBoard !== null"
            :board="startBoard"
            >
        </board>

        <div class="controls">
          <button @click="reset">Reset</button>
          <span v-if="done" class="badge">Done</span>
          <template v-else>
              <button v-if="running" @click="stop">Stop</button>
              <button v-else @click="run">Run</button>
              <button @click="step">Step</button>
          </template>
        </div>

        <template v-if="!justStarted">
            <div class="tabs">
                <div v-for="tab in tabs" class="tab" :class="tabClass(tab)" @click="showTab(tab)">{{ tab }} <span class="badge">{{ tabCount(tab) }}</span></div>
            </div>

            <div v-if="currentTab === 'Solutions'">
                <p>
                These solutions are found by attempting every valid move. If there is more than one solution, each one has a different last move. The first solution is the shortest.
                </p>

                <paths :paths="walker.solutions" :none-message="solutionsNoneMessage"></paths>
            </div>

            <div v-if="currentTab === 'Active'">
                <p>
                  These paths are currently in play. Every time two separate
                  moves can be made, the path is split into two rows and both
                  moves are played.
                </p>

                <paths :paths="walker.active" none-message="All done!"></paths>
            </div>

            <div v-if="currentTab === 'Failures'">
                <p>
                  These paths have failed because a blue token went in
                  the goal.
                </p>

                <paths :paths="walker.failures"></paths>
            </div>

            <div v-if="currentTab === 'Circles'">
                <p>
                  These paths started repeating. Often because a move resulted
                  in no changes. E.g., tilting right when everything that could
                  move was already on the right. That makes them boring, usually.
                </p>

                <p>
                  They can be interesting when they represent a trap. I haven't
                  yet determined how to detect a trap for display, so they end
                  up here.
                </p>

                <paths :paths="walker.circles"></paths>
            </div>

            <div v-if="currentTab === 'Long Ways'">
                <p>
                  These paths took the long way to get to the same place that
                  other paths reached faster. It would waste our time to continue
                  them.
                </p>

                <paths :paths="walker.shortCircuited"></paths>
            </div>
        </div>
    </div>
</template>

<script>
import Maker from '../Maker.js';
import BoardWalker from '../BoardWalker.js';
export default {
    data() {
        var board = Maker.generateRandomBoard();
        return {
            justStarted: true,
            startBoard: board,
            walker: new BoardWalker(board),
            running: null,
            currentTab: 'Solutions',
            tabMap: {
            	'Solutions': 'solutions',
            	'Active': 'active',
            	'Failures': 'failures',
            	'Circles': 'circles',
            	'Long Ways': 'shortCircuited',
            },
        };
    },
    computed: {
        done() {
            return this.walker.active.length === 0;
        },
        tabs() {
        	return Object.keys(this.tabMap);
        },
        solutionsNoneMessage() {
            if (this.done) {
                return 'No solutions exist.';
            }
            if (!this.running) {
                return 'Click Run to solve this board.';
            }
            return 'Searching for solutions...';
        }
    },
    methods: {
        reset() {
            if (this.running) {
                this.stop();
            }
            this.startBoard = Maker.generateRandomBoard();
            this.walker = new BoardWalker(this.startBoard);
        },
        step() {
            this.justStarted = false;
            this.walker.step();
        },
        run() {
            this.running = setInterval(() => {
                this.step();
            }, 100);
        },
        stop() {
            clearInterval(this.running);
            this.running = null;
        },
        showTab(tab) {
            this.currentTab = tab;
        },
        tabClass(tab) {
            if (tab === this.currentTab) {
                return "active";
            }
            return "";
        },
        tabCount(tab) {
        	return this.walker[this.tabMap[tab]].length;
        }
    }
}
</script>

<style>

.tilt-maker p {
  width: 500px;
}

.tilt-maker .board {
  font-size: 150%;
}

.tilt-maker .controls {
  padding: 1em;
}

.tilt-maker pre {
  overflow: scroll;
  max-height: 80%;
  padding: 1em;
  border: 1px solid #CCC;
}

.tilt-maker .tabs {
    background-color: #CCC;
    color: black;
    margin-bottom: 1em;
}

.tilt-maker .tab {
    display: table-cell;
    padding: 1em;
    cursor: pointer;
}
    .tilt-maker .tab:hover {
        background-color: #AAA;
        color: #EEE;
    }

    .tilt-maker .tab.active {
        background-color: #888;
        color: #EEE;
    }

.tilt-maker .badge {
    background-color: #777;
    border-radius: 50%;
    padding: 0 .25em;
    color: white;
    font-size: 12px;
}
</style>
