import Game from './classes/game.js'

(function() {
    'use strict'

    // start game when page has finished loading
    window.addEventListener('load', function() {
        const canvas = document.getElementById('c')
        const ctx = canvas.getContext('2d')
        const WIDTH = 1360
        const HEIGHT = 760

        const currentState = new Game()

        // the main loop
        let tick = () => {
            currentState.update()
            ctx.clearRect(0, 0, WIDTH, HEIGHT)
            currentState.render(ctx)
            requestAnimationFrame(tick)
        }

        currentState.start()
        tick()
    })
})()