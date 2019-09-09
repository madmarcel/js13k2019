// this is all the mini-svg data

// format is:
// w, h, data
const data = [
    // yellow rectangle
    104, 104, 'x,2k,12b,2,2,100,100x,0',
    // ugleee trees
    // these are not at positioned with top left corner at 0,0 so this
    // sprite is much bigger than we need
    670, 575, 'x,2k,5n,217,474,35,89,20k,8f,338,511,132,514,230,327k,10f,308,434,159,435,230,279k,9f,272,342,191,343,228,200x,0x,2k,5b,526,260,34,311k,8i,541,247,106i,602,305,50i,631,257,50i,622,202,50i,588,152,50i,526,117,50i,479,157,50i,456,210,50i,450,275,50i,509,317,50x,0x,2k,7i,522,264,12i,483,184,12i,574,139,12i,620,207,12i,600,313,12x,0'
]

const palette = [
    '#000',
    '#fff',
    '#8c8fae',
    '#584563',
    '#3e2137',
    '#9a6348',
    '#d79b7d',
    '#f5edba',
    '#c0c741',
    '#647d34',
    '#e4943a',
    '#9d303b',
    '#d26471',
    '#70377f',
    '#7ec4c1',
    '#34859d',
    '#17434b',
    '#1f0e1c'
]

export {
    data,
    palette
}
