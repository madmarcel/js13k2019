let colours = []

let ctx = null

const rad = (d) => {
    return (Math.PI / 180) * d
}

const darkbrown = 6
const lightbrown = 5
const outline = 4

const r = {
    // colour
    'k': (l) => {
        ctx.fillStyle = colours[l[0]]
        ctx.strokeStyle = colours[l[0]]
    },
    // filled rectangle
    'b': (l) => {
        ctx.fillRect(l[0], l[1], l[2], l[3])
    },
    // line
    'd': (l) => {
        ctx.beginPath()
        ctx.moveTo(l[0], l[1])
        ctx.lineTo(l[2], l[3])
        ctx.stroke()
    },
    // filled polygon
    'f': (l) => {
        ctx.beginPath()
        ctx.moveTo(l[0], l[1])
        for (let i = 2; i < l.length; i += 2) {
            ctx.lineTo(l[i], l[i + 1])
        }
        ctx.fill()
    },
    // filled circle
    'i': (l) => {
        fillCircle(l[0], l[1], l[2])
    },
    // filled rounded rect
    'n': (l) => {
        roundRect(l[0], l[1], l[2], l[3], l[4], true)
    },
    // line width
    'o': (l) => {
        ctx.lineWidth = l[0]
    },
    // filled arc
    'a': (l) => {
        ctx.beginPath()
        ctx.arc(l[0], l[1], l[2], rad(l[3]), rad(l[4]), true)
        ctx.fill()
    },
    // used:
    // a, b, d, e, f, g, h, i, j, k, m, n, o, z
    'e': (l) => { // back box
        ctx.fillStyle = colours[outline]
        roundRect(l[0], l[1], l[2], l[3], 10, true)
        ctx.fillStyle = colours[darkbrown]
        roundRect(l[0] + 4, l[1] + 4, l[2] - 8, l[3] - 8, 10, true)
        ctx.fillStyle = colours[outline]
        roundRect(l[0] + 8, l[1] + 8, l[2] - 16, l[3] - 16, 10, true)
        ctx.fillStyle = colours[lightbrown]
        roundRect(l[0] + 12, l[1] + 12, l[2] - 24, l[3] - 24, 10, true)
    },
    'g': (l) => { // back bar
        ctx.fillStyle = colours[outline]
        ctx.fillRect(l[0], l[1], l[2], l[3])
        ctx.fillStyle = colours[darkbrown]
        ctx.fillRect(l[0] + 4, l[1] + 4, l[2] - 8, l[3] - 8)
    },
    'h': (l) => { // sbox
        ctx.fillStyle = colours[outline]
        roundRect(l[0], l[1], l[2], l[3], 10, true)
        ctx.fillStyle = colours[l[4] - 1]
        roundRect(l[0] + 4, l[1] + 4, l[2] - 8, l[3] - 8, 10, true)
        ctx.fillStyle = colours[l[4]]
        roundRect(l[0] + 4, l[1] + 8, l[2] - 8, l[3] - 12, 10, true)
    },
    'j': (l) => { // sbox 2
        ctx.fillStyle = colours[outline]
        roundRect(l[0], l[1], l[2], l[3], 10, true)
        ctx.fillStyle = colours[l[4] - 1]
        roundRect(l[0] + 4, l[1] + 4, l[2] - 8, l[3] - 8, 10, true)
        ctx.fillStyle = colours[l[4]]
        roundRect(l[0] + 4, l[1] + 4, l[2] - 12, l[3] - 8, 10, true)
    },
    'm': (l) => { // outline circle
        ctx.fillStyle = colours[outline]
        fillCircle(l[0], l[1], l[2])
        ctx.fillStyle = colours[lightbrown]
        fillCircle(l[0], l[1], l[2] - 4)
    },
    'p': (l) => { // ellipse
        ctx.beginPath()
        ctx.ellipse(l[0], l[1], l[2], l[3], 0, 0, rad(360))
        ctx.fill()
    },
    'z': (l) => {
        ctx.globalAlpha = 1.0 / l[0]
    }
    // NOT USING THESE
    /*
    z: (l) => {
        ctx.globalAlpha = l[0];
    },
    // stroke rectangle
    a: (l) => {
        ctx.strokeRect(l[0], l[1], l[2], l[3]);
    },
    // clear rectangle
    c: (l) => {
        ctx.clearRect(l[0], l[1], l[2], l[3]);
    },
    // stroke polygon
    e: (l) => {
        ctx.beginPath();
        ctx.moveTo(l[0],l[1]);
        for(let i = 2; i < l.length; i += 2) {
            ctx.lineTo(l[i], l[i + 1]);
        }
        ctx.closePath();
        ctx.stroke();
    },
    // text
    g: (l) => {
        ctx.font = l[0] + 'px ' + fonts[l[1]];
        ctx.fillText(texts(l[2]),l[3],l[4]);
    },
    // stroke circle
    h: (l) => {
        ctx.beginPath();
        ctx.arc(l[0], l[1], l[2], 0, rad(360), 0);
        ctx.stroke();
    },
    // filled arc

    // stroke rounded rect
    m: (l) => {
        roundRect(l[0], l[1], l[2], l[3], l[4], false);
    },
    */
}

