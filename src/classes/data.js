const imagedata = [
    // ground - full
    1360,70,'h,0,2,1360,70,10',
    // ground title
    1076,70,'h,0,2,1076,70,10',
    // waterfall 1
    256,420,'h,84,0,38,36,3h,0,16,256,402,15',
    // rock layer 2
    1360,768,'h,584,464,506,270,10h,1026,454,76,142,3h,998,576,122,154,3h,1314,480,88,186,3h,1296,648,88,82,3r,10,20,0k,1i,1122,716,12r,0',
    // waterfall 2
    275,230,'h,0,0,272,230,15',
    // water fg
    310,150,'h,0,0,310,146,15',
    // bg trees 6
    1360,768,'k,4b,166,0,100,760b,440,0,98,760b,840,0,98,760b,1104,0,98,760b,238,394,92,40b,370,232,100,44b,516,136,88,40b,114,180,72,46b,780,198,100,46b,914,444,90,40b,1054,140,98,44b,1174,370,88,38i,1058,162,22i,370,254,22i,114,202,22i,602,156,19i,328,414,20i,780,220,22i,1004,464,19i,1264,390,19',
    // single bg tree 7
    350,760,'k,4b,166,0,100,760b,238,394,92,40b,114,180,72,46i,114,202,22i,328,414,20',
    // dark bush - 8
    195,120,'x,4k,4i,44,74,39i,92,44,39i,144,74,39b,50,50,96,64x,0',
    // building shadow - 9
    100,800,'z,2k,0n,0,64,100,660,20z,3n,0,0,100,64,20z,1',

    // rock layer 10
    1360,768,'h,406,92,616,650,10h,700,356,94,134,3h,1228,90,250,442,10h,1216,84,50,90,3h,1212,160,88,176,3h,1224,316,66,132,3h,1220,434,112,72,3r,5,20,0k,1i,1102,492,12r,0h,1176,468,70,64,3h,760,410,76,98,3h,976,82,50,162,3h,960,226,76,122,3h,940,328,106,152,3',
    // rock layer 11 - BACK
    1360,768,'e,1070,102,38,46e,974,82,54,74e,1216,84,50,60e,406,92,614,670e,1014,116,222,644e,1230,90,130,670',

    // door - open - 12
    114,180,'k,4n,0,0,114,188,20k,5n,6,4,104,102,20k,6n,4,8,106,166,20k,4n,10,16,94,160,20',
    // door - BACK - 13
    114,180,'k,6n,0,0,114,188,20k,5n,6,4,104,102,20n,4,8,106,166,20k,6n,28,32,60,60,10k,5n,29,33,58,58,10k,4i,58,40,4',

    // single fg tree - 14
    550,760,'k,6j,314,0,126,760,6k,4b,408,160,32,12b,318,396,32,8h,394,122,136,46,6m,524,144,22m,524,144,15m,524,144,8h,246,346,132,52,6k,6b,340,96,72,330m,252,372,25m,252,372,17m,252,372,11',
    // single fg tree - BACK 15
    550,760,'e,416,122,130,48e,226,346,134,52e,314,0,126,760g,322,170,110,14g,322,370,110,14g,322,570,110,14k,9b,350,432,34,52k,2b,370,466,28,38',

    // bush - 16
    195,120,'x,4k,9i,44,74,39i,92,44,39i,144,74,39b,50,50,96,64x,0k,10i,42,76,37i,146,76,37i,92,50,40b,48,72,96,42',
    // fg bush - BACK - 17
    195,120,'x,4k,6i,44,74,39i,92,44,39i,144,74,39b,50,50,96,64x,0x,4k,5i,42,74,32i,146,74,32i,92,48,36b,48,72,96,34x,0g,86,8,12,102',

    // tatty bush - 18
    195,120,'x,4k,9i,44,74,39i,92,44,39i,144,74,39b,50,50,96,64x,0k,10i,42,76,37i,146,76,37i,92,50,40b,48,72,96,42k,9o,2d,56,40,134,40d,132,40,134,114k,6b,102,42,28,20k,9f,124,84,96,40,132,52k,10i,106,74,20i,92,76,33',
    // tatty bush - BACK - 19
    195,120,'x,4k,6i,44,74,39i,92,44,39i,144,74,39b,50,50,96,64x,0x,4k,5i,42,74,32i,146,74,32i,92,48,36b,48,72,96,34x,0g,86,8,12,102k,4f,70,40,56,66,86,66b,68,64,6,18',

    // window - 20
    140,140,'k,4n,0,0,114,120,20k,5n,4,4,106,112,20k,6n,4,8,106,108,20k,4n,10,14,94,96,20k,6o,6d,8,62,108,62d,58,10,58,114',
    // window - BACK 21
    140,140,'k,3n,10,14,94,96,20o,6k,5d,8,62,108,62d,58,10,58,114',

    // light blue house 22
    344,800,'x,4k,14n,4,76,334,614,10x,0h,0,0,344,74,8',
    // light blue house - BACK 23
    344,800,'e,0,72,340,620e,0,0,340,74g,8,232,324,12g,8,482,324,12k,9b,266,510,40,44k,2b,250,540,32,36',

    // big blue house 24
    588,800,'x,4k,15n,4,76,578,614,10x,0h,0,0,588,74,12',
    // big blue house - BACK 25
    588,800,'e,0,72,586,622e,0,0,588,74g,8,244,570,12g,8,444,570,12g,254,452,12,234k,9b,374,128,36,48k,8b,364,156,36,38k,9b,510,576,30,38',

    // a bunch of handy walls and platforms
    // light green ceiling 26
    914,80,'h,2,2,912,68,10',
    // brown wall 27
    50,622,'h,2,2,46,620,6',
    // medium platform 28
    490,62,'h,2,2,486,60,15',
    // purple floor 29
    914,80,'h,2,2,912,68,3',

    // decorations

    // dark window - dark green wall 30
    140,140,'k,4n,10,14,94,96,20o,6k,16d,8,62,108,62d,58,10,58,114',

    // crate 31
    116,106,'k,6g,16,70,90,22g,16,52,90,22g,16,34,90,22g,16,16,90,22g,2,82,114,22g,2,0,114,22g,96,0,20,104g,0,2,20,104f,20,98,96,6,96,44f,18,70,98,6,22,104o,4k,4d,18,78,100,4d,20,104,96,38k,5b,26,16,18,24',

    // small platform 32
    102,42,'h,2,2,100,40,15',

    // small room floor 33 - purple
    590,62,'h,2,2,590,60,3',
    // small room ceiling 34 - green
    590,80,'h,2,2,590,68,10',
    // dark window - light purple wall 35
    140,140,'k,4n,10,14,94,96,20o,6k,2d,8,62,108,62d,58,10,58,114',

    // bomb - green
    42,50,'x,4k,9b,18,4,6,22x,0x,4k,10i,20,26,16k,9x,0i,21,25,15',
    // bomb - red
    42,50,'x,4k,12b,18,4,6,22x,0x,4k,12i,20,26,16x,0',
    // bomb - white
    42,50,'x,4k,1b,18,4,6,22x,0x,4k,1i,20,26,16x,0',
    // fuse 1 - star 1 - white
    30,30,'k,4f,8,16,22,30,18,0f,12,24,0,8,30,12f,10,10,2,26,18,24k,1f,12,22,4,10,24,14f,10,16,20,26,16,4f,12,10,6,22,16,20',
    // fuse 2 - star 2 - red
    30,30,'k,4f,8,16,22,30,18,0f,12,24,0,8,30,12f,10,10,2,26,18,24k,8f,12,22,4,10,24,14f,10,16,20,26,16,4f,12,10,6,22,16,20',
    // fuse 3 - star 3 - yellow 41
    30,30,'k,4f,8,16,22,30,18,0f,12,24,0,8,30,12f,10,10,2,26,18,24k,7f,12,22,4,10,24,14f,10,16,20,26,16,4f,12,10,6,22,16,20',

    // explosion
    // small 1
    220,235,'k,4f,100,124,98,78,76,116f,100,150,138,156,104,128f,66,140,68,120,32,124k,7f,34,124,82,142,98,120f,96,144,128,152,102,130f,96,124,94,86,78,118x,4k,12i,76,116,15i,96,124,15i,68,146,15i,92,146,15x,0k,11i,92,126,16i,76,120,16i,70,144,16i,90,142,16k,1i,80,126,8i,80,136,8k,7i,100,120,6i,60,146,6',
    // medium 2
    220,235,'k,4f,154,142,74,118,76,148f,108,80,78,126,102,126f,30,144,82,144,74,122f,100,190,104,150,76,142k,7f,100,188,100,146,86,144f,34,142,90,142,86,130f,106,84,90,114,104,118f,140,142,110,130,106,142x,4k,12i,114,122,15i,84,110,15i,68,130,15i,76,154,18i,102,146,18x,0k,11i,84,114,16i,110,124,16i,72,132,16i,76,150,16i,98,146,16k,7i,84,130,9i,96,134,9i,84,140,9i,116,120,5i,80,106,5i,58,130,5',
    // big 3
    220,235,'k,4f,116,146,80,164,130,234f,140,106,146,144,220,102f,82,80,126,86,122,4f,54,130,76,90,0,52f,70,174,54,142,4,196k,7f,110,150,84,160,126,224f,136,110,142,138,210,104f,90,76,120,80,118,20f,54,120,66,92,4,58f,62,176,54,150,8,192x,4k,12i,44,136,29i,80,96,32i,122,100,32i,128,154,32i,80,168,32x,0k,11i,86,96,32i,116,100,29i,56,134,29i,82,160,29i,120,150,29k,7i,86,120,13i,100,126,13i,84,136,13i,102,104,5i,64,128,5i,58,92,11i,68,78,5i,118,80,13i,130,90,6i,34,140,6',
    // smoke 1
    220,235,'x,4k,3i,24,162,11i,62,194,11i,70,70,11i,134,180,17i,146,144,10i,24,120,10i,112,68,10i,124,82,10i,136,110,11i,90,104,7i,94,196,7i,44,94,7x,0',
    // smoke 2 46
    220,235,'x,4k,3i,57,192,8i,151,180,8i,149,100,8i,149,100,4i,19,164,8i,21,108,8i,91,210,4i,41,86,8i,61,56,8i,151,140,6i,99,74,4i,111,54,4i,133,72,4x,0',

    // crack in light purple wall 47
    100,170,'k,4b,25,41,62,96k,6n,31,79,18,24,5n,53,79,22,24,5n,27,51,48,24,5n,29,107,48,24,5k,2f,51,141,93,51,91,145f,61,23,75,103,99,29f,5,39,27,99,75,29f,11,145,25,85,65,157k,4o,4d,67,35,29,97d,65,35,73,99d,31,95,55,141d,55,139,73,93d,55,139,49,155d,51,153,57,167d,65,39,61,15d,61,17,71,7',
    // hole in wall 48
    114,180,'k,4n,10,16,94,160,20k,2f,90,120,110,162,112,94f,96,74,108,118,110,28f,106,60,114,16,76,16f,46,30,114,16,24,14f,6,74,34,10,8,10f,6,124,24,88,6,60f,4,172,20,154,6,60f,44,180,2,174,34,138f,84,180,32,176,56,154f,116,176,70,180,86,146f,112,124,110,180,74,144',

    // number card 49
    72,72,'x,4k,14n,4,4,64,64,5x,0k,5i,36,18,6k,4i,36,16,4',
    // locked door 50
    114,180,'k,4n,0,0,114,188,20k,5n,6,4,104,102,20k,6n,4,8,106,166,20k,4n,10,16,94,160,20k,10n,14,20,86,160,20k,9d,26,22,26,188d,46,20,46,188d,66,20,66,188d,86,22,86,188n,76,82,18,34,5k,4i,85,92,6n,81,90,8,20,5',

    // player
    // full body back
    130,170,'x,4k,9n,54,116,4,22,5x,0x,4k,8n,52,138,8,12,5n,42,142,14,8,5x,0k,3o,4d,42,148,60,148k,12d,52,140,60,140k,10d,56,116,56,128x,4k,9n,78,116,4,22,5x,0x,4k,8n,76,138,8,12,5n,80,142,14,8,5x,0k,3o,4d,76,148,94,148k,12d,76,140,84,140k,10d,80,116,80,128x,4k,5i,94,126,5x,0x,4k,9n,90,98,8,22,5x,0x,4k,5i,44,126,5x,0x,4k,9n,40,98,8,22,5x,0x,4k,14n,49,78,40,42,5x,0o,4k,2d,49,94,89,94k,4d,49,114,89,114x,4k,5n,38,32,62,56,10i,34,72,7i,104,72,7x,0o,4k,8d,40,65,100,65x,4f,36,0,64,22,40,36f,22,10,56,20,38,44k,7f,40,6,60,24,44,32f,30,18,56,24,44,40n,32,24,72,36,10a,68,43,34,0,180x,0',
    // part head front
    130,170,'o,4x,4k,5n,61,84,16,16,5x,0k,4d,54,90,86,90n,44,30,50,48,5k,5n,48,34,42,52,5b,44,64,50,24k,8i,48,74,7i,90,74,7k,4d,58,82,80,82p,76,62,4,8p,60,62,4,8k,14i,76,64,2i,60,64,2',

    // body 52 <--- !!
    130,170,'x,4k,14n,44,94,40,42,5x,0o,4k,2d,44,110,84,110x,4k,5n,58,96,16,16,5x,0k,4d,44,130,84,130',
    // head 29
    130,170,'x,4k,5n,38,32,62,56,10i,34,72,7b,86,70,20,6x,0o,4k,4d,68,82,80,82p,80,62,4,8p,90,62,4,8k,8i,54,74,7k,14i,82,64,2i,92,64,2x,4f,36,0,64,22,40,36f,22,10,56,20,38,44f,126,38,102,42,102,22k,7f,40,6,60,24,44,32f,30,18,56,24,44,40f,118,36,92,40,94,26n,30,22,26,40,10a,60,40,20,0,180a,82,40,24,0,180x,0k,8d,60,42,100,42k,4d,56,38,110,38',
    // arm 30
    130,170,'x,4k,5i,66,110,5x,0x,4k,9n,62,82,8,22,5x,0',
    // leg 31
    130,170,'x,4k,9n,62,82,4,22,5x,0x,4k,8n,60,104,8,12,5n,64,108,14,8,5x,0k,3o,4d,60,114,78,114k,12d,60,106,68,106k,10d,64,82,64,94',

    // player will be inserted here
    // player sprites - 32 ->

    // lens images will be inserted here

    // bomb sprites will be inserted here

    // number cards go here


    // wallpaper - 100 x 1000
    //100,1000,'r,10,100,0k,4b,0,0,100,100o,4k,3d,25,100,25,0d,75,100,75,0k,4b,60,14,30,30b,12,54,30,30k,2k,3i,25,69,8i,75,29,8r,0',
]

