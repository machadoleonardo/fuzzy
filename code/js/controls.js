function car_keydown (car, ev) {
    switch( ev.keyCode ) {
        case 65:
        case 37:
            // Esquerda
            car.wheel_fl_constraint.configureAngularMotor( 1, -Math.PI / 3, Math.PI / 3, 5, 200 );
            car.wheel_fr_constraint.configureAngularMotor( 1, -Math.PI / 3, Math.PI / 3, 5, 200 );
            car.wheel_fl_constraint.enableAngularMotor( 1 );
            car.wheel_fr_constraint.enableAngularMotor( 1 );
            break;

        case 68:
        case 39:
            // Direita
            car.wheel_fl_constraint.configureAngularMotor( 1, -Math.PI / 3, Math.PI / 3, -5, 200 );
            car.wheel_fr_constraint.configureAngularMotor( 1, -Math.PI / 3, Math.PI / 3, -5, 200 );
            car.wheel_fl_constraint.enableAngularMotor( 1 );
            car.wheel_fr_constraint.enableAngularMotor( 1 );
            break;

        case 87:
        case 38:
            // Acima
            car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, 30, 5000 );
            car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, 30, 5000 );
            car.wheel_bl_constraint.enableAngularMotor( 2 );
            car.wheel_br_constraint.enableAngularMotor( 2 );
            break;

        case 83:
        case 40:
            // Ré
            car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, -30, 5000 );
            car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, -30, 5000 );
            car.wheel_bl_constraint.enableAngularMotor( 2 );
            car.wheel_br_constraint.enableAngularMotor( 2 );
            break;
    }
};

function car_keyup (car, ev) {
    switch( ev.keyCode ) {

        case 65:
        case 37:
            // Esquerda
            car.wheel_fl_constraint.configureAngularMotor( 1, 0, 0, 5, 200 );
            car.wheel_fr_constraint.configureAngularMotor( 1, 0, 0, 5, 200 );
            car.wheel_fl_constraint.disableAngularMotor( 1 );
            car.wheel_fr_constraint.disableAngularMotor( 1 );
            break;

        case 68:
        case 39:
            // Direita
            car.wheel_fl_constraint.configureAngularMotor( 1, 0, 0, -5, 200 );
            car.wheel_fr_constraint.configureAngularMotor( 1, 0, 0, -5, 200 );
            car.wheel_fl_constraint.disableAngularMotor( 1 );
            car.wheel_fr_constraint.disableAngularMotor( 1 );
            break;

        case 87:
        case 38:
            // Acima
            car.wheel_bl_constraint.disableAngularMotor( 2 );
            car.wheel_br_constraint.disableAngularMotor( 2 );
            break;

        case 83:
        case 40:
            // Ré
            car.wheel_bl_constraint.disableAngularMotor( 2 );
            car.wheel_br_constraint.disableAngularMotor( 2 );
            break;
    }
}


//==============================================================================

// Bot controls
function bot_keydown (ev) {
    switch ( ev.keyCode ) {
        case 65:
        case 37: // Esquerda
            input.direction = 1;
            break;

        case 87:
        case 38: // Aceleração
            input.power = true;
            break;

        case 68:
        case 39: // Direita
            input.direction = -1;
            break;

        case 83:
        case 40: // Ré
            input.power = false;
            break;
    }
};

function bot_keyup (ev) {
    switch ( ev.keyCode ) {
        case 65:
        case 37: // Esquerda
            input.direction = null;
            break;

        case 87:
        case 38: // Aceleração
            input.power = null;
            break;

        case 68:
        case 39: // Direita
            input.direction = null;
            break;

        case 83:
        case 40: // Ré
            input.power = null;
            break;
    }
}


//==============================================================================

function autoDrive() {

    function getModule(v) { return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z); }

    let speed = body.getLinearVelocity();
    let speedVal = getModule(speed);
    let maxSpeed = 5;
    let minSpeed = 1.7;
    console.log("Velocidade: " + speedVal);

    let distances = [ sensors[0].distance, sensors[1].distance, sensors[2].distance ];
    fuzzyDir = fuzzy(distances);

    // Velocidade EVAL
    if (speedVal > maxSpeed) {          // muito rápido, freie
        input.power = false;
    }
    else if (speedVal < minSpeed) {     // muito lento, acelere
        input.power = true;
    }
    else if (speedVal < maxSpeed ) {    // continue
        input.power = null;
    }

    // FUZZY EVAL
    if (fuzzyDir == 0) {                // Siga em frente
        input.direction = 0;
        input.power = true;
    }
    else if (fuzzyDir < 0) {            // vire à esquerda
        // break before sharp turns if too fast:
        if (fuzzyDir < -20 && speedVal > maxSpeed) {
            input.power = false;
        }
        input.direction = 1;
    }
    else if (fuzzyDir > 0) {            // turn right
        if (fuzzyDir > 20 && speedVal > maxSpeed) {
            input.power = false;
        }
        input.direction = -1;
    }
}
