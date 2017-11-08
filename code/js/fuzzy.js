function fuzzy(sensors) {

    const MP = 0, P = 1, L = 2, ML = 3;                 // distancia
    const ME = -30, E = -15, R = 0, D = 15, MD = 30;    // angulo    

    const NUM_INPUT_CURVES = 4;                       
    const rules =                                     
        [
            [
                [MD,D,D,MD],
                [R,D,D,MD],
                [R,D,D,MD],
                [R,D,D,MD]
            ],
            [
                [ME,D,D,MD],
                [E,D,D,MD],
                [E,R,D,D],
                [E,R,D,D]
            ],
            [
                [ME,E,MD,MD],
                [E,E,D,D],
                [ME,ME,R,R],
                [ME,E,R,R]
            ],
            [
                [ME,ME,ME,MD],
                [E,E,E,D],
                [ME,E,R,R],
                [ME,E,R,R]
            ]
        ];

    let width = 85;                
    let weights = [];
    let fuzzy_distances = [];   
    for (let s=0; s<sensors.length; s++) {
        let sw = [];

        // fuzzify
        sw = getWeights(sensors[s], NUM_INPUT_CURVES, width)
        weights.push(sw);

        // agregação
        fuzzy_distances.push( sw.indexOf( Math.max.apply(Math, sw) ) );
    }

    let s1 = fuzzy_distances[0];
    let s2 = fuzzy_distances[1];
    let s3 = fuzzy_distances[2];
    let defuzzy = rules[s1][s2][s3];

    return defuzzy;

}


function getWeights(value, num_curves, width) {

    const DEBUG = false;
    let peaks = [];
    let weights = [];
    let distances = [];

    // obter picos de curvas
    for (let c=0; c<num_curves; c++) {
        peaks[c] = c*width;
    }

    // calcular pesos em função da distância aos picos
    for (let c=0; c<num_curves; c++) {
        distances[c] = Math.abs(peaks[c] - value);
        weights[c] = 1 - Math.min((distances[c] / width), 1);
    }

    if (DEBUG) {
        function add(a,b){return a+b};
        console.log("dist:\t\t" + distances);
        console.log("peaks:\t\t" + peaks);
        console.log("weights:\t" + weights);
        console.log("w. sum:\t\t" + weights.reduce(add, 0));
    }

    return weights;
}
