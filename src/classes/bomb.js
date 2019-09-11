import { timestamp, drawImage } from './util'
import { BOMBSTART } from './data'

const BOMB = {
    HELD: 0,
    THROWN: 1,
    DONE: 2
}

class Bomb {
    constructor(x, y, game, level, images, player) {

        this.player = player
        this.game = game
        this.level = level
        this.x = x
        this.y = y
        this.state = BOMB.HELD
        this.img = images

        this.w = 30
        this.h = 30

        this.xVel = 0
        this.yVel = 0

        this.ts = timestamp()
        this.animations = []

        for(let i = BOMBSTART; i < BOMBSTART + 40; i++) {
            this.animations.push(i)
        }
        // boom
        this.animations = this.animations.concat([41, 42, 43, 44, 45, 46])

        this.frame = 0
        this.flipX = false

        this.blocked = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        this.angle = 10
        this.bouncecount = 1
        this.stopped = false
        this.visible = true
    }

    render(c) {
        if(!this.visible) return
        let a = this.img[this.animations[this.frame]]
        let o = 0
        if(this.state !== BOMB.HELD) {
            o = this.level.viewport.x
        }
        drawImage(c, a, this.x + o, this.y, a.width, a.height, this.angle, this.flipX, false, true)

        /*this.level.rects.forEach(r => {
            c.strokeStyle = 'orange'
            c.strokeRect(r.x, r.y, r.w, r.h)
        })*/
    }

    update() {
        switch(this.state) {
            case BOMB.HELD:

                this.x = this.player.x - 20
                if(this.player.flipX) {
                    this.x = this.player.x + 75
                }
                this.y = this.player.y + 40
                this.angle = 25
                if(this.player.flipX) {
                    this.angle = -25
                }
                break
            case BOMB.THROWN:
                this.x += this.xVel
                this.y += this.yVel

                // slow down
                if(!this.flipX && this.xVel >= 0.3) {
                    this.xVel -= 0.3
                }
                if(this.flipX && this.xVel <= -0.3) {
                    this.xVel += 0.3
                }

                if(this.yVel >= 0.6) {
                    this.yVel += 0.6
                }
                if(this.yVel <= 0.6) {
                    this.yVel += 0.6
                }

                /*let moveX = true
                let moveY = true*/
                if(this.xVel > 0 && this.xVel <= 0.2) {
                    this.xVel = 0
                    //moveX = false
                }
                if(this.xVel < 0 && this.xVel >= -0.2) {
                    this.xVel = 0
                    //moveX = false
                }

                if(this.yVel > 0 && this.yVel <= 0.3) {
                    this.yVel = 0
                    //moveY = false
                }
                if(this.yVel < 0 && this.yVel >= -0.3) {
                    this.yVel = 0
                    //moveY = false
                }

                //if((moveX || moveY) && !this.stopped) {
                    this.move(this, this.xVel, this.yVel, this.level.rects)
                //}

                if(this.blocked.down) {
                    if(this.bouncecount < 1) {
                        this.yVel = 0
                        this.xVel = 0
                        this.stopped = true
                    } else {
                        this.yVel = -4.5
                        this.xVel = 4
                        if(this.flipX) {
                            this.xVel *= -1
                        }
                        this.bouncecount -= 1
                    }
                }

                /*let expectedY = this.y + this.yVel
                let onFloor = (expectedY > this.y) && !this.blocked.up
                if(onFloor) {
                    //this.yVel = 0
                }
                if (expectedY !== this.y && !this.blocked.up) {
                    //this.yVel = 0
                }*/

                // can't go past edges of screen
                /*if(this.x < 0) {
                    this.x = 0
                    if(this.xVel < 0) {
                        this.xVel = 0
                    }
                }*/
                /*if(this.x - this.level.viewport.x > this.level.viewport.width - this.w) {
                    this.x = this.level.viewport.width - this.w + this.level.viewport.x
                    if(this.xVel > 0) {
                        this.xVel = 0
                    }
                }*/

                // this ensures the bomb falls down holes :)
                if(!this.blocked.down && (this.yVel < 0.1 || this.yVel > -0.1 )) {
                    this.yVel += 0.1
                }

                break
        }
        // bomb will explode regardless
        let now = timestamp()
        if(now > this.ts + 50) {
            if(this.frame < this.animations.length - 1) {
                this.frame += 1
                if(this.frame === this.animations.length - 6 ) {
                    this.y -= 30
                    this.yVel = -6
                    // kaboom
                    this.player.kaboom()

                }
                if(this.frame === this.animations.length - 3 ) {
                    let px = this.x
                    let py = this.y
                    this.level.explosion({
                        x: px - 60,
                        y: py - 60,
                        w: 120,
                        h: 120
                    })
                }
            } else {
                this.visible = false
                this.state === BOMB.DONE
            }

            this.ts = now
        }
    }

    getRect(p, vx, vy) {
        return {
            x: p.x + vx,
            y: p.y + vy,
            w: p.w,
            h: p.h
        }
    }

    // Move the rectangle p along vx then along vy, but only move
    // as far as we can without colliding with a solid rectangle
    move(p, vx, vy, rects) {
        this.blocked = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        // Move rectangle along x axis
        for (let i = 0; i < rects.length; i++) {
            let c = this.getRect(p, vx, 0) //{ x: p.x + vx, y: p.y, w: p.w, h: p.h }
            rects[i].x = Math.floor(rects[i].ox)
            if (this.overlapTest(c, rects[i])) {
                if (vx < 0) {
                    vx = rects[i].x + rects[i].w - p.x
                    this.blocked.left = true
                } else if (vx > 0) {
                    vx = rects[i].x - p.x - p.w
                    this.blocked.right = true
                }
            }
        }
        if(vx > 10) {
            vx = 10
        }
        if(vx < -10) {
            vx = -10
        }
        this.xVel = vx
        p.x += vx

        // Move rectangle along y axis
        for (let i = 0; i < rects.length; i++) {
            let c = this.getRect(p, 0, vy) //{ x: p.x, y: p.y + vy, w: p.w, h: p.h }
            if (this.overlapTest(c, rects[i])) {
                if (vy < 0) {
                    vy = rects[i].y + rects[i].h - p.y
                    this.blocked.up = true
                } else if (vy > 0) {
                    vy = rects[i].y - p.y - p.h
                    this.blocked.down = true
                }
            }
        }
        if(vy > 10) {
            vy = 10
        }
        if(vy < -10) {
            vy = -10
        }
        this.yVel = vy
        p.y += vy
    }

    overlapTest(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    }

    launch() {
        this.x = this.player.x - this.level.viewport.x
        this.yVel -= 10.5
        this.xVel = 7.0
        this.angle = 25
        if(this.player.flipX) {
            this.flipX = true
            this.xVel *= -1
            this.angle *= -1
        }
        this.xVel += this.player.xVel
        this.yVel += this.player.yVel
        this.state = BOMB.THROWN
        //this.x = this.x + this.level.viewport.x
    }

    isDone() {
        return this.state === BOMB.DONE
    }
}

export default Bomb