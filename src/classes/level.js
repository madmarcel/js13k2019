import ParticleField from './particlefield'
import { jsonCopy, fsrect, rect } from './util'
import { INTERACTIVES, DOOR, TATTYBUSH, BUSH, FGTREE, palette, LOCKEDDOOR } from './data';
import Viewport from './viewport'
import BombRevealTrigger from './bombrevealtrigger';

class Level {
    constructor(d, imgs, back) {
        this.d = jsonCopy(d)

        this.imgs = [].concat(imgs)
        this.enemies = []
        this.rects = []
        this.pfs = []
        this.interactive = []
        this.showBack = back

        this.u = null
        this.isBuilding = false
        this.loading = false
        this.bombs = []
        this.bombtargets = []

        this.imgs.forEach(i => {
            i['v'] = true
        })

        this.build()
    }

    startLoad() {
        if(this.loading) return
        this.loading = true
        let self = this
        setTimeout(() => {
            self.loading = false
        }, 60)
    }

    build() {
        this.isBuilding = true
        // generate rectangle
        for(let fg = 0; fg < this.d.i[6].length; fg += 4) {
            if(this.d.i[6][fg + 3] > 0) {
                let i = this.imgs[this.d.i[6][fg]]
                this.rects.push({
                    ox: this.d.i[6][fg + 1] - i.width / 2,
                    x: this.d.i[6][fg + 1] - i.width / 2,
                    y: this.d.i[6][fg + 2] + 10,
                    w: i.width,
                    h: i.height - 10
                })
            }
        }
        //console.log(this.rects)

        if(!this.showBack) {
            for(let o = 0; o < this.d.p.length; o += 14) {
                this.pfs.push(
                    new ParticleField(this.d.p[0 + o],
                        this.d.p[1 + o],
                        this.d.p[2 + o],
                        this.d.p[3 + o],
                        this.d.p[4 + o],
                        this.d.p[5 + o],
                        this.d.p[6 + o],
                        this.d.p[7 + o],
                        this.d.p[8 + o],
                        this.d.p[9 + o],
                        this.d.p[10 + o],
                        this.d.p[11 + o],
                        this.d.p[12 + o],
                        this.d.p[13 + o]
                        )
                )
            }
        }
        // user start spot
        if(this.d.u) {
            this.u = this.d.u
        }

        for(let fg = 0; fg < this.d.i[5].length; fg += 4) {
            // door
            // tatty bush / object
            let p = this.d.i[5]
            if(INTERACTIVES.includes(p[fg])) {
                // there are no doors at the back
                if(this.showBack && (p[fg] === DOOR || p[fg] === LOCKEDDOOR)) {
                    // create sign for on the door
                    let si = 195 + p[fg + 3]
                    this.d.i[5] = this.d.i[5].concat(
                        si,
                        p[fg + 1],
                        p[fg + 2],
                        0
                    )
                }
                // locked door does nothing
                if(!this.showBack && p[fg] === LOCKEDDOOR) continue;
                if(this.showBack && (p[fg] !== TATTYBUSH)) continue;
                this.interactive.push(
                    {
                        ox: p[fg + 1] - this.imgs[p[fg]].width / 2 + 20,
                        x: p[fg + 1] - this.imgs[p[fg]].width / 2 + 20,
                        y: p[fg + 2],
                        w: this.imgs[p[fg]].width - 40,
                        h: this.imgs[p[fg]].height,
                        d: p[fg + 3],
                        t: p[fg],
                        mx: (p[fg + 1] - (this.imgs[p[fg]].width / 2) + 20) + ((this.imgs[p[fg]].width - 40) / 2)
                    }
                )
            }
        }
        if(this.showBack) {

            // 13  tree
            // 15  bush
            // 17  tatty bush
            const MOVETHESEONES = [ TATTYBUSH, BUSH, FGTREE ]

            // we need to shift trees and bushes to the back

            let movethese = []

            // loop over the layers
            let inc = 4
            for(let j = 5; j >= 0; j--) {
                if(j < 5) {
                    inc = 3
                }
                let z = this.d.i[j]
                for(let bg = z.length - inc; bg >= 0; bg -= inc) {
                    if(MOVETHESEONES.includes(z[bg])) {
                        movethese.push([ z[bg], z[bg + 1], z[bg + 2] ])
                        z.splice(bg, inc)
                    }
                }
            }

            movethese.sort((a, b) => {
                return a[0] < b[0]
            })

            movethese.forEach(m => {
                m.forEach(n => {
                    this.d.i[1].push(n)
                })
            })
        }

        // triggers
        if(this.d.t) {
            let getImgRect = (x, y, i, no) => {
                return {
                    x: x,
                    y: y,
                    w: i[no].width,
                    h: i[no].height
                }
            }

            for(let i = 0; i < this.d.t.length; i += 5) {
                let tdef = this.d.t
                if(tdef[i] === 0) {
                    // bomb reveal trigger
                    // find target

                    let tlevel = tdef[i + 1]
                    let ttarget = tdef[i + 2]

                    let ti = this.d.i[tlevel][ttarget * 4]
                    let tx = this.d.i[tlevel][(ttarget * 4) + 1]
                    let ty = this.d.i[tlevel][(ttarget * 4) + 2]

                    let rlevel = tdef[i + 3]
                    let rtarget = tdef[i + 4]

                    let ri = this.d.i[rlevel][rtarget * 4]

                    // add to bombtargets
                    this.bombtargets.push(new BombRevealTrigger(getImgRect(tx, ty, this.imgs, ti), this.imgs, ti, ri))
                }
            }
        }

        this.viewport = new Viewport(this.d.v[0], this.d.v[1])
        this.isBuilding = false
    }

