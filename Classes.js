/**
 * The Pong users class
 * @method update
 * @method draw
 */
class User {
  /** 
   * @param {CanvasRenderingContext2D} ctx The canvas context
   * @param {Object} keystate The keystate object, holding the up and down movement keys
   * @param {String} Up The up direction key
   * @param {String} Down The down direction key
   */
  constructor(keystate, Up, Down) {
    //this.ctx = ctx;
    this.x = null;
    this.y = null;
    this.width = 20;
    this.height = 100;
    this.keystate = keystate;
    this.up = Up;
    this.down = Down;
  }

  /**
 * Updates the Player Movement
 * @returns None
 */
  update() {
    //console.log(this.keystate);
    if (this.keystate[this.up]) this.y -= 7;
    if (this.keystate[this.down]) this.y += 7;
    this.y = Math.max(Math.min(this.y, Height - this.height), 0);
  }

  /**
   * Draws the user
   * @returns None
   */
  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

/**
 * The ball class
 * @method serve
 * @method update
 * @method draw
 */
class Ball {
  /**
   * @param {CanvasRenderingContext2D} ctx The canvas context
   */
  constructor() {
    //this.ctx = ctx;
    this.x = null;
    this.y = null;
    this.side = 20;
    this.vel = null;
    this.speed = 12;
  }

  /**
   * Serves the ball from a side
   * @param {Number} side The side to serve from
   * @param {Object} player1 The player1 object
   * @param {Object} player2 The player2 object
   * @returns None
   */
  serve(side, player1, player2) {
    const r = Math.random();
    this.x = side === 1 ? player1.x + player1.width : player2.x - this.side;
    this.y = (Height - this.side) * r;

    const phi = 0.1 * pi * (1 - 2 * r);
    this.vel = {
      x: side * this.speed * Math.cos(phi),
      y: this.speed * Math.sin(phi)
    };
  }

  /**
   * Updates the Ball movement
   * @param {Object} player1 The player1 object
   * @param {Object} player2 The player2 object
   * @returns None
   */
  update(player1, player2) {
    this.x += this.vel.x;
    this.y += this.vel.y;

    if (0 > this.y || this.y + this.side > Height) {
      const offset = this.vel.y < 0 ? 0 - this.y : Height - (this.y + this.side);
      this.y += 2 * offset;
      this.vel.y *= -1;
    }

    /**
     * Checks if the axis of the two bounding boxes intersect
     * Two boxes lined with the axis, if they intersect
     * @param {Number} ax The x position of the first box
     * @param {Number} ay The y position of the first box
     * @param {Number} aw The width of the first box
     * @param {Number} ah The height of the first box
     * @param {Number} bx The x position of the second box
     * @param {Number} by The y position of the second box
     * @param {Number} bw The width of the second box
     * @param {Number} bh The height of the second box
     * @returns {Boolean} True or false if the two boxes intersect
     */
    const AABBIntersect = (ax, ay, aw, ah, bx, by, bw, bh) => ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;

    const pdle = this.vel.x < 0 ? player1 : player2;
    if (AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height, this.x, this.y, this.side, this.side)) {
      this.x = pdle === player1 ? player1.x + player1.width : player2.x - this.side;
      const n = (this.y + this.side - pdle.y) / (pdle.height + this.side);
      const phi = 0.25 * pi * (2 * n - 1);

      const smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;
      this.vel.x = smash * (pdle === player1 ? 1 : -1) * this.speed * Math.cos(phi);
      this.vel.y = smash * this.speed * Math.sin(phi);
      audioBeep.play();
    }

    if (0 > this.x + this.side || this.x > Width) {           
      if (this.x > Width) { player1Score++; } 
      else if (0 > this.x + this.side) { player2Score++; }
      console.log(`Player 1: ${player1Score}; Player 2: ${player2Score}`);

      this.serve((pdle === player1 ? 1 : -1), player1, player2);
    }
  }

  /**
   * Draws the Ball
   * @returns None
   */
  draw() {
    ctx.fillRect(this.x, this.y, this.side, this.side);
  }
}