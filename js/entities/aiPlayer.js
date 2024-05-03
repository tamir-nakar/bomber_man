class AiPlayer extends Player {
  // private members--!

  #targetTile;
  #isXsettled;
  #isYsettled;
  #isStuck;
  #stuckCounter;
  #lastCoords;
  #state;
  #states;
  #safeSpotDir;

  constructor(scene, x, y, start_angle, id, color) {
    super(scene, x, y, {}, start_angle, id, color);
    this.#targetTile = null;
    this.#isStuck = false;
    this.#states = {
      GET_TARGET: 1,
      ESCAPE: 2,
      WAIT: 3,
    };
    this.#state = this.#states.GET_TARGET;
    this.#stuckCounter = 0;
    this.#lastCoords = null;
    console.warn('GET TARGET');
  }
  create() {}
  update() {
    if (this) {
      this.#move();
    }

    //debug;
    var pointer = this.scene.input.activePointer;
    console.log(`pointer:::: ${pointer.x},${pointer.y}`);
  }

  // private Methods -- !

  #move = () => {
    if (this.body) {
      this.body.setVelocityX(0);
      this.body.setVelocityY(0);
      if(this.#state === this.#states.WAIT) this.anims.setCurrentFrame(this.anims.currentAnim.frames[0]);
      else this.anims.play(`player${this.id}_walk`, true)
      //this.#plantBomb();

      if (!this.#isStuck) {
        if (this.#state !== this.#states.WAIT) {
          this.#checkIsStuck(this.x, this.y);
        } else {
          this.#stuckCounter = 0;
        }
      } else {
        // stuck. options:
        // 1. make 1 random step
        // 2. get new target
        console.error('STUCK!');

        this.#targetTile = this.#getRandomAdjacentClearSpot();
        this.#state = this.#states.GET_TARGET;
        console.warn('GET_TARGET');
        this.#isStuck = false;
        this.#stuckCounter = 0;
      }



      switch (this.#state) {
        case this.#states.GET_TARGET:
          this.#commitGetTargetState(); // Find tile to blow -> plant bomb -> ESCAPE
          break;
        case this.#states.ESCAPE: // Find safe spot -> WAIT
          this.#commitEscapeState();
          break;
        case this.#states.WAIT: // Wait till bombs explode -> GET_TARGET
          this.#commitWaitState();
          break;
      }
    }
    //console.log(`lastttt:  ${this.x}, ${this.y}`);
    this.#lastCoords = [this.x, this.y];
  };

  #coordsToTile = (x, y) => {
    return this.scene.map.getTileAt(
      this.scene.map.worldToTileX(x),
      this.scene.map.worldToTileY(y)
    );
  };

  #getTileType = (x, y) => {
    let res;
    const tile = this.#coordsToTile(x, y);

    res = tile ? tile.index : 0;

    return res;
  };

  #getClosestExplodable = (maxRadius = 1) => {
    let x = this.x;
    let y = this.y;
    let s = TILES.SIZE;

    function _addBatchByRadius(set, loc, r) {
      switch (loc) {
        case 'top':
          //for(let i=0; i <= r; i++){
          set.add(`${x},${y + s * r}`); // middle
          //}
          for (let i = 1; i <= r; i++) {
            // ajecent
            set.add(`${x + s * i},${y + s * r}`); // lock y
            set.add(`${x - s * i},${y + s * r}`);
          }
          break;

        case 'bottom':
          //for(let i=0; i <= r; i++){
          set.add(`${x},${y - s * r}`); // middle
          //}
          for (let i = 1; i <= r; i++) {
            // ajecent
            set.add(`${x + s * i},${y - s * r}`); // lock y
            set.add(`${x - s * i},${y - s * r}`);
          }
          break;

        case 'left':
          //for(let i=0; i <= r; i++){
          set.add(`${x - s * r},${y}`); // middle
          //}
          for (let i = 1; i <= r; i++) {
            // ajecent
            set.add(`${x - s * r},${y + s * i}`); // lock x
            set.add(`${x - s * r},${y - s * i}`);
          }
          break;

        case 'right':
          //for(let i=0; i <= r; i++){
          set.add(`${x + s * r},${y}`); // middle
          //}
          for (let i = 1; i <= r; i++) {
            // ajecent
            set.add(`${x + s * r},${y + s * i}`); // lock x
            set.add(`${x + s * r},${y - s * i}`);
          }
          break;
      }
    }
    let candidates;
    let radius = 1;
    let resCand = null;

    while (!resCand) {
      candidates = new Set();

      _addBatchByRadius(candidates, 'top', radius);
      _addBatchByRadius(candidates, 'bottom', radius);
      _addBatchByRadius(candidates, 'left', radius);
      _addBatchByRadius(candidates, 'right', radius);

      radius++;

      resCand = Array.from(candidates).find(
        (cand) =>
          this.#getTileType(
            parseInt(cand.split(',')[0]),
            parseInt(cand.split(',')[1])
          ) === TILES.EXPLOADABLE
      );
    }

    return [parseInt(resCand.split(',')[0]), parseInt(resCand.split(',')[1])];
  };

  #getSafeSpot = (dir) => {
    let x = this.x;
    let y = this.y;
    let s = TILES.SIZE;
    let candidates = new Set();

    const isTileWithinBoundaries = (x, y) => {
      if (
        x > CONSTS.BLOCK_BOUNDARY_LEFT &&
        x < CONSTS.BLOCK_BOUNDARY_RIGHT &&
        y > CONSTS.BLOCK_BOUNDARY_BOTTOM &&
        y < CONSTS.BLOCK_BOUNDARY_TOP
      ) {
        return true;
      }
      return false;
    };

    const addCandidate = (x, y, dir) => {
      if (isTileWithinBoundaries(x, y) && this.#getTileType(x, y) === TILES.CLEAR) {
        candidates.add([x, y, dir]);
      }
    };

    if (dir === 'upperOnly' || !dir) {
      // try adding upper diagonal tiles
      if (this.#getTileType(x, y - s) === TILES.CLEAR) {
        addCandidate.call(this, x + s, y - s);
        addCandidate.call(this, x - s, y - s);
      } else if (this.#getTileType(x + s, y) === TILES.CLEAR) {
        addCandidate(x + s, y - s);
      } else if (this.#getTileType(x - s, y) === TILES.CLEAR) {
        addCandidate.call(this, x - s, y - s);
      }
    }

    if (dir === 'lowerOnly' || !dir) {
      // try adding lower diagonal tiles
      if (this.#getTileType(x, y + s) === TILES.CLEAR) {
        addCandidate.call(this, x + s, y + s);
        addCandidate.call(this, x - s, y + s);
      } else if (this.#getTileType(x + s, y) === TILES.CLEAR) {
        addCandidate.call(this, x + s, y + s);
      } else if (this.#getTileType(x - s, y) === TILES.CLEAR) {
        addCandidate.call(this, x - s, y + s);
      }
    }

    if (dir === 'rightOnly' || !dir) {
      // try adding right diagonal tiles

      if (this.#getTileType(x + s, y) === TILES.CLEAR) {
        addCandidate.call(this, x + s, y + s);
        addCandidate.call(this, x + s, y - s);
      } else if (this.#getTileType(x, y - s) === TILES.CLEAR) {
        addCandidate.call(this, x + s, y - s);
      } else if (this.#getTileType(x, y + s) === TILES.CLEAR) {
        addCandidate.call(this, x + s, y + s);
      }
    }

    if (dir === 'leftOnly' || !dir ) {
      // try adding left diagonal tiles
      if (this.#getTileType(x - s, y) === TILES.CLEAR) {
        addCandidate.call(this, x - s, y + s);
        addCandidate.call(this, x - s, y - s);
      } else if (this.#getTileType(x, y + s) === TILES.CLEAR) {
        addCandidate.call(this, x - s, y + s);
      } else if (this.#getTileType(x, y - s) === TILES.CLEAR) {
        addCandidate.call(this, x - s, y - s);
      }
    }

    if (candidates.size) {
      // Candidates available. Return one.
      this.#safeSpotDir = null;
      const randomCandidateIndex = Math.floor(Math.random() * candidates.size);
      return Array.from(candidates)[randomCandidateIndex];
    } else {
      // No candidates. Get random non-diagonal spot.
      const dirsArr = [
        [x + s, y, 'rightOnly'],
        [x - s, y, 'leftOnly'],
        [x, y + s, 'lowerOnly'],
        [x, y - s, 'upperOnly'],
      ];

      if(this.#safeSpotDir) { // if there is a safeSpotDir (and yet candidates arr is empty) continue same dir and try again
        const elem =  dirsArr.find(elem => elem[2] === this.#safeSpotDir)
        return [elem[0], elem [1]]
      }else {
        dirsArr.forEach((dir) => addCandidate.call(this, dir[0], dir[1], dir[2]));
        //console.warn(candidates);
        const randomCandidateIndex = Math.floor(Math.random() * candidates.size);
        const nonDiagonalCandidate = Array.from(candidates)[randomCandidateIndex];
        this.#safeSpotDir = nonDiagonalCandidate[2];
        //console.error(`chosenDir ${chosenDir}`);
        return [nonDiagonalCandidate[0], nonDiagonalCandidate[1]];
      }

    }
  };

  #getRandomAdjacentClearSpot = () => {
    // Get out of stuck situation
    const playerX = this.x;
    const playerY = this.y;
    let s = TILES.SIZE;

    const isTileBombClean = (tileX, tileY, maxBombDistance = 1) => {

      const allBombsSpots = [];
      this.scene.players.getChildren().forEach(player => allBombsSpots.push(...this.scene[`p${player.id}_bombs`].getChildren().map(elem => [elem.x, elem.y])))

      if(playerX === tileX) {
        // tile is up/down to the player
        for(let y = playerY - (maxBombDistance * CONSTS.UNIT_SIZE); y <= playerY + (maxBombDistance * CONSTS.UNIT_SIZE); y+= CONSTS.UNIT_SIZE) {
          if(allBombsSpots.find((bmb => Math.abs(bmb.y - y )< CONSTS.UNIT_SIZE )))
            return false;
        }

      }else {
        // tile is left/right to the player
        for(let x = playerX - (maxBombDistance * CONSTS.UNIT_SIZE); x <= playerX + (maxBombDistance * CONSTS.UNIT_SIZE); x+= CONSTS.UNIT_SIZE) {
          if(allBombsSpots.find((bmb => Math.abs(bmb.x - x )< CONSTS.UNIT_SIZE )))
            return false;
        }
      }

      return true;

    }

    const isTileWithinBoundaries = (x, y) => {
      if (
        x > CONSTS.BLOCK_BOUNDARY_LEFT &&
        x < CONSTS.BLOCK_BOUNDARY_RIGHT &&
        y > CONSTS.BLOCK_BOUNDARY_BOTTOM &&
        y < CONSTS.BLOCK_BOUNDARY_TOP
      ) {
        return true;
      }
      return false;
    };
    const addCandidate = (x, y) => {
      if (isTileWithinBoundaries(x, y) && isTileBombClean(x,y,2) && this.#getTileType(x, y) === TILES.CLEAR) {
        candidates.add([x, y]);
      }
    };

    const candidates = new Set();
    const straitTiles = [ // top, down, left & right tile.
      [playerX + s, playerY],
      [playerX - s, playerY],
      [playerX, playerY + s],
      [playerX, playerY - s],
    ];

    straitTiles.forEach((tile) => addCandidate.call(this, tile[0], tile[1]));
    //console.warn(candidates);
    const rand = Math.floor(Math.random() * candidates.size);
    const chosenDir = Array.from(candidates)[rand];

    return [chosenDir[0], chosenDir[1]];
  };

  #plantBomb = () => {
    if (this.currentAvailableBombs >= 1 && !this.isBombOverlap()) {
      const addBomb = () => this.currentAvailableBombs++;
      this.currentAvailableBombs--;
      new Bomb(
        this.scene,
        this.x,
        this.y,
        addBomb,
        this.firePower,
        this.isDetonator,
        this.id
      );
    }
  };

  #goTo = (x, y, isClear = false) => {
    let res = false;
     console.log('go to ' + x + ',' + y);
     console.log('myx' + this.x);
     console.log('myy' + this.y);
    if (!this.#isXsettled) {
      // try settleX
      if (
        (isClear && Math.abs(this.x - x) <= 2) ||
        (!isClear && !this.#isYsettled && Math.abs(this.x - x) <= 5) ||
        (!isClear && this.#isYsettled && Math.abs(this.x - x) <= 67)
      ) {
        this.#isXsettled = true;
        console.error('x setteled');
      } else {
        if (this.x < x) {
          // p    X
          this.body.setVelocityX(this.speed);
          this.angle = ANGLES.RIGHT;
        } else if (this.x > x) {
          // X     p
          this.body.setVelocityX(-this.speed);
          this.angle = ANGLES.LEFT;
        }
      }
    }
    if (!this.#isYsettled) {
      // try settleY
      if (
        (isClear && Math.abs(this.y - y) <= 2) ||
        (!isClear && !this.#isXsettled && Math.abs(this.y - y) <= 5) ||
        (!isClear && this.#isXsettled && Math.abs(this.y - y) <= 67)
      ) {
        this.#isYsettled = true;
        console.error('y setteled');
      } else {
        if (this.y > y) {
          //    Y
          //    p
          this.body.setVelocityY(-this.speed);
          this.angle = ANGLES.UP;
        } else if (this.y < y) {
          //    p
          //    Y
          this.body.setVelocityY(this.speed);
          this.angle = ANGLES.DOWN;
        }
      }
    }
    if (this.#isXsettled && this.#isYsettled) {
      // all setteled
      this.#isXsettled = false;
      this.#isYsettled = false;
      res = true;
    }

    return res;
  };

  #commitGetTargetState = () => {
    if (this.#targetTile) {
      //move
      const isTargetReachedOut = this.#goTo(this.#targetTile[0], this.#targetTile[1]);
      if (isTargetReachedOut) {
        this.#targetTile = null;
        this.#plantBomb();
        this.#state = this.#states.ESCAPE;
        console.warn('ESCAPE');

      }
    } else {
      this.anims.setCurrentFrame(this.anims.currentAnim.frames[0]);
      this.#targetTile = this.#getClosestExplodable(); // return point or null
    }
  };

  #commitEscapeState = () => {

    const CLEAR_TILE = true; // indicates that the target tile is vacant.

    if (!this.#targetTile) { // get target

      this.anims.stop();
      this.#targetTile = this.#getSafeSpot(this.#safeSpotDir);
    } else {

      const isTargetReachedOut = this.#goTo(this.#targetTile[0], this.#targetTile[1], CLEAR_TILE);

      if (isTargetReachedOut && !this.#safeSpotDir) { // safeSportDir indicates the getSafeSpot didnt over yet
        // finished
        this.#targetTile = null;
        this.#state = this.#states.WAIT;
        console.warn('WAIT');
      } else if (isTargetReachedOut) {
        this.anims.stop();
        this.#targetTile = this.#getSafeSpot(this.#safeSpotDir);
        //this.#safeSpotDir = null;
      } // else (!isTargetReachedOut) return (will get to this function again)
    }
  };

  #commitWaitState = () => {
    if (this.currentAvailableBombs === this.numBombs) {
      this.#state = this.#states.GET_TARGET;
      console.warn('GET_TARGET');

    }
  };

  #checkIsStuck = (x, y) => {

    console.log(this.#stuckCounter);
    if (this.#lastCoords && Math.abs(this.#lastCoords[0] - x) < 2 && Math.abs(this.#lastCoords[1] - y) < 2) {
      this.#stuckCounter++;

    }if (this.#stuckCounter >=10){

this.#isStuck = true;
      //this.#stuckCounter = 0;
    }

    // if (this.#stuckCounter >= 20) {
    //   this.#isStuck = true;
    // }
  };
}
