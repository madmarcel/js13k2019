import { overlapTest } from "./util"

class BombRevealTrigger {
    constructor(rect, data, targetlevel, targetflag, reveallevel, revealflag, water, interactive) {
        this.r = rect
        this.data = data
        this.targetlevel = targetlevel
        this.targetflag = targetflag
        this.reveallevel = reveallevel
        this.revealflag = revealflag
        this.done = false
        this.iswater = water
        this.interactive = interactive
    }

    check(bombexplosionrect, iswater) {
        if(this.iswater !== iswater) return false

        if(!this.done && overlapTest(this.r, bombexplosionrect)) {
            this.activate()
            return true
        }

        return false
    }

    activate() {
        this.done = true
        this.data[this.targetlevel][this.targetflag] = 0
        this.data[this.reveallevel][this.revealflag] = 1
        this.interactive.e = 1
    }
}

export default BombRevealTrigger