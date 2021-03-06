import { timestamp, drawImage } from './util'
import { PLAYERPARTS, palette, BOMBSTART, SIGNSTART } from './data'
import * as snd from './sound'
import Bomb from './bomb'

class Player {
    constructor(imgs, level, game) {
        this.x = 0
        this.y = 0

        this.depth = 6

        this.xVel = 0
        this.yVel = 1

        this.jumping = false
        this.falling = true
        this.imgs = imgs
        this.level = level
        this.game = game
        this.onFloor = false
        this.locked = false

        this.frame = 0

        this.isDead = false
        let now = timestamp()
        this.ts = now
        this.ats = now
        this.zts = now
        this.xts = now
        this.mts = now
        this.cts = now
        this.showBack = false
        this.showFront = false

        this.w = 45
        this.h = 130

        if(level.u) {
            this.x = level.u[0]
            this.y = level.u[1]
        }

        this.flipX = false

        this.animation = []

        let o = PLAYERPARTS + 4

        for(let i = o; i < o - 1 + 20; i++) {
            this.animation.push(i)
        }
        for(let i = o - 1 + 20; i >= o ; i--) {
            this.animation.push(i)
        }

        this.blocked = {
            up: false,
            down: false
        }

        this.bomb = null
        this.holding = false

        this.inventory = [ BOMBSTART ]
        this.selected = 0

        this.mute = true
    }

    goRight() {
        if(this.xVel < 6) {
            this.xVel += 1.5
        }
        this.flipX = false
    }

    goLeft() {
        if(this.xVel > -6) {
            this.xVel -= 1.5
        }
        this.flipX = true
    }

