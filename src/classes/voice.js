let synth = null
let voices = null
let visready = false

if(window.speechSynthesis) {
    synth = window.speechSynthesis
    voices = synth.getVoices()
    if (voices.length <= 0) {
        // chrome takes a while to load the voices
        synth.onvoiceschanged = function() {
            voices = synth.getVoices()
            visready = true
            /*voices.forEach(v => {
                console.log(v.name)
            })*/
        };
    } else {
        // firefox doesn't need to wait
        visready = true
        /*voices.forEach(v => {
            console.log(v.name)
        })*/
    }
}

let findVoice = (male) => {
    if(!visready) return
    for(let i = 0; i < voices.length; i++) {
        if(voices[i].name.indexOf('Google UK') > -1) {
            if(male && voices[i].name.indexOf(' Male') > -1) {
                return i
            }
            if(!male && voices[i].name.indexOf(' Female') > -1) {
                return i
            }
            //return i
        }
        if(voices[i].name.indexOf('English') && voices[i].name.indexOf('Google') < 0) {
            return i
        }
    }
}

let say = (text, p, r, i) => {
    if(!visready) return
    let u = new SpeechSynthesisUtterance(text)
    u.voice = voices[i]
    u.pitch = p // 0 - 2.0
    u.rate = r // 0 - 2.0
    synth.speak(u)
}

export { findVoice, say }