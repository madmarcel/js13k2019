import { overlapTest } from "./util"

class BombRevealTrigger {
    constructor(rect, imgs, sourceimg, targetimg) {
        this.r = rect
        this.source = imgs[sourceimg]
        this.target = imgs[targetimg]
        this.done = false

        this.source['v'] = true
        this.target['v'] = false
    }

    check(bombexplosionrect) {
        if(!this.done && overlapTest(this.r, bombexplosionrect)) {
            this.activate()
        }
    }

    activate() {
        this.done = true
        this.source['v'] = false
        this.target['v'] = true
    }
}

export default BombRevealTrigger