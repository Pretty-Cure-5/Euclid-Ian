// newCube(size); makes a hollow cube
const newCube = (s) => {
    var xyz = [];
    for(var x in [...Array(s).keys()]) {
        for(var y in [...Array(s).keys()]) {
            for(var z in [...Array(s).keys()]) {
                if(x==0||y==0||z==0||x==s-1||y==s-1||z==s-1){
                    xyz.push([parseInt(x),parseInt(y),parseInt(z)]);
                }
            }
        }
    }
    return xyz;
}
var cube = newCube(3);
//console.log(cube);

// This cube has bits missing to divide it into two groups for two colours.
var cube = [
    [0,0,0],[0,0,1],[0,0,2],[0,1,0],[0,1,1],[0,1,2],[0,2,0],[0,2,1],[0,2,2],
    [2,0,0],[2,0,1],[2,0,2],[2,1,0],[2,1,1],[2,1,2],[2,2,0],[2,2,1],[2,2,2]
];
var groupByProximity = (xyz, distance) => {
    /** variables **/
    var c = 0;// number of groups (group_number for next group)
    var rgb = [];// this groups xyz by proximity
    /** functions **/
    const newGroup=(id)=>{c+=1;return [id,[]]}; // group[0] = group_number, push [x,y,z] into group[1]
    const distance3D=(a,b)=>{return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2));};
    const unique=(a)=>a.filter(function(item,pos){return a.indexOf(item)==pos;});
    const merge = (p, tmp) => {
        var i=0, j=0;
        tmp.push(newGroup('tmp'));
        // for "group" in tmp
        for(var g in tmp) {
            if(-1<p[0].indexOf(tmp[g][0])) {
                tmp[c-1][1] = tmp[c-1][1].concat(tmp[g][1]);
                delete tmp[g];
                i+=1, j+=1;
            } else {
                if(i && j) {tmp[g][0]-=i; j-=1;}
            }
        }
        tmp=tmp.filter(function(n){return n!==undefined});
        c=tmp.length;
        tmp[c-1][0] = c-1;
        tmp[c-1][1] = tmp[c-1][1].concat(p[1]);
        return tmp;
    };
    /** grouping **/
    while(xyz.length) {
        // pull out a "point" from xyz, and push empty "group" array into point
        var p = [[],xyz.pop()];
        // for "group" in rgb
        for(var g in rgb) {
            // for "each" in group
            for(var e in rgb[g][1]) {
                var d = distance3D(p[1], rgb[g][1][e]);
                if(d<distance) {p[0].push(rgb[g][0]); break;}
            }
        }
        // reduce p.groups
        p[0] = unique(p[0]);
        // check p.groups
        if(1<p[0].length) {
            // join/merge; refactor rgb.groups, and c=rgb.groups.length
            rgb.push(newGroup('temp'));
            rgb=merge(p,rgb);
            rgb[p[0][0]][1].push(p[1]);
        } else if(p[0].length<1) {
            // new group
            rgb.push(newGroup(c));
            // push
            rgb[c-1][1].push(p[1]);
        } else {
            // nothing; add p to rgb.group
            rgb[p[0][0]][1].push(p[1]);
        }
    }
    // xyz should be empty by this point (rgb is grouped); free to use.
    if(xyz.length!=0) {console.log('ERR: Leaking!')};
    xyz = rgb;
    rgb = [];
    /** colourise **/
    var nog = xyz.length; // number of groups; how many different colours needed.
    // for "group" in xyz
    for(var g in xyz) {
        // random colour hex
        var colour = ((1<<24)*Math.random()|0).toString(16);
        // for "point" in group
        for(var p in xyz[g][1]) {
            // need a format [x,y,z,r,g,b] will do, or [x,y,z,hex]
            xyz[g][1][p] = xyz[g][1][p].concat(colour)
            // ungrouping
            rgb.push(xyz[g][1][p]);
        }
    }
    /** escape **/
    return rgb;
};

// could run this as node.js, or in the browser; see how long it takes
// put xyz instead of cube
var rgb = groupByProximity(cube,1.5);
console.log(rgb.length);
console.log(rgb);