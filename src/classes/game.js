import { leveldata, LENSSTART } from './data'
import Level from './level'
import { generateImages } from './dataloader'
import { fsrect, text, rect, timestamp, drawImage, jsonCopy } from './util'
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

        this.data = jsonCopy(leveldata)

        let l = this.data.length

        for(let i = 0; i < 10; i++) {
            this.data.push({}) // placeholder data
        }
        for(let i = 0; i < l; i++) {
            this.data[i + 10] = this.data[i]
        }
    }

    start() {
       let self = this
       setTimeout(() => {
            images = generateImages()
            const startlevel = 0
            self.level = new Level(this.data[startlevel], images, false, startlevel)
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
                rect(c, '#000', 536, 136, 440, 600, 0.4)
                text(c, 'Behind the Scenery', 1366/2 - 100, 768/2 - 170, '#f5edba', 32)
                text(c, 'by madmarcel for js13k 2019', 1366/2 - 60, 768/2 - 140, '#f5edba', 16)
                text(c, 'music and sfx by justinfunstain', 1366/2 - 60, 768/2 - 110, '#f5edba', 16)
                text(c, 'press any key to start', 1366/2 - 60, 768/2, '#f5edba', 28)

                let o = 768/2 + 60

                let sent = [
                    'Controls:',
                    '',
                    'Arrow keys - move',
                    'Space - jump',
                    'Up - enter door/jump over',
                    'z - use item',
                    'x - toggle item',
                    'c - pickup item',
                    '',
                    'm - mute music'
                ]

                sent.forEach(t => {
                    text(c, t, 1366/2 - 60, o, '#f5edba', 14)
                    o += 25
                })
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
            this.level = new Level(this.data[nextLevel], images, false, nextLevel)
            //this.level.startLoad()
            snd.create()
            snd.playMusic()
            snd.goFront()
        }
    }

    changeLevel(i, showBack, doLens) {
        if(this.level.showBack) {
            showBack = false
        }
        if(!doLens) {
            if(showBack) {
                i += 10
            }
            this.data[this.level.origin] = jsonCopy(this.level.d)
            this.level = new Level(this.data[i], images, showBack, i, this.data)
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
        this.data[this.level.origin] = jsonCopy(this.level.d)
        this.level = new Level(this.data[this.nextLevel], images, false, this.nextLevel)
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