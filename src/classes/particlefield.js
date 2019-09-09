import { timestamp, randomint } from './util'

class ParticleField {
    constructor(x, y, w, h, colour, qty, max, speedy, speedx, interval, level, randalpha, minsize, maxsize) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.colour = colour
        this.qty = qty

        this.particles = []
        this.ts = timestamp()
        this.interval = interval

        this.max = max
        this.sy = speedy
        this.sx = speedx
        this.level = level
        this.ra = randalpha

        this.RAD360 = (Math.PI/180) * 360

        this.ms = minsize
        this.mx = maxsize
    }

    update() {

        let t = this.particles.length - 1
        for(let i = t; i >= 0; i--) {
            let p = this.particles[i]
            p.y += p.sy
            p.x += p.sx
            if(this.sy > 0) {
                if(p.y >= this.y + this.h || p.x >= this.x + this.w) {
                    p.dead = true
                }
            }
            if(this.sy < 0) {
                if(p.y <= this.y) {
                    p.dead = true
                }
            }
            if(this.sx > 0) {
                if(p.x > this.x + this.w) {
                    p.dead = true
                }
            }
        }

        let now = timestamp()
        if(now > this.ts + this.interval && this.particles.length < this.max) {
            for(let z = 0; z < this.qty; z++) {

                let yorigin = this.y
                let ydelta = this.sy > 0 ? this.sy : 0
                if(this.sy < 0) {
                    yorigin = this.y + this.h
                    ydelta = this.sy
                }

                this.particles.push({
                    x: randomint(this.x, this.x + this.w),
                    y: yorigin,
                    r: randomint(this.ms, this.mx),
                    sy: ydelta,
                    sx: this.sx > 0 ? randomint(this.sx, this.sx + 2) : 0,
                    a: this.ra ? 1.0 / randomint(1, 5) : 1
                })
            }
            this.ts = now
        }

        this.particles = this.particles.filter( p => !p.dead)
    }

    render(c) {
        c.fillStyle = this.colour
        for(let i = 0; i < this.particles.length; i++) {
            c.globalAlpha = this.particles[i].a
            c.beginPath()
            c.arc(this.particles[i].x, this.particles[i].y, this.particles[i].r, 0, this.RAD360, 0)
            c.fill()
        }
        /*

        this.particles.forEach(p => {
            c.globalAlpha = p.a
            c.beginPath()
            c.arc(p.x, p.y, p.r, 0, rad(360), 0)
            c.fill()
        })*/
        c.globalAlpha = 1.0
        /*c.strokeStyle = 'red'
        c.strokeRect(this.x, this.y, this.w, this.h)*/
    }
}

export default ParticleField