    update() {
        this.pfs.forEach(p => {
            p.update()
        })

        this.bombs = this.bombs.filter(b => !b.isDone())

        for(let b = 0; b < this.bombs.length; b++) {
            this.bombs[b].update()
        }
        //this.viewport.update()
    }

    draw(c, i, x, y) {
        if(!i) return
        if(!i['v']) {
            return
        }
        c.drawImage(i, x - i.width * 0.5, y, i.width, i.height)
    }

    render(c, player) {
        if(this.isBuilding || this.loading) {
            fsrect(c, palette[4])
            return
        }

        if(this.showBack) {
            fsrect(c, palette[3])
        }

        if(this.d.m && this.d.m.length > 0) {
            let meta = this.d.m
            for(let a = 0; a < meta.length; a += 5) {
                //console.log(meta[a + 4], meta[a], meta[a + 1], meta[a + 2], meta[a + 3])
                rect(c, palette[meta[a + 4]], meta[a]  + this.viewport.x, meta[a + 1], meta[a + 2], meta[a + 3], 1)
                //console.log(palette[meta[a] + 4])
            }
        }

        let inc = 3
        for(let j = 0; j < 7; j++) {
            if(j > 4) {
                inc = 4
            }
            let z = this.d.i[j]
            let l = z.length
            for(let bg = 0; bg < l; bg += inc) {

                if(this.showBack) {
                    // only draw some images
                    let id = z[bg]
                    let o = 0
                    if(id < 2) {
                        o = 0
                    }
                    if(id > 9) {
                        o = 1
                    }
                    if(id === LOCKEDDOOR) {
                        o = 12 - id + 1
                    }
                    if(id < 2 || id > 9) {
                        this.draw(c, this.imgs[id + o], z[bg + 1] + this.viewport.x, z[bg + 2])
                    }
                } else {
                    this.draw(c, this.imgs[z[bg]], z[bg + 1] + this.viewport.x, z[bg + 2])
                }

                this.pfs.filter(p => p.level === j).forEach(p => {
                    p.render(c)
                })
                if(player && player.depth === j) {
                    player.render(c)
                }
            }

            for(let b = 0; b < this.bombs.length; b++) {
                this.bombs[b].render(c)
            }

            /*this.rects.forEach(r => {
                c.strokeStyle = 'red'
                c.strokeRect(r.x, r.y, r.w, r.h)
            })

            this.interactive.forEach(r => {
                c.strokeStyle = 'yellow'
                c.strokeRect(r.x, r.y, r.w, r.h)
            })*/
        }
    }

    explosion(rect) {
        //rect.ox = rect.x
        //this.rects.push(rect)

        for(let i = 0; i < this.bombtargets.length; i++) {
            this.bombtargets[i].check(rect)
        }
    }
}

export default Level