    jump() {
        if(this.yVel > -10 && !this.jumping) {
            this.yVel -= 3.5
        } else {
            this.jumping = true
            snd.jump()
            //const fx = Object.values(snd.testSounds);
            //fx[~~(Math.random() * fx.length)]();
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
        // Move rectangle along x axis
        for (let i = 0; i < rects.length; i++) {
            let c = this.getRect(p, vx, 0) //{ x: p.x + vx, y: p.y, w: p.w, h: p.h }
            rects[i].x = rects[i].ox + this.level.viewport.x
            if (this.overlapTest(c, rects[i])) {
                if (vx < 0) {
                    vx = rects[i].x + rects[i].w - p.x
                } else if (vx > 0) {
                    vx = rects[i].x - p.x - p.w
                }
            }
        }
        this.xVel = vx
        //p.x += vx
        this.level.viewport.inc(vx)
        if(this.level.viewport.atEdge(p.x, vx)) {
            p.x += vx
        }

        this.blocked = {
            up: false,
            down: false
        }

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
        this.yVel = vy
        p.y += vy
    }

    checkPickups() {
        let p = this
        let c = this.getRect(p, 0, 0) //{ x: p.x, y: p.y, w: p.w, h: p.h }
        let r = this.level.pickups
        let match = false
        for(let i = 0; i < r.length; i++) {
            r[i].x = r[i].ox + this.level.viewport.x
            if (this.overlapTest(c, r[i]) && r[i].e > 0) {
                this.inventory = this.inventory.concat(r[i].id)
                r[i].e = 0
                r[i].v = 0
                snd.testSounds.blup()
                match = true
            }
        }
        if(!match) {
            snd.testSounds.nah()
        }
    }

    checkInteractive() {
        let now = timestamp()
        if(now < this.ts + 400 || this.locked) {
            return
        }
        let p = this
        let c = this.getRect(p, 0, 0) //{ x: p.x, y: p.y, w: p.w, h: p.h }
        let r = this.level.interactive
        for(let i = 0; i < r.length; i++) {
            r[i].x = r[i].ox + this.level.viewport.x
            if (this.overlapTest(c, r[i]) && r[i].e > 0) {

                this.x = r[i].mx - 26 + this.level.viewport.x
                this.xVel = 0
                this.ts = timestamp()
                let self = this
                if(r[i].t > 14 && r[i].t < 46) {
                    this.locked = true
                    this.yVel = -15
                    this.jumping = true
                    this.frame = 9
                    snd.jump()
                    if(self.level.showBack) {
                        snd.goFront()
                    } else {
                        snd.goBack()
                    }

                    setTimeout(() => {
                        self.depth = 2 // this might have to be a 1
                        if(self.level.showBack) {
                            self.depth = 0
                        }
                        setTimeout(() => {
                            // jump into back
                            self.game.changeLevel(r[i].d, true, false)
                            self.locked = false
                        }, 450)
                    }, 450)
                } else {
                    // normal door
                    this.showBack = true
                    this.game.changeLevel(r[i].d, false, true)
                }
                break;
            }
        }
    }

    update(k) {
        if(this.isDead) return

        let moving = false
        if(!this.locked) {

            // right
            if(k.left()) {
                moving = true
                this.goLeft()
            } else if(k.right()) {
                moving = true
                this.goRight()
            }

            if(k.jump() && !this.jumping && !this.falling) {
                moving = true
                this.jump()
            }

            if(k.up() && !moving) {
                // check interactive
                this.checkInteractive()
            }

            if(k.z()) {
                let now = timestamp()
                if(now > this.zts + 300) {
                    this.zts = now
                    if(this.selected < 2) {
                        if(this.holding) {
                            snd.throwit()
                            this.bomb.launch()
                            this.holding = false
                        } else {
                            this.bomb = new Bomb(this.x, this.y, this.game, this.level, this.imgs, this, this.selected === 1)
                            this.holding = true
                            this.level.bombs.push(this.bomb)
                        }
                    }
                }
            }
            if(k.x()) {
                let now = timestamp()
                if(now > this.xts + 300) {
                    this.xts = now
                    if(this.selected < 2) {
                        if(this.holding) {
                            snd.throwit()
                            this.bomb.launch()
                            this.holding = false
                        }
                    }
                    this.selected += 1
                    if(this.selected > this.inventory.length - 1) {
                        this.selected = 0
                    }
                }
            }

            if(k.m()) {
                let now = timestamp()
                if(now > this.mts + 300) {
                    if(this.mute) {
                        snd.pauseMusic()
                    } else {
                        snd.playMusic()
                        snd.goFront()
                    }
                    this.mute = !this.mute
                    this.mts = now
                }
            }

            if(k.c()) {
                let now = timestamp()
                if(now > this.cts + 300) {
                    this.checkPickups()
                    this.cts = now
                }
            }
        }

        if(this.xVel > 0) {
            this.xVel -= 0.1
        }
        if(this.xVel < 0) {
            this.xVel += 0.1
        }

        if(this.yVel > 0) {
            this.yVel += 0.6
        }
        if(this.yVel < 0) {
            this.yVel += 0.6
        }

        if(!moving) {
            if(this.xVel > 0 && this.xVel < 0.2) {
                this.xVel = 0
            }
            if(this.xVel < 0 && this.xVel > -0.2) {
                this.xVel = 0
            }
        }

        let expectedY = this.y + this.yVel

        this.move(this, this.xVel, this.yVel, this.level.rects)
        this.onFloor = (expectedY > this.y) && !this.blocked.up
        if(this.onFloor) {
            this.jumping = false
            this.falling = false
        }
        if (expectedY !== this.y && !this.blocked.up) {
            this.yVel = 0
        }

        if(this.yVel > 0.5) {
            this.falling = true
        }

        // player gets stuck in the bottom of platforms :(
        if(this.jumping && !this.blocked.up && !this.blocked.down && !this.onFloor) {
            if(this.yVel > -0.1 && this.yVel < 0.1) {
                this.yVel = 3.5
                this.falling = true
            }
        }

        // can't go past edges of screen
        if(this.x < 0) {
            this.x = 0
            if(this.xVel < 0) {
                this.xVel = 0
            }
        }
        if(this.x - this.level.viewport.x > this.level.viewport.width - this.w) {
            this.x = this.level.viewport.width - this.w + this.level.viewport.x
            if(this.xVel > 0) {
                this.xVel = 0
            }
        }

        // this ensures the player falls down holes :)
        if(this.onFloor && (this.yVel < 0.1 || this.yVel > -0.1 )) {
            this.yVel += 0.1
        }
    }

    draw(c, j) {

        let f = this.animation[j]
        let yoff = 44
        if(this.showBack || this.showFront) {
            f = PLAYERPARTS - 2
            yoff = 58
        }

        let aoffset = 0
        if(this.holding) {
            aoffset = 20
        }
        let i = this.imgs[f + aoffset]
        drawImage(c, i, this.x + 26, this.y + yoff, i.width, i.height, 0, this.flipX, false, true)
        if(this.showFront) {
            // draw the front face on top
            let z = this.imgs[PLAYERPARTS - 1]
            drawImage(c, z, this.x + 26, this.y + yoff, i.width, i.height, 0, this.flipX, false, true)
        }
    }

    render(c) {
        if(this.isDead) return
        this.draw(c, this.frame)
        //if(this.locked) return

        if(!this.jumping && (this.xVel > 0.1 || this.xVel < -0.1)) {
            let now = timestamp()
            if(now > this.ats + 10) {
                this.frame++
                if(this.frame > this.animation.length - 1) {
                    this.frame = 0
                }
                this.ats = now
            }
        } else {
            if(!this.jumping) {
                this.frame = 10
            }
            if(this.jumping) {
                this.frame = 18
            }
        }

        /*c.strokeStyle = 'white'
        let r = this.getRect(this, 0, 0)
        c.strokeRect(r.x, r.y, r.w, r.h)*/

        //for(let sy = 0; sy < 3; sy++) {
            /*for(let sx = 0; sx < 9; sx++) {
                let i = this.imgs[BOMBSTART + 40 + sx]
                drawImage(c, i, this.x + (sx * 100), this.y - 100, i.width, i.height, 0, false, false, true)
            }*/
        //}
    }

    overlapTest(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    }

    releaseLock() {
        this.locked = false
        this.showBack = false
        this.showFront = false
    }

    kaboom() {
        snd.explode()
    }

    splat() {
        snd.splat()
    }

    renderGUI(c) {
        c.strokeStyle = palette[1]
        c.lineWidth = 4
        let m = 1360 / 2
        let xs = m - this.selected * 90

        c.globalAlpha = 0.2
        let yoff = 0
        for(let i = 0; i < this.inventory.length; i++) {
            if(this.selected === i) {
                c.globalAlpha = 1.0
                c.strokeRect(xs + 10 + (i * 90), 30, 80, 80)
            }
            let j = this.imgs[this.inventory[i]]
            if(i > 0) {
                yoff = -5
            }
            /*if(i !== this.selected) {
                yoff += 15
            }*/
            drawImage(c, j, xs + i * 90, 35 + yoff, j.width, j.height, 0, false, false, false)
            c.globalAlpha = 0.2
            yoff = 0
        }
        c.globalAlpha = 1.0
    }
}

export default Player