const WAVES = {
  TRIANGLE: 'triangle',
  SINE: 'sine',
  SQUARE: 'square',
  SAWTOOTH: 'sawtooth'
}

let acx;
let cuedTime = 0;
let musicVolume = 1;
const sounds = {};
const standard = {
  'crash': [.6,],
  'hat':   [  ,  ,.7,.5,  ,  ,.7,  ,  ,  ,.7,  ,  ,  ,  ,  ,],
  'ride':  [  ,  ,  ,  ,.6,  ,  ,  ,.6,  ,  ,  ,.6,  ,  ,  ,],
  'snare': [  ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,.2,.2, 1,.2,],
  'foot':  [ 1,  ,  ,  ,  ,  ,  ,  ,.2,  , 1, 1,.2,  ,  ,  ,],
  'wiggle':[  ,  ,  ,  ,.4,  ,  ,  ,.6,.6,.6,.6,.8,  ,.8,  ,],
  'geet':  [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,.4,  ,  ,  ,  ,  ,],
};
const bridge = {
  'crash': [ 1],
  'ride':  [  ,  ,  ,  ,.6,  ,  ,  ,.6,  ,  ,  ,.6,  ,  ,  ,],
  'foot':  [ 1,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,],
  'snare': [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,.6,.4,.8,.4,],
  'mid':   [ 1,  ,  , 1,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ,  ,],
  'wiggle':[ 1,  ,  , 1,  ,  , 1,  ,  ,  , 1,  ,  ,  , 1,  ,],
}
const buffSz = 22050;
const segments = 16;
const interval = 60 / 4 / 108;
let bar = -1;
let segment = 16;
const rand = (limit) => (Math.random() < limit);
const randSign = (limit = 1) => 2 * Math.random() * limit - limit;
let timeout;
let playing = false;
const sequencer = {
  ticker: () => {
    if (!acx) {
      return;
    }
    timeout = setTimeout(sequencer.ticker, 250);
    const end = acx.currentTime + 1;
    while(cuedTime < end) {
      if (++segment > segments) {
        segment = 1;
        bar ++;
      }
      cuedTime += interval;
      const prog = (~~(bar / 4) % 3 === 2) ? bridge : standard;
      for (const drum of Object.keys(prog)) {
        if (rand(prog[drum][segment - 1] )) {
          if (drum === 'geet' || drum === 'mid') {
            let pitch = 55;
            let volDivider = 30 / musicVolume;
            let duration = 1.2;
            if (bar % 4 > 2) {
              pitch = 27.5 * 1.4983070768766817;
            }
            if (drum === 'mid') {
              pitch *= 2;
              volDivider *= 16;
              duration *= 3;
            }
            sounds.geet(cuedTime, duration, pitch, prog[drum][segment - 1] / volDivider);
          } else if (drum === 'wiggle') {
            let pitch = 440;
            if ( segment % 2 === 0 ) { pitch = 97.998859 * 4; }
            if ( rand(.8)) { pitch = 130.81278265 * 4; }
            sounds.organic(cuedTime, pitch, 5000, 4000, 1 * musicVolume);
            if (rand(.6)) { sounds.organic(cuedTime, pitch * 2, 5000, 4000, .5 * musicVolume); }
          } else {
            sounds[drum](cuedTime);
          }
        }
      }
    }
  }
};