const fillCircle = (x, y, r) => {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, rad(360), 0)
    ctx.fill()
}

// rounded rectangle
const roundRect = (x, y, w, h, r, f) => {
    let z = {tl: r, tr: r, br: r, bl: r}
    ctx.beginPath()
    ctx.moveTo(x + z.tl, y)
    ctx.lineTo(x + w - z.tr, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + z.tr)
    ctx.lineTo(x + w, y + h - z.br)
    ctx.quadraticCurveTo(x + w, y + h, x + w - z.br, y + h)
    ctx.lineTo(x + z.bl, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - z.bl)
    ctx.lineTo(x, y + z.tl)
    ctx.quadraticCurveTo(x, y, x + z.tl, y)
    ctx.closePath()
    if (f) {
        ctx.fill()
    } else {
        ctx.stroke()
    }
}

const setPallete = (c) => {
    colours = c
}

const repeatCommands = (commands, total, x, y) => {
    for (let i = 0; i < total; i++) {
        processCommands([].concat(commands), false, 0, true, x * i, y * i)
    }
}

const processCommands = (commands, flag, inc, repeat, xdel, ydel) => {
    for (let i = 0; i < commands.length; i++) {
        let c = commands[i]
        let l = c.split(',')
        const f = l.shift()
        if (f === 'x') {
            if (parseInt(l[0]) > 0) {
                // sub process, outline in black
                processCommands([].concat(commands.slice(i + 1)), true, parseInt(l[0]))
            } else {
                // it's an x 0, bail out
                if (flag) {
                    return
                }
            }
            // always skip the x commands
            continue
        }
        // repeat command
        if (f === 'r') {
            let total = parseInt(l[0])
            if (total > 0) {
                const xdelta = parseInt(l[1])
                const ydelta = parseInt(l[2])
                // find the next r
                let pi = 0
                for (let z = 1; z < commands.length; z++) {
                    if (commands[z][0] === 'r' && parseInt(commands[z][2]) < 1) {
                        pi = z
                        break
                    }
                }
                if (pi > 0) {
                    // perform the next group of commnands total times
                    repeatCommands(commands.slice(i + 1, i + 1 + pi), total, xdelta, ydelta)
                }
            } else {
                if (repeat) {
                    return
                }
            }
            // always skip the r commands
            continue
        }
        // params
        let p = l.map(Number)
        // this generates the black outline
        if (flag && inc > 0) {
            switch (f) {
            case 'k':
                p[0] = outline
                break
            case 'n':
            case 'b':
            case 'h':
            case 'j':
                p[0] -= inc
                p[1] -= inc
                p[2] += inc * 2
                p[3] += inc * 2
                break
            case 'a':
            case 'i':
            case 'm':
                p[2] += inc
                break
            case 'p':
                p[2] += inc
                p[3] += inc
                break
            }
        }
        if (repeat) {
            // apply the x and y delta to all the xy coords
            switch (f) {
            case 'n':
            case 'b':
            case 'h':
            case 'j':
            case 'a':
            case 'i':
            case 'm':
                if (xdel) {
                    p[0] += xdel
                }
                if (ydel) {
                    p[1] += ydel
                }
                break
            case 'd':
                if (xdel) {
                    p[0] += xdel
                    p[2] += xdel
                }
                if (ydel) {
                    p[1] += ydel
                    p[3] += ydel
                }
                break
            }
        }
        // console.log(f, l[0]);
        // there's a good chance you could replace a big chunk
        // of this file by using this:
        // let path = new Path2D('m100,100v50h50v-50')
        // ctx.stroke(path)
        //
        r[f](p)
    }
}

const vgrender = (newctx, data) => {
    // console.log('[' + data + ']');
    let commands = data.split(/([a-z],[\d+,*]+)/).filter(s => s !== '')
    // console.log(commands);
    if (!commands) return
    ctx = newctx
    ctx.lineWidth = 1
    processCommands(commands, false, 0, false, 0, 0)
}

const replaceItem = (txt, target, sentence) => {
    const reg = new RegExp(`k,${txt}`, 'gi')
    return sentence.replace(reg, `k,${target}`)
}

export { vgrender, setPallete, replaceItem }
