class Keyboarder {
    constructor() {

        let self = this
        this.keyState = {}
        this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32, ENTER: 13, ESC: 27 }
        // stop these key events from propagating, so that player doesn't accidentally interact with browser window (scrolling etc)
        this.preventKeys = [
            this.KEYS.LEFT,
            this.KEYS.RIGHT,
            this.KEYS.UP,
            this.KEYS.DOWN,
            this.KEYS.SPACE,
            this.KEYS.ENTER,
            this.KEYS.ESC
        ]
        // populate KEYS with all the alphabetic keys A - Z
        for (let i = 65; i < 91; i++ ) {
            this.KEYS[String.fromCharCode(i)] = i;
        }
        window.addEventListener('keydown', function(e) {
            // for certain keys you want to call e.preventDefault() to stop brower windows scrolling etc
            if ( self.preventKeys.indexOf(e.keyCode) > -1 ) {
                e.preventDefault()
                e.stopPropagation()
            }
            self.keyState[e.keyCode] = true
        })
        window.addEventListener('keyup', function(e) {
            self.keyState[e.keyCode] = false
        })
    }

    left() {
        return this.isDown(this.KEYS.LEFT)
    }

    right() {
        return this.isDown(this.KEYS.RIGHT)
    }

    jump() {
        return this.isDown(this.KEYS.SPACE)
    }

    up() {
        return this.isDown(this.KEYS.UP)
    }

    isDown(key) {
        return this.keyState['' + key] === true
    }

    isUp(key) {
        return this.keyState['' + key] === false
    }

    isAnyKeyDown() {
        let r = false
        Object.keys(this.keyState).forEach(k => {
            if(this.keyState[k]) {
                r = true
            }
        })
        return r
    }
}

export default Keyboarder