const create = () => {
  if (!!cuedTime) { return; }
  acx = new ( window.AudioContext || window.webkitAudioContext )();
  const createBuffer = (genFunction) => {
    const buffer = acx.createBuffer(1, buffSz, acx.sampleRate);
    buffArray = buffer.getChannelData(0);
    for (let i = 0; i < buffSz; i++) {
      buffArray[i] = genFunction(i);
    }
    return buffer;
  };
  const createNoiseBuffer = () => createBuffer(randSign);
  const createDistBuffer = () => createBuffer(i => (Math.PI + 50) * i / (Math.PI + 50 * Math.abs(i)));
  const distBuffer = createDistBuffer();
  const noiseBuffer = createNoiseBuffer();
  sounds.white = (
    time = acx.currentTime,
    peakHz,
    qFactor,
    maxVol,
    duration
  ) => {
    const noise = acx.createBufferSource();
    const gainr = acx.createGain();
    const filter = acx.createBiquadFilter();
    const length = duration + randSign(duration / 2);
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.connect( filter );
    filter.connect( gainr );
    filter.type = 'bandpass';
    filter.frequency.value = peakHz + randSign( peakHz / 6 );
    filter.Q.value = qFactor;
    gainr.connect( acx.destination );
    gainr.gain.setValueAtTime( maxVol / 60, time );
    gainr.gain.exponentialRampToValueAtTime( 1e-14, time + length );
    noise.start( time );
    noise.stop( time + length);
    setTimeout(() => {
      noise.disconnect()
    }, 1000 + Math.round(length * 1000));
  };
  sounds.slider = (
    time = acx.currentTime,
    hz,
    duration,
    vol = 1,
    hzTo = hz,
    volTo = 1e-4,
    type = WAVES.SINE
  ) => {
    const osc = acx.createOscillator();
    const gainr = acx.createGain();
    osc.type = type;
    osc.connect( gainr );
    gainr.connect( acx.destination );
    osc.frequency.setValueAtTime( hz, time );
    gainr.gain.setValueAtTime( vol, time );
    osc.frequency.exponentialRampToValueAtTime( hzTo, time + duration );
    gainr.gain.exponentialRampToValueAtTime( volTo, time + duration );
    osc.start( time );
    osc.stop( time + duration );
    setTimeout(() => {
      osc.disconnect();
    }, 1000 + Math.round(duration * 1000));
  };
  sounds.organic = (
    time = acx.currentTime,
    hzPeak,
    qFactor,
    maxVol,
    duration,
    hzTo = 0
  ) => {
    const noise = acx.createBufferSource();
    const gainr = acx.createGain();
    const filter = acx.createBiquadFilter();
    const length = duration + randSign( duration / 12 );

    noise.buffer = distBuffer;
    noise.loop = true;
    gainr.gain.value = 0;
    noise.connect( filter );
    filter.connect( gainr );
    filter.type = 'bandpass';
    filter.frequency.value = hzPeak;
    filter.Q.value = qFactor;
    gainr.connect( acx.destination );
    gainr.gain.setValueAtTime( 0.01, time );
    gainr.gain.exponentialRampToValueAtTime( maxVol, time + .05  );
    gainr.gain.exponentialRampToValueAtTime( 0.75, time + length );
    if (hzTo) {
      filter.frequency.setValueAtTime(hzPeak, time + .01);
      filter.frequency.exponentialRampToValueAtTime( hzTo, time + length / 8);
    }
    noise.start( time );
    noise.stop( time + length );
    setTimeout(() => {
      noise.disconnect()
    }, 1000 + Math.round(length * 1000));
  }
  sounds.foot = time => {
    sounds.slider( time, 90 + randSign( 5 ), .9, 1, 10, 0.001, WAVES.SINE );
    sounds.slider( time, 160 + randSign( 15 ), .15, .8, 80, 0.001, WAVES.TRIANGLE);
    sounds.white( time, 1000, 2, .7 * musicVolume * musicVolume, .1 );
  },
  sounds.hat = time => {
    sounds.white( time, 8000, .8, .5 * musicVolume * musicVolume, .3 );
  },
  sounds.snare = time => {
    sounds.slider( time, 200 + randSign( 10 ), .1, .8 * musicVolume, 100, 0.001, WAVES.TRIANGLE);
    sounds.white( time, 2500, 1.5, 1.2 * musicVolume * musicVolume, .4 );
  },
  sounds.crash = time => {
    sounds.white( time, 12000, 1, .05 * musicVolume * musicVolume, 1.5 );
    sounds.white( time, 6000, 2, .06 * musicVolume * musicVolume, 2 );
    sounds.white( time, 500, 1, .04 * musicVolume * musicVolume, 3 );
  },
  sounds.ride = time => {
    sounds.white(  time, 5000, 2, .175 * musicVolume * musicVolume, .7 );
    sounds.white(  time, 400, .6, .05 * musicVolume * musicVolume, 1 );
  }
  sounds.geet = ( current, time, lowHz, vol ) => {
    var fifth = lowHz * 1.4983070768766817;
    var v = 50000 * vol;
    var k = 5000;
    var gap = randSign(.01) + .02;
    sounds.organic(current - gap, lowHz, k, v*40, time);
    sounds.organic(current + gap, lowHz * 2, k, v*30, time / 1.4);
    sounds.organic(current + gap*3, lowHz * 3, k, v*8, time / 1.8);
  }
};
const playMusic = () => {
  if (!playing) {
    sequencer.ticker()
    playing = true
  }
}
const pauseMusic = () => {
  if (playing) {
    clearTimeout(timeout)
    playing = false
  }
};

const jump = () => {
  sounds.slider(acx.currentTime, 110, .8, 12, 1760, 1e-4, WAVES.SQUARE)
};

const explode = () => {
  const time = acx.currentTime;
  sounds.organic(time, 55, 5000, 1e7, 1)
  sounds.white(time, 110, 1, 600, 2)
}

const throwit = () => {
  sounds.slider(acx.currentTime, 440, .5, 6, 220, 1e-3, WAVES.TRIANGLE)
  sounds.white(acx.currentTime, 440,  1, .15, 1)
}

const transition = () => {
  sounds.geet(acx.currentTime, 4, 220, .016);
  setTimeout(() => sounds.geet(acx.currentTime, 4, 261.625565301, .014), 100);
  setTimeout(() => sounds.geet(acx.currentTime, 4, 329.627556913, .012), 200);
  setTimeout(() => sounds.geet(acx.currentTime, 4, 391.995435982, .01), 300);
}

const goBack = () => {
  musicVolume = .18;
}
const goFront = () => {
  musicVolume = .8;
}

const testSounds = {
  crunch: () => {
    sounds.white(acx.currentTime, 100, 1, 12000, .3);
    sounds.white(acx.currentTime, 6000, 1, 8000, .1);
  },
  blup: () => {
    sounds.slider(acx.currentTime, 440, .4, 6, 600, 1e-6, WAVES.SQUARE);
    () => sounds.slider(acx.currentTime, 880, .2, 6, 600, 1, WAVES.SAWTOOTH);
  },
  wheep: () => {
    sounds.slider(acx.currentTime, 880, .6, 6, 1760, .2, WAVES.TRIANGLE);
  },
  nah: () => {
    sounds.slider(acx.currentTime, 110, .1, 6, 110, .2, WAVES.SAWTOOTH);
  },
  nahnah: () => {
    testSounds.nah();
    setTimeout(testSounds.nah, 140);
  },
  touch: () => {
    sounds.white(acx.currentTime, 880, 1, 16000, .15);
  }
}

const splat = () => {
  sounds.slider(acx.currentTime, 55, .5, 200, 110, 1e-3, WAVES.SINE);
  sounds.white(acx.currentTime, 500, 1, 12000, .8);
  sounds.white(acx.currentTime, 6000, 1, 8000, .2);
}

export { create, jump, playMusic, pauseMusic, explode, throwit, transition, goBack, goFront, splat, testSounds }