const PLAYERPARTS = 53
const DOOR = 12
const LOCKEDDOOR = 50
const TATTYBUSH = 18
const BUSH = 16
const FGTREE = 14
const HOLEINWALL = 48
const INTERACTIVES = [ DOOR, TATTYBUSH, HOLEINWALL, LOCKEDDOOR ]
const LENSSTART = PLAYERPARTS + 24
const BOMBSTART = LENSSTART + 80

const palette =  [
    '#000',
    '#fff',
    '#8c8fae',
    '#584563',
    '#3e2137',
    '#d79b7d',
    '#9a6348',
    '#f5edba',
    '#d26471',
    '#c0c741',
    '#647d34',
    '#e4943a',
    '#9d303b',
    '#70377f',
    '#7ec4c1',
    '#34859d',
    '#17434b',
    '#1f0e1c'
]

const leveldata = [
    {
        // title / waterfall
        v: [1360, 0],
        i: [
            [   // images - background
                // trees
                7, 100, 0,
                7, 500, 0,
                7, 900, 0,
                7, 1260, 0,
                8, 50, 590,
                8, 350, 590
            ],
            [   // images - middle 1
                // waterfall
                2, 992 + 120, 104
                //1, 1366 / 2, 100,
                //2, 1360 /2, 0
            ],
            [   // images - middle 2
                // rock layer 1
                10, 1360 / 2, 0,
                14, 180, -20
            ],
            [  // images - middle 3
               // water fall 2
               4, 1074 + 120, 494
            ],
            [  // images - middle 4
                // rock layer 2
                3, 1360 / 2, 0
            ],
            [  // images - middle 5
                // foreground water
                5, 1064 + 150,716, 0,
                16, 195, 590, 0,
                18, 390, 590, 0, // tatty bush
                12, 700, 550, 1  // door
            ],
            [ // foreground
                1, 1076 / 2, 768 - 65, 1
            ]
        ],
        p: [  // particle fields
            1030, 124, 186, 370, '#fff', 1, 30, 4, 0, 200, 1, true, 2, 4,
            1100, 500, 210, 210, '#fff', 1, 30, 4, 0, 200, 3, true, 2, 4,
            1100, 708, 210, 4, '#fff', 1, 50, 0.1, 0, 1, 3, false, 10, 12,
            1100, 476, 110, 4, '#fff', 1, 50, 0.1, 0, 1, 1, false, 10, 12,
            1100, 716, 300, 60, '#fff', 1, 50, 0, 1, 100, 5, true, 2, 5
        ]
    },
    {
        // start - long, big house
        v: [1360 * 2, 0],
        m: [],
        i: [
            [   // images - background
                // trees
                6, 1360 / 2 - 10, 0,
                6, 1360 + 1360 / 2, 0,
                8, 50, 590,
                8, 150, 590, // dark bushes
                8, 1360, 590,
                8, 1200, 590,
                8, 2200, 590,
                8, 1950, 590,
            ],
            [   // images - middle 1
            ],
            [   // images - middle 2
                24, 880, 28,
                9, 620, 38,
                22, 450, 28,
                22, 2500, 400
            ],
            [  // images - middle 3
                14, -20, -20,
                14, 1360 - 180, -20,
                14, 1660, -15,
                14, 2150, -10,
            ],
            [  // images - middle 4

                20, 460, 550,
                20, 980, 550,
                20, 460, 300,
                20, 980, 300,
                16, 1150, 590,
                16, 1400, 590,
                16, 1700, 590,
                16, 2300, 590
            ],
            [  // images - middle 5
                18, 250, 590, 1,// tatty bush
                12, 740, 550, 2, // door
                50, 2550, 550, 6, // locked door
                16, 2700, 590, 0
            ],
            [ // foreground
                0, 1360 / 2, 768 - 65, 1,
                0, 1360 + 1360 / 2, 768 - 65, 1,
            ]
        ],
        p: [],
        u: [ 1366  / 2, 580 ]
    },
    {
        // inside big house
        v: [1360, 0],
        m: [
            0, 0, 1360, 780, 4,
            232, 32, 850, 800, 16
        ],
        i: [
            [
            ],
            [   // images - middle 1
            ],
            [   // images - middle 2
            ],
            [  // images - middle 3
            ],
            [  // images - middle 4

                30, 460, 550,
                30, 460, 300
            ],
            [  // images - middle 5
                12, 740, 550, 1, // door
                12, 980, 245, 3 // door
            ],
            [ // foreground
                // ceiling
                26, 1360 / 2, 22, 1,
                // walls
                27, 248, 86, 1,
                27, 1114, 86, 1,

                // small platform
                32, 550, 472, 1,

                // medium platform
                28, 846, 402, 1,

                // crate
                31, 330, 602, 1,

                // floor
                29, 1360 / 2, 768 - 65, 1
            ]
        ],
        p: [],
        u: [ 1366  / 2, 580 ]
    },
    {
        // small room in big house
        v: [1360, 0],
        m: [
            0, 0, 1360, 780, 4,
            572, 32, 520, 800, 2
        ],
        i: [
            [
            ],
            [   // images - middle 1
            ],
            [   // images - middle 2
            ],
            [  // images - middle 3
            ],
            [  // images - middle 4
                // windows
                35, 850, 550,
                35, 850, 250
            ],
            [  // images - middle 5
                12, 980, 245, 2, // door
                // crack in the wall
                47, 690, 210, 0,
                // hole in the wall, hidden
                48, 690, 200, 4
            ],
            [ // foreground
                // ceiling
                34, 1360 / 2 + 168, 22, 1,
                // walls
                27, 580, 86, 1,
                27, 1114, 86, 1,

                // medium platform
                28, 846, 402, 1,

                // crate
                31, 580 + 92, 602, 1,
                31, 580 + 220, 602, 1,
                31, 580 + 150, 502, 1,

                // floor
                33, 1360 / 2 + 168, 768 - 65, 1
            ]
        ],
        p: [],
        u: [ 1366  / 2, 580 ],
        // trigger
        // type: 0 - reveal door using bomb
        // interactive
        // level: 5
        // target: 1
        // reveals
        // level: 5
        // target: 2
        // this will also hide the door
        t: [ 0, 5, 1, 5, 2 ]
    }
]

export {
    leveldata,
    imagedata,
    palette,
    PLAYERPARTS,
    BUSH,
    DOOR,
    HOLEINWALL,
    TATTYBUSH,
    INTERACTIVES,
    FGTREE,
    LENSSTART,
    BOMBSTART,
    LOCKEDDOOR
}