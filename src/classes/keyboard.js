class Keyboarder {
    constructor() {

        let self = this
        this.keyState = {}
        this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32 }
        // populate KEYS with all the alphabetic keys A - Z
        for (let i = 65; i < 91; i++ ) {
            this.KEYS[String.fromCharCode(i)] = i;
        }
        window.addEventListener('keydown', function(e) {
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

    z() {
        return this.isDown(this.KEYS['Z'])
    }

    x() {
        return this.isDown(this.KEYS['X'])
    }

    m() {
        return this.isDown(this.KEYS['M'])
    }

    c() {
        return this.isDown(this.KEYS['C'])
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