import { leveldata, LENSSTART } from './data'
import Level from './level'
import { generateImages } from './dataloader'
import { fsrect, text, rect, timestamp, drawImage } from './util'
import Keyboarder from './keyboard'
import Player from './player'
import * as snd from './sound'

const STATE = {
    LOADING: 0,
    TITLE: 1,
    PREPLAY: 2,
    PLAY: 3,
    GAMEOVER: 4
}

let images = []

class Game {
    constructor() {
        this.state = STATE.LOADING
        this.player = null

        this.kb = new Keyboarder()

        this.doingLens = false
        this.lensTS = timestamp()
        this.lenscounter = LENSSTART
        this.lensdelta = 1
        this.nextLevel = -1
        this.lx = 0
        this.ly = 0
    }

    start() {
       let self = this
       setTimeout(() => {
            images = generateImages()
            const startlevel = 0
            self.level = new Level(leveldata[startlevel], images, false)
            self.state = STATE.TITLE
       }, 25)
    }

    update() {
        switch(this.state) {
            case STATE.TITLE:
                // wait for keypress
                this.level.update()
                this.pressAnyKey(STATE.PREPLAY, 1)
            break
            case STATE.PREPLAY:
                this.player = new Player(images, this.level, this)
                this.state = STATE.PLAY
                this.doingLens = true
                this.lx = this.player.x + 40
                this.ly = this.player.y + 30
            break
            case STATE.PLAY:
                this.level.update()
                this.player.update(this.kb)
            break
        }

        if(this.doingLens) {
            let now = timestamp()
            if(now > this.lensTS + 15) {
                this.lenscounter += this.lensdelta
                this.lensTS = now
                if(this.lenscounter < LENSSTART + 1 && this.nextLevel > -1) {
                    this.level.startLoad()
                }
                if(this.lenscounter < LENSSTART && this.nextLevel > -1) {
                    this.level.startLoad()
                    this.completeLens()
                }
                if(this.lenscounter > LENSSTART + 30 && this.lensdelta > 0 ) {
                    this.player.releaseLock()
                }
                if(this.lenscounter > LENSSTART + 79) {
                    this.doingLens = false
                    this.lensdelta *= -1
                }
            }
        }
    }

    render(c) {
        switch(this.state) {
            case STATE.LOADING:
                fsrect(c, '#3e2137')
                text(c, 'Loading', 1366/2 - 100, 768/2, '#f5edba', 32)
            break
            case STATE.TITLE:
                // render titlescreen
                this.level.render(c)
                rect(c, '#000', 536, 136, 390, 300, 0.4)
                text(c, 'Behind the Scenery', 1366/2 - 100, 768/2 - 170, '#f5edba', 32)
                text(c, 'by madmarcel for js13k 2019', 1366/2 - 60, 768/2 - 140, '#f5edba', 16)
                text(c, 'music and sfx by justinfunstain', 1366/2 - 60, 768/2 - 110, '#f5edba', 16)
                text(c, 'gamepad supported', 1366/2 - 20, 768/2 - 80, '#f5edba', 16)
                text(c, 'press any key to start', 1366/2 - 60, 768/2, '#f5edba', 28)
            break
            case STATE.PLAY:
                this.level.render(c, this.player)
            break
        }
        if(this.doingLens) {
            this.player.locked = true
            let img = images[this.lenscounter]
            drawImage(c, img, this.lx, this.ly, img.width, img.height, 0, false, false, true)
        }
    }

    pressAnyKey(nextState, nextLevel) {
        if(this.kb.isAnyKeyDown()) {
            this.state = nextState
            this.level = new Level(leveldata[nextLevel], images, false)
            //this.level.startLoad()
            snd.create()
            //snd.playMusic()
        }
    }

    changeLevel(i, showBack, doLens) {
        //console.log('Loading new level ', i, showBack)
        if(this.level.showBack) {
            showBack = false
        }
        if(!doLens) {
            this.level = new Level(leveldata[i], images, showBack)
            this.player.level = this.level
            this.player.depth = 6
            this.nextLevel = -1
        } else {
            this.lx = this.player.x + 40
            this.ly = this.player.y + 30
            this.player.locked = true
            this.player.showBack = true
            this.player.showFront = false
            this.nextLevel = i
            this.doingLens = true
            this.lenscounter = LENSSTART + 50
            this.lensdelta = -1
        }
    }

    completeLens() {
        this.level = new Level(leveldata[this.nextLevel], images, false)
        this.level.startLoad()
        this.player.showBack = false
        this.player.showFront = true
        this.player.level = this.level
        this.player.depth = 6

        this.doingLens = true
        this.lenscounter = LENSSTART
        this.lensdelta = 1
        this.lx = this.player.x + 40
        this.ly = this.player.y + 30
        /*setTimeout(() => {
            this.player.releaseLock()
        }, 250)*/
    }
}

export default Game