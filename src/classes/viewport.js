class Viewport {
    constructor(w, startx) {
        this.width = w
        this.x = startx

        this.maxx = (this.width - 1360) * -1
        this.rightEdge = false
        this.leftEdge = false
    }

    inc(d) {
        this.rightEdge = false
        this.leftEdge = false

        this.x -= (d * 1.2) // * 2.5)
        if(this.x <= this.maxx) {
            this.x = this.maxx
            this.rightEdge = true
        }

        if(this.x >= 0 ) {
            this.x = 0
            this.leftEdge = true
        }
    }

    atEdge(px, pv) {
        if(pv < 0 && this.leftEdge || px > 1360 / 2 + 200 ) {
            return true
        }
        if(pv > 0 && this.rightEdge || px < 1360 / 2 - 200) {
            return true
        }
        return false
    }
}

export default Viewport