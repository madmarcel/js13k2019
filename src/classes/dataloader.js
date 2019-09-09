import * as vg from './mv.js'
import { imagedata, palette, PLAYERPARTS } from './data'
import * as util from './util'

const createCanvas = (w, h) => {
    let bf = document.createElement('canvas')
    bf.width = w
    bf.height = h
    let bc = bf.getContext('2d')
    // we need both. We draw our stuff on the 2d context for this canvas,
    // and in turn we pass the canvas element when we want to draw our stuff on another canvas
    return [bc, bf]
}

const generateImages = () => {
    let images = []

    vg.setPallete(palette)

    let d = imagedata
    for(let i = 0; i < d.length; i += 3) {
        let w = d[i]
        let h = d[i + 1]
        let r = d[i + 2]

        let [img, cv] = createCanvas(w,h)
        vg.vgrender(img, r)
        images.push(cv)
    }

    return generateAnimations(images)
}

// generate all the animated frames for the player character
// this relies on all the art being the same size and each part in the image being centered
// on the desired rotation point (at the center of the image)
const generateAnimations = (images) => {
    const BODY = images[PLAYERPARTS]
    const HEAD = images[PLAYERPARTS + 1]
    const ARM = images[PLAYERPARTS + 2]
    const LEG = images[PLAYERPARTS + 3]

    const TOTALFRAMES = 10

    const ARMARC = 65
    const LEGARC = 85

    // draw the basic player sprite
    // 130 x 170
    let larm_arc_inc = (0 + ARMARC) / TOTALFRAMES
    let rarm_arc_inc = (0 - ARMARC) / TOTALFRAMES

    let lleg_arc_inc = (0 - LEGARC) / TOTALFRAMES
    let rleg_arc_inc = (0 + LEGARC) / TOTALFRAMES

    let larm_arc = -65
    let rarm_arc = 65

    let lleg_arc = 85
    let rleg_arc = -85

    let yoff = -1
    let toff = -4
    let tinc = 0.5
    let yinc = 0.25

    for(let f = 0; f < TOTALFRAMES * 2; f++) {
        let [el, cv] = createCanvas(130, 170)
        util.drawImage(el, ARM, 130 / 2 + 22, (170 / 2) + 32 + yoff + toff, ARM.width, ARM.height, rarm_arc, false, false, true) // right arm

        util.drawImage(el, LEG, 130 / 2 + 10, (170 / 2) + 50 + toff, LEG.width, LEG.height, rleg_arc, false, false, true) // right leg
        util.drawImage(el, LEG, 130 / 2 - 10, (170 / 2) + 50 + toff, LEG.width, LEG.height, lleg_arc, false, false, true) // left leg

        util.drawImage(el, BODY, 130 / 2, (170 / 2) + yoff + toff, BODY.width, BODY.height, 0, false, false, true)
        util.drawImage(el, HEAD, 130 / 2, (170 / 2) + 16 + yoff + toff, HEAD.width, HEAD.height, 0, false, false, true)
        util.drawImage(el, ARM, 130 / 2 - 24, (170 / 2) + 32 + yoff + toff, ARM.width, ARM.height, larm_arc, false, false, true) // left arm
        images.push(cv)

        larm_arc += larm_arc_inc
        rarm_arc += rarm_arc_inc
        lleg_arc += lleg_arc_inc
        rleg_arc += rleg_arc_inc
        yoff += yinc
        toff += tinc
        if(f == 6) { // reverse the body/head/arm bob
            tinc = -0.5
            yinc = -0.25
        }
    }
    return generateLens(images)
}

// this generates huge sprites for the lens effect, and uses the composite operation to chop out a circle
const generateLens = (images) => {
    const w = 2500
    const h = 2500

    //console.log(images.length)

    for(let i = 0; i < 80; i++) {
        let [img, cv] = createCanvas(w,h)

        //util.rect(cv, '#000', 0, 0, w, h)
        img.fillStyle = palette[4]
        img.fillRect(0, 0, w, h)
        img.globalCompositeOperation = 'destination-out'
        //drawCircle(cv, projectile.radius + 20, projectile.radius, projectile.radius)
        img.beginPath()
        img.arc(w / 2, h / 2, (i + 1) * 20, 0, util.rad(360), 0)
        img.fill()
        img.globalCompositeOperation = 'source-over'

        images.push(cv)
    }
    //console.log(images.length)

    return images
}

export { generateImages }
