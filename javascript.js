//initialising the canvas and setting the width and height
var canvas_main = document.getElementById("myCanvas")
var ctx = canvas_main.getContext("2d")
canvas_main.width = window.innerWidth - 30
canvas_main.height = window.innerHeight - 250


//these are the earth variables, that will be called during the reset function
var G_earth = -9.81
var Drag_C_base = 0.35
var Air_Den_earth = 1.293
var ground = canvas_main.height - 50
var dt = 1/800
var run = true

//defining the world class
class world {
    //constructor that creates an instance of the world class
    constructor(Grav_acc, Drag_coef, Air_Dens) {
        this.Grav_acc = Grav_acc;
        this.Drag_coef = Drag_coef;
        this.Air_Dens = Air_Dens;
    }
    //method to reset the world instance attributes to normal earth ones. 
    reset() {
        this.Grav_acc = G_earth
        this.Drag_coef = Drag_C_base
        this.Air_Dens = Air_Den_earth
    }
}
//an instance of the world class
let world1 = new world(9.8, 0.35, Air_Den_earth) 


//creating the circle class
class cirlce extends world {
    constructor(Radius, Mass, Pos_X, Pos_Y, Vel_X, Vel_Y, Acc_X, Acc_Y, Grav_acc, Drag_coef, Air_Dens) {
        super(Grav_acc);   
        this.Radius = Radius;
        this.Mass = Mass;
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
        this.Vel_X = Vel_X;
        this.Vel_Y = Vel_Y;
        this.Acc_X = Acc_X;
        this.Acc_Y = Acc_Y;
        this.Drag_coef = Drag_coef;
        this.Air_Dens = Air_Dens; 
    }
    //method to draw circle on the canvas
    draw_circle(){
        ctx.beginPath()
        ctx.arc(scale_x(ball.Pos_X), scale_y(ball.Pos_Y), ball.Radius, 0, 2*Math.PI)
        ctx.stroke()
    }
    //method to move the ball, by updating its acceleration, velocity and position.
    move_circle(){
        this.update_acc()
        this.update_vel()
        this.update_pos()
    }
    //updates the posisiton of the ball using it's velocity and acceleration
    update_pos(){
        this.Pos_X = ball.Pos_X + ball.Vel_X*dt + ball.Acc_X*dt*dt
        this.Pos_Y = ball.Pos_Y + ball.Vel_Y*dt + ball.Acc_Y*dt*dt
    }
    //updates the velocity of the ball using it's acceleration
    update_vel(){
        this.Vel_X = ball.Vel_X + ball.Acc_X*dt
        this.Vel_Y = ball.Vel_Y + ball.Acc_Y*dt
    }
    //updates the acceleration checking for air resistance and gravity
    update_acc(){
        //with air resistance
        if (document.getElementById("air_res_choice").checked){
            ball.Acc_X = ball.update_airres(ball.Vel_X)*0.1
            ball.Acc_Y = ball.Grav_acc + ball.update_airres(ball.Vel_Y)*0.1
        }
        //without air resistance
        else{
            ball.Acc_X = ball.Acc_X
            ball.Acc_Y = ball.Grav_acc
        }
    }
    //function to calculate air resistance, takes a velocity input and checks for the correct direction of air resistance
    update_airres(vel){
        if (vel > 0){
            var airres = -0.5*vel*vel*(world1.Air_Dens)*(world1.Drag_coef)*(ball.Radius*ball.Radius*Math.PI)
        }
        else{
            var airres = 0.5*vel*vel*(world1.Air_Dens)*(world1.Drag_coef)*(ball.Radius*ball.Radius*Math.PI)
        }
        return (airres/ball.Mass)
    }
    //temporary function to bounce the ball around the canvas, with a slight damping effect to reduce speed
    col_check(){
        //left wall
        if(ball.Pos_X <= (ball.Radius/max_x)){
            ball.Pos_X = (ball.Radius/max_x);
            ball.Vel_X = ball.Vel_X * -0.9;
        }
        //right wall
        if(ball.Pos_X >= (max_x - ball.Radius/max_x)){
            ball.Pos_X = (max_x - ball.Radius/max_x);
            ball.Vel_X = ball.Vel_X * -0.9;
        }
        //top wall
        if(ball.Pos_Y >= (max_y - ball.Radius/max_y)){
            ball.Pos_Y = (max_y - ball.Radius/max_y);
            ball.Vel_Y = ball.Vel_Y * -0.9;
        }
        //bottom wall
        if(ball.Pos_Y <= (((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height))){
            ball.Pos_Y = (((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height));
            ball.Vel_Y = ball.Vel_Y * 0;
            ball.Vel_X = ball.Vel_X * 0;
        }
    }
}

//creating an initial instance of the ball class
let ball = new cirlce(10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)


//drawing the graph using canvas methods
function graph() {
    ctx.beginPath()
    ctx.moveTo(50,canvas_main.height)
    ctx.lineTo(50, 0)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, canvas_main.height-50)
    ctx.lineTo(canvas_main.width, canvas_main.height-50)
    ctx.stroke()
}

//function to scale the balls position to the canvas
var max_x = 40
var max_y = 40
function scale_x(coord){
    return ((coord*canvas_main.width)/max_x)
}
function scale_y(coord){
    return (((max_y - coord)*canvas_main.height)/max_y)
}

//calculating the starting position of the ball
var x_start = (50*max_x)/canvas_main.width
var y_start = ((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height)

//creating a button variable in js from the HTML button
const launch_button = document.getElementById("launch_button")

//matching sliders to text box values
//velocity text box on vel-ang page
var vel_txt = document.getElementById("vel_txt_box")
vel_txt.oninput = function() {
    document.getElementById("vel_slider").value = vel_txt.value
    if(vel_txt.value > 100){
        vel_txt.value=100
    }
    if(vel_txt.value < 1){
        vel_txt.value = 1
    }
}
//angle text box on vel-ang page
var ang_txt = document.getElementById("ang_txt_box")
ang_txt.oninput = function() {
    document.getElementById("ang_slider").value = ang_txt.value
    if(ang_txt.value > 90){
        ang_txt.value = 90
    }
    if(ang_txt.value < -90){
        ang_txt.value = -90
    }
}
//x-velocity text box on the 2-vel page
var velx_txt = document.getElementById("x_vel_txt_box")
velx_txt.oninput = function() {
    document.getElementById("x_vel_slider").value = velx_txt.value
    if(velx_txt.value > 100){
        velx_txt.value=100
    }
    if(velx_txt.value < 0){
        velx_txt.value = 0
    }
}
//y-velocity text box on the 2-vel page
var vely_txt = document.getElementById("y_vel_txt_box")
vely_txt.oninput = function() {
    document.getElementById("y_vel_slider").value = vely_txt.value
    if(vely_txt.value > 100){
        vely_txt.value=100
    }
    if(vely_txt.value < 0){
        vely_txt.value = 0
    }
}
//start height text box on the vel-height page
var start_height = document.getElementById("start_height_txt_box")
start_height.oninput = function() {
    document.getElementById("start_height_slider").value = start_height.value
    ball.Pos_Y = (start_height.value/1) + (Math.round(y_start*100)/100)
    ctx.clearRect(0,0,canvas_main.width, canvas_main.height)
    graph()
    ball.draw_circle()
    if(start_height.value > 100){
        start_height.value = 100
    }
    if(start_height.value < 0){
        start_height.value = 0
    }
}
//grav text box on the grav page
var grav_strength = document.getElementById("grav_txt_box")
grav_strength.oninput = function() {
    document.getElementById("grav_slider").value = grav_strength.value
    world1.Grav_acc = grav_strength.value
    if(grav_strength.value > 25){
        grav_strength.value = 25
    }
    if(grav_strength.value < 0.1){
        grav_strength.value = 0.1
    }
}
//mass box on air resistance page
var mass_box = document.getElementById("mass_txt_box")
mass_box.oninput = function() {
    if (document.getElementById("air_res_choice").checked){
        document.getElementById("mass_slider").value = mass_box.value
        if(mass_box.value > 50){
            mass_box.value = 50
        }
        if(mass_box.value < 1){
            mass_box.value = 1
        }
}
}
//drag coefficient box on air resistance page
var drag_coeff_box = document.getElementById("drag_coef_txt_box")
drag_coeff_box.oninput = function() {
    if (document.getElementById("air_res_choice").checked){
        document.getElementById("drag_coef_slider").value = drag_coeff_box.value
        if(drag_coeff_box.value > 2){
            drag_coeff_box.value = 2
        }
        if(drag_coeff_box.value < 0.01){
            drag_coeff_box.value = 0.01
        }
}
}
//diameter box on air resistance page
var diam_box = document.getElementById("diam_txt_box")
diam_box.oninput = function() {
    if (document.getElementById("air_res_choice").checked){
        document.getElementById("diam_slider").value = diam_box.value
        if(diam_box.value > 30){
            diam_box.value = 30
        }
        if(diam_box.value < 1){
            diam_box.value = 1
        }
}
}

//Matching text box value to slider value
//velocity slider on vel-ang page
var vel_slider = document.getElementById("vel_slider")
document.getElementById("vel_txt_box").value = vel_slider.value
vel_slider.oninput = function() {
    document.getElementById("vel_txt_box").value = vel_slider.value
}
//angle slider on vel-ang page
var ang_slider = document.getElementById("ang_slider")
document.getElementById("ang_txt_box").value = ang_slider.value
ang_slider.oninput = function() {
    document.getElementById("ang_txt_box").value = ang_slider.value
}
//x-velocity slider on 2-vel page
var x_vel_slider = document.getElementById("x_vel_slider")
document.getElementById("x_vel_txt_box").value = x_vel_slider.value
x_vel_slider.oninput = function() {
    document.getElementById("x_vel_txt_box").value = x_vel_slider.value
}
//y-velocity slider on 2-vel page
var y_vel_slider = document.getElementById("y_vel_slider")
document.getElementById("y_vel_txt_box").value = y_vel_slider.value
y_vel_slider.oninput = function() {
    document.getElementById("y_vel_txt_box").value = y_vel_slider.value
}
//start height slider on vel-height page
var start_height_slider = document.getElementById("start_height_slider")
document.getElementById("start_height_txt_box").value = start_height_slider.value
start_height_slider.oninput = function() {
    document.getElementById("start_height_txt_box").value = start_height_slider.value
    ball.Pos_Y = (start_height.value/1) + (Math.round(y_start*100)/100)
    ctx.clearRect(0,0,canvas_main.width, canvas_main.height)
    graph()
    ball.draw_circle()
}
//gravity slider on grav page
var grav_slider = document.getElementById("grav_slider")
document.getElementById("grav_txt_box").value = grav_slider.value
grav_slider.oninput = function() {
    document.getElementById("grav_txt_box").value = grav_slider.value
    world1.Grav_acc = grav_slider.value
}
//mass slider on air resistance page
var mass_slider = document.getElementById("mass_slider")
mass_box.value = mass_slider.value
mass_slider.oninput = function() {
    if (document.getElementById("air_res_choice").checked){
        mass_box.value = mass_slider.value
    }
}
//drag coefficient slider on air resistance page
var drag_coef_slider = document.getElementById("drag_coef_slider")
drag_coeff_box.value = drag_coef_slider.value
drag_coef_slider.oninput = function() {
    if (document.getElementById("air_res_choice").checked){
        drag_coeff_box.value = drag_coef_slider.value
    }
}
//diameter slider on air resistance page
var diam_slider = document.getElementById("diam_slider")
diam_box.value = diam_slider.value
diam_slider.oninput = function() {
    if (document.getElementById("air_res_choice").checked){
        diam_box.value = diam_slider.value
    }
}

//gravity planet choice, matching the values to the slider and text box
var grav_choice = document.getElementById("planets_list")
grav_choice.oninput = function() {
    if (grav_choice.value == "Mercury"){
        grav_strength.value = 3.7
        grav_slider.value = 3.7
        world1.Grav_acc = 3.7
    }
    else if (grav_choice.value == "Venus"){
        grav_strength.value = 8.9
        grav_slider.value = 8.9
        world1.Grav_acc = 8.9
    }
    else if (grav_choice.value == "Earth"){
        grav_strength.value = 9.8
        grav_slider.value = 9.8
        world1.Grav_acc = 9.8
    }
    else  if (grav_choice.value == "Mars"){
        grav_strength.value = 3.7
        grav_slider.value = 3.7
        world1.Grav_acc = 3.7
    }
    else if (grav_choice.value == "Jupiter"){
        grav_strength.value = 24.8
        grav_slider.value = 24.8
        world1.Grav_acc = 24.8
    }
    else if (grav_choice.value == "Saturn"){
        grav_strength.value = 10.4
        grav_slider.value = 10.4
        world1.Grav_acc = 10.4
    }
    else if (grav_choice.value == "Neptune"){
        grav_strength.value = 11.2
        grav_slider.value = 11.2
        world1.Grav_acc = 11.2
    }
        else if (grav_choice.value == "Uranus"){
        grav_strength.value = 8.9
        grav_slider.value = 8.9
        world1.Grav_acc = 8.9
    }
}


//creating variables from the checkboxes on the HTML page
const vel_hei_check = document.getElementById("vel_Hei")
const SLD_check = document.getElementById("SLD")
const grav_check = document.getElementById("grav") 
const tar_coord_check = document.getElementById("Tar_coord") 
const air_res_check = document.getElementById("air_res")

//drawing the graph
graph()
//setting the ball to its starting position
ball.Pos_X = x_start
ball.Pos_Y = y_start
//drawing the ball on the graph
ball.draw_circle()
//the function that is run when the launch button is presed
function Launch(){
    //this checks whether it is 2-vel or a velocity and a angle
    //this is 2-vel
    if(document.getElementById("2_vel").checked){
        var velx = document.getElementById("x_vel_txt_box").value
        var vely = document.getElementById("y_vel_txt_box").value
    }
    //this is velocity and angle
    else{
        var ang = document.getElementById("ang_txt_box").value
        var vel = document.getElementById("vel_txt_box").value
        var velx = vel * Math.cos((ang*Math.PI)/180)
        var vely = vel * Math.sin((ang*Math.PI)/180)
    }
    //this is finding the starting height
    var start_height = Math.round(document.getElementById("start_height_txt_box").value * 100)/100
    //this creates a new instance of the circle class overiding the old one, with the correct values
    ball = new cirlce(10, 50, x_start, (y_start + start_height), Math.round(velx*100)/100, Math.round(vely*100)/100, 0, 0, -world1.Grav_acc, world1.Drag_coef, world1.Air_Dens)
    console.log(ball)
    //this is the temporary for loop in order to show the motion of the projectile
    for (var i = 0; i<10000; i++){
        //this here is a timeout function so that the ball does not merely appear at the end point
        setTimeout(function(){
                ctx.clearRect(0,0,canvas_main.width, canvas_main.height)
                graph()
                ball.draw_circle()
                ball.move_circle()
                ball.col_check()
                //putting the current velocities and displacements into the
                document.getElementById('vel_x').value = Math.round(ball.Vel_X *100)/100
                document.getElementById('vel_y').value = Math.round(ball.Vel_Y *100)/100
                document.getElementById('disp_x').value = Math.round((ball.Pos_X - x_start)*100)/100
                document.getElementById('disp_y').value = (Math.round((ball.Pos_Y - y_start)*100)/100)
            },1000) 
    }
}

//launch button click listener
launch_button.addEventListener( 'click', () =>{
    Launch();
})