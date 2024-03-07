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
var running = false

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
        super(Grav_acc, Drag_coef, Air_Dens);   
        this.Radius = Radius;
        this.Mass = Mass;
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
        this.Vel_X = Vel_X;
        this.Vel_Y = Vel_Y;
        this.Acc_X = Acc_X;
        this.Acc_Y = Acc_Y;
        //this.Drag_coef = Drag_coef;
        //this.Air_Dens = Air_Dens; 
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
        this.Pos_X = this.Pos_X + this.Vel_X*dt + this.Acc_X*dt*dt
        this.Pos_Y = this.Pos_Y + this.Vel_Y*dt + this.Acc_Y*dt*dt
    }
    //updates the velocity of the ball using it's acceleration
    update_vel(){
        this.Vel_X = this.Vel_X + this.Acc_X*dt
        this.Vel_Y = this.Vel_Y + this.Acc_Y*dt
    }
    //updates the acceleration checking for air resistance and gravity
    update_acc(){
        //with air resistance
        if (document.getElementById("air_res_choice").checked){
            this.Acc_X = this.update_airres(this.Vel_X)
            this.Acc_Y = this.Grav_acc + this.update_airres(this.Vel_Y)
        }
        //without air resistance
        else{
            this.Acc_X = this.Acc_X
            this.Acc_Y = this.Grav_acc
        }
    }
    //function to calculate air resistance, takes a velocity input and checks for the correct direction of air resistance
    update_airres(vel){
        if (vel > 0){
            var airres = -0.5*vel*vel*(world1.Air_Dens)*(world1.Drag_coef)*(this.Radius*this.Radius*Math.PI)/1000
        }
        else{
            var airres = 0.5*vel*vel*(world1.Air_Dens)*(world1.Drag_coef)*(this.Radius*this.Radius*Math.PI)/1000
        }
        return (airres/this.Mass)
    }
    //temporary function to bounce the ball around the canvas, with a slight damping effect to reduce speed
}

//creating an initial instance of the ball class
let ball = new cirlce(15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)


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

//creating a button variable in js from the HTML button
const launch_button = document.getElementById("launch_button")
const reset_button = document.getElementById("reset_button")
const add_coord_button = document.getElementById("add_coord")
const delete_coord_button = document.getElementById("delete_coord")
const save_run_button = document.getElementById("save_run_button")
const load_run_button = document.getElementById("load_run_button")
const delete_run_button = document.getElementById("delete_run_button")
const upload_run_button = document.getElementById("upload_run_button")
const clear_button = document.getElementById("clear_storage")
const play_pause_button = document.getElementById("play_pause")
const speed_up_button = document.getElementById("speed_up")
const slow_down_button = document.getElementById("slow_down")
const zoom_in_button = document.getElementById("zoom_in")
const zoom_out_button = document.getElementById("zoom_out")
const foward_button = document.getElementById("time_forward")
const back_button = document.getElementById("time_back")

//checkboxes for coordinate table
const tar_check_1 = document.getElementById("tar_coord_1")
const tar_check_2 = document.getElementById("tar_coord_2")
const tar_check_3 = document.getElementById("tar_coord_3")
const tar_check_4 = document.getElementById("tar_coord_4")
const tar_check_5 = document.getElementById("tar_coord_5")
const tar_check_6 = document.getElementById("tar_coord_6")
const tar_check_7 = document.getElementById("tar_coord_7")
const tar_check_8 = document.getElementById("tar_coord_8")
//checkboxes for vectors
const force_check = document.getElementById("force_vec_check")
const acc_check = document.getElementById("acc_vec_check")
const vel_check = document.getElementById("vel_vec_check")
const path_check = document.getElementById("obj_path_check")
//experimental check
const experimental_mode = document.getElementById("exp_check")

//function to scale the balls position to the canvas
var max_x = 100
var max_y = 85
function scale_x(coord){
    return ((coord*canvas_main.width)/max_x)
}
function scale_y(coord){
    return (((max_y - coord)*canvas_main.height)/max_y)
}

//calculating the starting position of the ball
var x_start = (50*max_x)/canvas_main.width
var y_start = ((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height)
ball.Pos_X = x_start
ball.Pos_Y = y_start



//function to draw the numbers at the corners of the graph
//drawing the coordinate pairs
function draw_25_10(){
    ctx.beginPath()
    //2
    ctx.moveTo(canvas_main.width - 30, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 20)   
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 20)
    //5
    ctx.moveTo(canvas_main.width - 15, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 20)
    //1
    ctx.moveTo(30, 10)
    ctx.lineTo(30, 20)
    //0
    ctx.moveTo(35, 10)
    ctx.lineTo(35, 20)
    ctx.lineTo(40, 20)
    ctx.lineTo(40, 10)
    ctx.lineTo(35, 10)
    ctx.stroke()
}

function draw_50_35(){
    ctx.beginPath()
    //5
    ctx.moveTo(canvas_main.width - 25, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 20)
    //0
    ctx.moveTo(canvas_main.width - 20, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 30)
    //3
    ctx.moveTo(30, 10)
    ctx.lineTo(35, 10)
    ctx.lineTo(35, 20)
    ctx.lineTo(30, 20)
    ctx.moveTo(30, 15)
    ctx.lineTo(35, 15)
    //5
    ctx.moveTo(45, 10)
    ctx.lineTo(40, 10)
    ctx.lineTo(40, 15)
    ctx.lineTo(45, 15)
    ctx.lineTo(45, 20)
    ctx.lineTo(40, 20)
    ctx.stroke()
}

function draw_75_60(){
    //7
    ctx.moveTo(canvas_main.width - 32, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 27.5, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 20)
    //5
    ctx.moveTo(canvas_main.width - 15, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 20)
    //6
    ctx.moveTo(35, 10)
    ctx.lineTo(30, 10)
    ctx.lineTo(30, 20)
    ctx.lineTo(35, 20)
    ctx.lineTo(35, 15)
    ctx.lineTo(30, 15)
    //0
    ctx.moveTo(40, 10)
    ctx.lineTo(40, 20)
    ctx.lineTo(45, 20)
    ctx.lineTo(45, 10)
    ctx.lineTo(40, 10)
    ctx.stroke()
}

function draw_100_85(){
    ctx.beginPath()
    //1
    ctx.moveTo(canvas_main.width - 30, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width-30, canvas_main.height - 20)
    //0
    ctx.moveTo(canvas_main.width - 25, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 30)
    //0
    ctx.moveTo(canvas_main.width - 15, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 30)
    //8
    ctx.moveTo(30, 10)
    ctx.lineTo(30, 20)
    ctx.lineTo(35, 20)
    ctx.lineTo(35, 10)
    ctx.lineTo(30, 10)
    ctx.moveTo(30, 15)
    ctx.lineTo(35, 15)
    //5
    ctx.moveTo(45, 10)
    ctx.lineTo(40, 10)
    ctx.lineTo(40, 15)
    ctx.lineTo(45, 15)
    ctx.lineTo(45, 20)
    ctx.lineTo(40, 20)
    ctx.stroke()
}

function draw_125_110(){
    ctx.beginPath()
    //1
    ctx.moveTo(canvas_main.width - 30, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width-30, canvas_main.height - 20)
    //2
    ctx.moveTo(canvas_main.width - 25, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 20)   
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 20)
    //5
    ctx.moveTo(canvas_main.width - 10, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 20)
    //1
    ctx.moveTo(30, 10)
    ctx.lineTo(30, 20)
    //1
    ctx.moveTo(25, 10)
    ctx.lineTo(25, 20)
    //0
    ctx.moveTo(35, 10)
    ctx.lineTo(35, 20)
    ctx.lineTo(40, 20)
    ctx.lineTo(40, 10)
    ctx.lineTo(35, 10)
    ctx.stroke()   
}

function draw_150_135(){
    ctx.beginPath()
    //1
    ctx.moveTo(canvas_main.width - 30, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width-30, canvas_main.height - 20)
    //5
    ctx.moveTo(canvas_main.width - 20, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 20)
    //0
    ctx.moveTo(canvas_main.width - 15, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 30)
    //1
    ctx.moveTo(25, 10)
    ctx.lineTo(25, 20)
    //3
    ctx.moveTo(30, 10)
    ctx.lineTo(35, 10)
    ctx.lineTo(35, 20)
    ctx.lineTo(30, 20)
    ctx.moveTo(30, 15)
    ctx.lineTo(35, 15)
    //5
    ctx.moveTo(45, 10)
    ctx.lineTo(40, 10)
    ctx.lineTo(40, 15)
    ctx.lineTo(45, 15)
    ctx.lineTo(45, 20)
    ctx.lineTo(40, 20)
    ctx.stroke()
}

function draw_175_160(){
    ctx.beginPath()
    //1
    ctx.moveTo(canvas_main.width - 30, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width-30, canvas_main.height - 20)
    //7
    ctx.moveTo(canvas_main.width - 27, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 22.5, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 20)
    //5
    ctx.moveTo(canvas_main.width - 10, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 20)
    //1
    ctx.moveTo(25, 10)
    ctx.lineTo(25, 20)
    //6
    ctx.moveTo(35, 10)
    ctx.lineTo(30, 10)
    ctx.lineTo(30, 20)
    ctx.lineTo(35, 20)
    ctx.lineTo(35, 15)
    ctx.lineTo(30, 15)
    //0
    ctx.moveTo(40, 10)
    ctx.lineTo(40, 20)
    ctx.lineTo(45, 20)
    ctx.lineTo(45, 10)
    ctx.lineTo(40, 10)
    ctx.stroke()
}

function draw_200_175(){
    ctx.beginPath()
    //2
    ctx.moveTo(canvas_main.width - 35, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 35, canvas_main.height - 25)
    ctx.lineTo(canvas_main.width - 35, canvas_main.height - 20)   
    ctx.lineTo(canvas_main.width - 30, canvas_main.height - 20)
    //0
    ctx.moveTo(canvas_main.width - 25, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 20, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 25, canvas_main.height - 30)
    //0
    ctx.moveTo(canvas_main.width - 15, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 20)
    ctx.lineTo(canvas_main.width - 10, canvas_main.height - 30)
    ctx.lineTo(canvas_main.width - 15, canvas_main.height - 30)
    //1
    ctx.moveTo(25, 10)
    ctx.lineTo(25, 20)
    //6
    ctx.moveTo(30, 10)
    ctx.lineTo(35, 10)
    ctx.lineTo(31, 20)
    //5
    ctx.moveTo(45, 10)
    ctx.lineTo(40, 10)
    ctx.lineTo(40, 15)
    ctx.lineTo(45, 15)
    ctx.lineTo(45, 20)
    ctx.lineTo(40, 20)
    ctx.stroke()
}

function set_frame(max_frame_size){
    if(max_frame_size == 25){
        draw_25_10()
    }
    if(max_frame_size == 50){
        draw_50_35()
    }
    if(max_frame_size == 75){
        draw_75_60()
    }
    if(max_frame_size == 100){
        draw_100_85()
    }
    if(max_frame_size == 125){
        draw_125_110()
    }
    if(max_frame_size == 150){
        draw_150_135()
    }
    if(max_frame_size == 175){
        draw_175_160()
    }
    if(max_frame_size == 200){
        draw_200_175()
    }
}
set_frame(max_x)


//matching sliders to text box values
//velocity text box on vel-ang page
var vel_txt = document.getElementById("vel_txt_box")
vel_txt.oninput = function() {
    document.getElementById("vel_slider").value = vel_txt.value
    if(vel_txt.value > 100){
        vel_txt.value=100
        vel_slider.value = 100
    }
    if(vel_txt.value < 1){
        vel_txt.value = 1
        vel_slider.value = 1
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
        velx_txt.value = 100
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
    set_frame(max_x)
    graph()
    show_coord()
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
    document.getElementById("mass_slider").value = mass_box.value
    if(mass_box.value > 50){
        mass_box.value = 50
    }
    if(mass_box.value < 1){
        mass_box.value = 1
    }
}
//drag coefficient box on air resistance page
var drag_coeff_box = document.getElementById("drag_coef_txt_box")
drag_coeff_box.oninput = function() {
        document.getElementById("drag_coef_slider").value = drag_coeff_box.value
        world1.Drag_coef = drag_coeff_box.value
        if(drag_coeff_box.value > 2){
            drag_coeff_box.value = 2
        }
        if(drag_coeff_box.value < 0.01){
            drag_coeff_box.value = 0.01
        }
}
//diameter box on air resistance page
var diam_box = document.getElementById("diam_txt_box")
diam_box.oninput = function() {
    document.getElementById("diam_slider").value = diam_box.value
    if(diam_box.value <= 50 && diam_box.value >= 1){
        ball.Radius = (diam_box.value)/2
        y_start = ((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height)
        ball.Pos_Y = y_start/1 + start_height.value/1 + 0.001/1
        ctx.clearRect(0,0,canvas_main.width, canvas_main.height)
        graph()
        set_frame(max_x)
        show_coord()
        ball.draw_circle()
    }
    if(diam_box.value > 50){
        diam_box.value = 50
    }
    if(diam_box.value < 1){
        diam_box.value = 1
    }
}

//x and y inputs for the target coordinates
var x_input = document.getElementById("x_coord_input")
var y_input = document.getElementById("y_coord_input")
x_input.oninput = function(){
    if (x_input.value > 100){
        x_input.value = 100
    }
    if(x_input < 0){
        x_input = 0
    }
}
y_input.oninput = function(){
    if (y_input.value > 100){
        y_input.value = 100
    }
    if(y_input < 0){
        y_input = 0
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
    show_coord()
    set_frame(max_x)
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
    mass_box.value = mass_slider.value
}
//drag coefficient slider on air resistance page
var drag_coef_slider = document.getElementById("drag_coef_slider")
drag_coeff_box.value = drag_coef_slider.value
drag_coef_slider.oninput = function() {
    drag_coeff_box.value = drag_coef_slider.value
    world1.Drag_coef = drag_coef_slider.value
}
//diameter slider on air resistance page
var diam_slider = document.getElementById("diam_slider")
diam_box.value = diam_slider.value
diam_slider.oninput = function() {
    diam_box.value = diam_slider.value
    ball.Radius = (diam_slider.value)/2
    y_start = ((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height)
    ball.Pos_Y = y_start/1 + start_height.value/1 + 0.001/1
    ctx.clearRect(0,0,canvas_main.width, canvas_main.height)
    graph()
    set_frame(max_x)
    show_coord()
    ball.draw_circle()
}

//target coordinate plotting points
var coord_rad = 3
function draw_coord(x,y){
    ctx.beginPath()
    ctx.arc(scale_x(x), scale_y(y), coord_rad, 0, 2*Math.PI)
    ctx.stroke()
}


function clear_coord(x, y){
    ctx.beginPath()
    ctx.clearRect(scale_x(x)-coord_rad - 1, scale_y(y)-coord_rad - 1, 2*(coord_rad) + 2, 2*(coord_rad) + 2)
    ctx.stroke()
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

//function to show coordinates during flight
function show_coord(){
    if(tar_check_1.checked){
        draw_coord(document.getElementById("x_coord_1").innerHTML, document.getElementById("y_coord_1").innerHTML)
    }
    if(tar_check_2.checked){
        draw_coord(document.getElementById("x_coord_2").innerHTML, document.getElementById("y_coord_2").innerHTML)
    }
    if(tar_check_3.checked){
        draw_coord(document.getElementById("x_coord_3").innerHTML, document.getElementById("y_coord_3").innerHTML)
    }
    if(tar_check_4.checked){
        draw_coord(document.getElementById("x_coord_4").innerHTML, document.getElementById("y_coord_4").innerHTML)
    }
    if(tar_check_5.checked){
        draw_coord(document.getElementById("x_coord_5").innerHTML, document.getElementById("y_coord_5").innerHTML)
    }
    if(tar_check_6.checked){
        draw_coord(document.getElementById("x_coord_6").innerHTML, document.getElementById("y_coord_6").innerHTML)
    }
    if(tar_check_7.checked){
        draw_coord(document.getElementById("x_coord_7").innerHTML, document.getElementById("y_coord_7").innerHTML)
    }
    if(tar_check_8.checked){
        draw_coord(document.getElementById("x_coord_8").innerHTML, document.getElementById("y_coord_8").innerHTML)
    }
}


//creating variables from the checkboxes on the HTML page
const vel_hei_check = document.getElementById("vel_Hei")
const SLD_check = document.getElementById("SLD")
const grav_check = document.getElementById("grav") 
const tar_coord_check = document.getElementById("Tar_coord") 
const air_res_check = document.getElementById("air_res")
//var current time
var current_time;
//position arrays
var x_pos_array;
var y_pos_array;

//drawing the graph
graph()
//setting the ball to its starting position
ball.Pos_X = x_start
ball.Pos_Y = y_start
//drawing the ball on the graph
ball.draw_circle()

var script = document.createElement('script_alert')
    script.type = 'text/javascript'
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@9'
    document.body.appendChild(script)

//the function that is run when the launch button is presed
function Launch(){
    is_paused = false
    //this is the for loop in order to show the motion of the projectile
    for (var i = 0; i<70000; i++){
        //this here is a timeout function so that the ball does not merely appear at the end point
        setTimeout(function(){
            if(ball.Pos_Y >= y_start + 0.0009){
                ctx.clearRect(0,0,canvas_main.width, canvas_main.height)
                graph()
                show_coord()
                set_frame(max_x)
                ball.draw_circle()
                ball.move_circle()
                current_time += dt
                x_pos_array.push(ball.Pos_X)
                y_pos_array.push(ball.Pos_Y)
                if(force_check.checked){
                    calc_force()
                }
                if(acc_check.checked){
                    calc_acc()
                }
                if(vel_check.checked){
                    calc_vel()
                }
                if(path_check.checked){
                    show_path(x_pos_array, y_pos_array)
                }
                //putting the current velocities and displacements into the text boxes
                document.getElementById('vel_x').value = Math.round(ball.Vel_X *100)/100
                document.getElementById('vel_y').value = Math.round(ball.Vel_Y *100)/100
                document.getElementById('disp_x').value = Math.round((ball.Pos_X - x_start)*100)/100
                document.getElementById('disp_y').value = (Math.round((ball.Pos_Y - y_start)*100)/100)
                document.getElementById('time_box').value = Math.round(current_time*100)/100 + "s"
                document.getElementById('time_slider').value += Math.round(current_time*100)/100
            }
        }, 1000)
    }
}

//function to set the ball back to its starting position and reset variables
function reset() {
    ball.Radius = (diam_box.value)/2
    y_start = ((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height)
    ball.Pos_Y = y_start/1 + start_height.value/1
    ball.Pos_X = x_start
    ctx.clearRect(0,0,canvas_main.width, canvas_main.height)
    show_coord()
    graph()
    ball.draw_circle()
    running = false
    set_frame(max_x)
    play_pause_button.innerHTML = "Play"
    var speeds = ["0.3x", "0.5x", "1x", "2x", "3x"]
    var play_speed = [1/2400, 1/1600, 1/800, 1/400, 3/800]
    for (var i = 0; i < speeds.length; i++){
        if(document.getElementById("an_speed_box").value == speeds[i]){
            dt = play_speed[i]
        }
    }
    document.getElementById('vel_x').value = 0
    document.getElementById('vel_y').value = 0
    document.getElementById('disp_x').value = 0
    document.getElementById('disp_y').value = 0
    document.getElementById('time_box').value = 0
    document.getElementById('time_slider').value = 0
}
//function to add coordinate to the target coordinate table
function add_coordinate() {
    var tar_coord_table = document.getElementById("tar_coord_table");
    var cell = tar_coord_table.getElementsByTagName("td")
    for (var i = 1; i < 23; i+=3){
        if(cell[i].innerHTML == "--"){
            cell[i].innerHTML = x_input.value
            cell[i+1].innerHTML = y_input.value
            break;
        }
        if(i == 22){
            Swal.fire(
                'Error',
                'Table is full, please delete and then try adding',
                'success'
            )
        }
    } 
}
//function to delete a coordinate from the target coordinate table
function delete_coord(number){
    var tar_coord_table = document.getElementById("tar_coord_table");
    var cell = tar_coord_table.getElementsByTagName("td")
    var i = 3*(number) - 2
    if(cell[i].innerHTML == "--"){
        Swal.fire(
            'Error',
            'No data in row',
            'success'
        )
    }
    else{
        clear_coord(cell[i].innerHTML, cell[i+1].innerHTML)
        cell[i].innerHTML = "--"
        cell[i+1].innerHTML = "--"
        if(number == "1"){
            tar_check_1.checked = false
        }
        if(number == "2"){
            tar_check_2.checked = false
        }
        if(number == "3"){
            tar_check_3.checked = false
        }
        if(number == "4"){
            tar_check_4.checked = false
        }
        if(number == "5"){
            tar_check_5.checked = false
        }
        if(number == "6"){
            tar_check_6.checked = false
        }
        if(number == "7"){
            tar_check_7.checked = false
        }
        if(number == "8"){
            tar_check_8.checked = false
        }
    }
}
//function to save a run to the table
function save_run() {
    for (var i = 1; i < 7; i++){
        if(sld_table.rows[i].cells[1].innerHTML == "--"){
            if(document.getElementById("angle").checked){
                sld_table.rows[i].cells[1].innerHTML = Math.round(vel_txt.value*Math.cos(ang_txt.value*Math.PI/180)*100)/100
                sld_table.rows[i].cells[2].innerHTML = Math.round(vel_txt.value*Math.sin(ang_txt.value*Math.PI/180)*100)/100
            }
            else{
                sld_table.rows[i].cells[1].innerHTML = velx_txt.value
                sld_table.rows[i].cells[2].innerHTML = vely_txt.value
            }
            sld_table.rows[i].cells[3].innerHTML = start_height.value
            sld_table.rows[i].cells[4].innerHTML = grav_strength.value
            if(document.getElementById("air_res_choice").checked){
                sld_table.rows[i].cells[5].innerHTML = drag_coeff_box.value
                sld_table.rows[i].cells[6].innerHTML = mass_box.value
                sld_table.rows[i].cells[7].innerHTML = diam_box.value
            }
            else{
                sld_table.rows[i].cells[5].innerHTML = "n/a"
                sld_table.rows[i].cells[6].innerHTML = "n/a"
                sld_table.rows[i].cells[7].innerHTML = "n/a"
            }
            break;
        }
        if(i == 6){
            Swal.fire(
                'Error',
                'Table is full, please delete and then try adding',
                'success'
            )
        }
    }
}
//function to delete run from the run table
function delete_run(number){
    if(sld_table.rows[number].cells[1].innerHTML == "--"){
        Swal.fire(
            'Error',
            'No data in that row.',
            'success'
        )
    }
    else{
        for (var i = 1; i < 8; i++){
            sld_table.rows[number].cells[i].innerHTML = "--"
        }
    }
}
//function to load run from the run table
function load_run(number){
    if(sld_table.rows[number].cells[1].innerHTML == "--"){
        Swal.fire(
            'Error',
            'No data in that row.',
            'success'
        )
    }
    else{
        document.getElementById("2_vel").checked = true
        velx_txt.value = sld_table.rows[number].cells[1].innerHTML
        x_vel_slider.value = sld_table.rows[number].cells[1].innerHTML
        vely_txt.value = sld_table.rows[number].cells[2].innerHTML
        y_vel_slider.value = sld_table.rows[number].cells[2].innerHTML
        start_height.value = sld_table.rows[number].cells[3].innerHTML
        start_height_slider.value = sld_table.rows[number].cells[3].innerHTML
        grav_strength.value = sld_table.rows[number].cells[4].innerHTML
        grav_slider.value = sld_table.rows[number].cells[4].innerHTML
        if(sld_table.rows[number].cells[5].innerHTML != "n/a"){
            drag_coeff_box.value = sld_table.rows[number].cells[5].innerHTML
            drag_coef_slider.value = sld_table.rows[number].cells[5].innerHTML
            mass_box.value = sld_table.rows[number].cells[6].innerHTML
            mass_slider.value = sld_table.rows[number].cells[6].innerHTML
            diam_box.value = sld_table.rows[number].cells[7].innerHTML
            diam_slider.value = sld_table.rows[number].cells[7].innerHTML
    }
    ball.Radius = (diam_box.value)/2
    ball.Pos_X = x_start
    ball.Pos_Y  = y_start/1 + start_height.value/1 + 0.001/1
    ctx.clearRect(0,0,canvas_main.width, canvas_main.height)
    show_coord()
    graph()
    ball.draw_circle()
    running = false
    set_frame(max_x)
    console.log(ball.Pos_Y)
    console.log(ball.Radius)
}
}
//function to upload runs
function upload_runs() {
    localStorage.clear()
    for (var i = 1; i < 7; i++){
        if(sld_table.rows[i].cells[1].innerHTML != "--"){
            var table_row_data = ""
            for (var j = 1; j < 8; j++){
                table_row_data = table_row_data + sld_table.rows[i].cells[j].innerHTML
                if(j < 7){
                    table_row_data += ":"
                }
            }
            localStorage.setItem(i, table_row_data)
        }
    }
}
//defining the table as a global variable so i can access the table throughout all the functions without having to individually call it
var sld_table = document.getElementById("sld_table")
for (var i = 1; i < 7; i++){
    if(localStorage.getItem(i) != null){
        var table_data = localStorage.getItem(i).split(":")
        for (var j = 1; j < 8; j++){
            sld_table.rows[i].cells[j].innerHTML = table_data[j-1]
        }
    }
}

//function to calculate and draw the forces on the ball when the user wants it
function calc_force(){
    //force is only gravity
    var force_y = ball.Mass * ball.Acc_Y
    var force_x = ball.Mass * ball.Acc_X
    ctx.beginPath()
    ctx.strokeStyle = 'purple'
    ctx.lineWidth = 3
    ctx.moveTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y))
    ctx.lineTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y + force_y * 0.1))
    ctx.moveTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y))
    ctx.lineTo(scale_x(ball.Pos_X + force_x * 0.1), scale_y(ball.Pos_Y))
    ctx.stroke()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
}
//function to calculate and show the acceleration vectors on the ball
function calc_acc(){
    ctx.beginPath()
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 3
    ctx.moveTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y))
    ctx.lineTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y + ball.Acc_Y * 0.2))
    ctx.moveTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y))
    ctx.lineTo(scale_x(ball.Pos_X  + ball.Acc_X * 2), scale_y(ball.Pos_Y))
    ctx.stroke()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
}
//function to calculate and show the velocity vectors on the ball
function calc_vel() {
    ctx.beginPath()
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 3
    ctx.moveTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y))
    ctx.lineTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y + ball.Vel_Y * 0.2))
    ctx.moveTo(scale_x(ball.Pos_X), scale_y(ball.Pos_Y))
    ctx.lineTo(scale_x(ball.Pos_X  + ball.Vel_X * 0.2), scale_y(ball.Pos_Y))
    ctx.stroke()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
}
//function to show the path of the ball
function show_path(x_positions, y_positions) {
    ctx.beginPath()
    ctx.moveTo(scale_x(x_positions[0]), scale_y(y_positions[0]))
    for (var i = 0; i < x_positions.length - 1; i++){
        ctx.lineTo(scale_x(x_positions[i+1]), scale_y(y_positions[i+1]))
    }
    ctx.stroke()
}
//function to pause the motion
function pause_motion(){
    if(is_paused == false){
        play_pause_button.innerHTML = "Play"
        ball_temp = new cirlce(ball.Radius, ball.Mass, ball.Pos_X, ball.Pos_Y,  ball.Vel_X, ball.Vel_Y, ball.Acc_X, ball.Acc_Y, ball.Grav_acc, ball.Drag_coef, ball.Air_Dens)
        ball.Vel_X = 0
        ball.Vel_Y = 0
        ball.Acc_X = 0
        ball.Grav_acc = 0
        ball.Acc_Y = 0
        time_pause = dt
        dt = 0
        is_paused = true
    }
}
//returns a random number
function random(){
    return Math.round((Math.random()*2 - 1)*100)/1000
}
//launch button click listener
launch_button.addEventListener( 'click', () =>{
    //sets the running boolean variable to true
    running = true
    //sets the time to zero
    current_time = 0
    play_pause_button.innerHTML = "Pause"
    //arrays to show path of the object
    x_pos_array = []
    y_pos_array = []
    //this checks whether it is 2-vel or a velocity and a angle
    //this is 2-vel
    if(document.getElementById("2_vel").checked){
        var velx = velx_txt.value
        var vely = vely_txt.value
    }
    //this is velocity and angle
    else{
        var ang = ang_txt.value
        var vel = vel_txt.value
        var velx = vel * Math.cos((ang*Math.PI)/180)
        var vely = vel * Math.sin((ang*Math.PI)/180)
    }
    if(document.getElementById("air_res_choice").checked){
        var rad = diam_box.value
    }
    else{
        var rad = diam_box.value
    }
    //this is finding the starting height
    var start_height_val = Math.round(start_height.value * 100)/100
    //experimental mode
    if(experimental_mode.checked){
        velx = velx + random()*velx
        vely = vely + random()*vely
        start_height_val = start_height_val + random()*start_height_val
    }
    //this creates a new instance of the circle class overiding the old one, with the correct values
    ball = new cirlce(rad/2, mass_box.value, x_start, (y_start + start_height_val + 0.001), Math.round(velx*100)/100, Math.round(vely*100)/100, 0, 0, -world1.Grav_acc, world1.Drag_coef, world1.Air_Dens)
    Launch();
    setTimeout(function(){
        var maximum_y_value = 0;
        for (var i = 0; i < y_pos_array.length; i++){
            if(y_pos_array[i] > maximum_y_value){
                maximum_y_value = Math.round((y_pos_array[i])*100)/100
            }
        }
        console.log(maximum_y_value)
        console.log(y_start)
        maximum_y_value = maximum_y_value/1 - Math.round(y_start*100)/100
        maximum_y_value = Math.round(maximum_y_value*100)/100  
        Swal.fire(
            'Launch Information',
            ' - final x velocity: '+document.getElementById("vel_x").value+'m/s  - final y velocity: '+document.getElementById("vel_y").value + 'm/s  - horizontal distance travelled: '+document.getElementById("disp_x").value+'m  - maximum height reached: '+maximum_y_value +'m',
            'success'
        )
    },1000)
})
//reset button click listener
reset_button.addEventListener( 'click', () =>{
    reset();
} )
//add coordinate click listener
add_coord_button.addEventListener('click', () =>{
    if(x_input.value == "" || y_input.value == ""){
        Swal.fire(
            'Error',
            'No value entered into boxes.',
            'success'
        )
    }
    else{
        add_coordinate()
    }
})

//delete button click listener
delete_coord_button.addEventListener('click', () => {
    var num = document.getElementById("coord_list").value
    delete_coord(num)
})

//save run button click listener
save_run_button.addEventListener('click', () => {
    save_run()
})

//load run button click listener
load_run_button.addEventListener('click', () => {
    var num = document.getElementById("load_delete_run_list").value
    load_run(num)
})

//delete run button click listener
delete_run_button.addEventListener('click', () => {
    var num = document.getElementById("load_delete_run_list").value
    delete_run(num)
})
upload_run_button.addEventListener('click', () => {
    upload_runs()
})
clear_button.addEventListener('click',  () => {
    localStorage.clear()
})

//initiating variables outside the event listener, so can be accessed throughout
//time pause saves the dt value
var time_pause;
//creates a temporary instance of the circle class in order to save the attributes when paused
var ball_temp;
//variable to prevent pausing multiple times
var is_paused = false;
//play pause button event listener
play_pause_button.addEventListener("click", () => {
    if(running == true){
        if(play_pause_button.innerHTML == "Play"){
            play_pause_button.innerHTML = "Pause"
            ball = new cirlce(ball_temp.Radius, ball_temp.Mass, ball_temp.Pos_X, ball_temp.Pos_Y,  ball_temp.Vel_X, ball_temp.Vel_Y, ball_temp.Acc_X, ball_temp.Acc_Y, ball_temp.Grav_acc, ball_temp.Drag_coef, ball_temp.Air_Dens)
            dt = time_pause
            Launch()
        }
        else{
            pause_motion()
        }
    }
})
//doesnt work
foward_button.addEventListener("click", () =>{

})
//doesnt work
back_button.addEventListener("click", () =>{

})

speed_up_button.addEventListener("click", () => {
    var speeds = ["0.3x", "0.5x", "1x", "2x", "3x"]
    var play_speed = [1/2400, 1/1600, 1/800, 1/400, 3/800]
    for (var i = 0; i <speeds.length; i++){
        if(i == 4){
            Swal.fire(
                'Information',
                'Maximum speed reached.',
                'success'
            )
            break
        }
        if(document.getElementById("an_speed_box").value == speeds[i]){
            if(is_paused){
                time_pause = play_speed[i+1]
            }
            else{
                dt = play_speed[i+1]
            }
            document.getElementById("an_speed_box").value = speeds[i+1]
            break
        }
    }
})

slow_down_button.addEventListener("click", () => {
    var speeds = ["0.3x", "0.5x", "1x", "2x", "3x"]
    var play_speed = [1/2400, 1/1600, 1/800, 1/400, 3/800]
    if(document.getElementById("an_speed_box").value == speeds[0]){
        Swal.fire(
            'Information',
            'Minumum speed reached.',
            'success'
        )
    }
    else{
    for (var i = 0; i <speeds.length; i++){
        if(document.getElementById("an_speed_box").value == speeds[i]){
            if(is_paused){
                time_pause = play_speed[i-1]
            }
            else{
                dt = play_speed[i-1]
            }
            document.getElementById("an_speed_box").value = speeds[i-1]
            break
        }
    }
}
})

zoom_in_button.addEventListener("click", () => {
    var widths = [25, 50, 75, 100, 125, 150, 175, 200]
    var heights = [10, 35, 60, 85, 110, 135, 160, 185]
    for (var i = 0; i < widths.length; i++){
        if(i == widths.length - 1){
            Swal.fire(
                'Information',
                'Minimum zoom reached.',
                'success'
            )
            break
        }
        if(max_x == widths[i]){
            max_x = widths[i+1]
            max_y = heights[i+1]
            ctx.clearRect(0, 0,canvas_main.width, canvas_main.height)
            graph()
            set_frame(max_x)
            x_start = (50*max_x)/canvas_main.width
            y_start = ((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height)
            ball.Pos_X = x_start
            ball.Pos_Y = y_start/1 + start_height.value/1 + 0.001/1
            ball.draw_circle()
            running = false
            document.getElementById("time_box").value = "0s"
            play_pause_button.innerHTML = "Play"
            break
        }
    }
})

zoom_out_button.addEventListener("click", () => {
    var widths = [25, 50, 75, 100, 125, 150, 175, 200]
    var heights = [10, 35, 60, 85, 110, 135, 160, 185]
    if(max_x == widths[0]){
        Swal.fire(
            'Information',
            'Maximum zoom reached.',
            'success'
        )
    }
    else{
    for (var i = 1; i < widths.length; i++){
        if(max_x == widths[i]){
            max_x = widths[i-1]
            max_y = heights[i-1]
            ctx.clearRect(0, 0,canvas_main.width, canvas_main.height)
            graph()
            set_frame(max_x)
            x_start = (50*max_x)/canvas_main.width
            y_start = ((50*max_y)/canvas_main.height + ball.Radius*max_y/canvas_main.height)
            ball.Pos_X = x_start
            ball.Pos_Y = y_start/1 + start_height.value/1 + 0.001/1
            ball.draw_circle()
            running = false
            document.getElementById("time_box").value = "0s"
            play_pause_button.innerHTML = "Play"
            break
        }
    }
}
})


force_check.addEventListener('change', () => {
    if(force_check.checked == true){
        calc_force()
    }
    else{
        ctx.clearRect(0, 0, canvas_main.width, canvas_main.height)
        graph()
        ball.draw_circle()
        set_frame(max_x)
        if(acc_check.checked){
            calc_acc()
        }
        if(vel_check.checked){
            calc_vel()
        }
        if(path_check.checked){
            show_path()
        }
    }
})

acc_check.addEventListener('change', () => {
    if(acc_check.checked){
        calc_acc()
    }
    else{
        ctx.clearRect(0, 0, canvas_main.width, canvas_main.height)
        graph()
        ball.draw_circle()
        set_frame(max_x)
        if(force_check.checked){
            calc_force()
        }
        if(vel_check.checked){
            calc_vel()
        }
        if(path_check.checked){
            show_path()
        }
    }
})

vel_check.addEventListener('change', () => {
    if(vel_check.checked){
        calc_vel()
    }
    else{
        ctx.clearRect(0, 0, canvas_main.width, canvas_main.height)
        graph()
        ball.draw_circle()
        set_frame(max_x)
        if(acc_check.checked){
            calc_acc()
        }
        if(force_check.checked){
            calc_force()
        }
        if(path_check.checked){
            show_path()
        }
    }
})

path_check.addEventListener('change', () => {
    if(path_check.checked){
        show_path()
    }
    else{
        ctx.clearRect(0, 0, canvas_main.width, canvas_main.height)
        graph()
        ball.draw_circle()
        set_frame(max_x)
        if(acc_check.checked){
            calc_acc()
        }
        if(force_check.checked){
            calc_force()
        }
        if(vel_check.checked){
            calc_vel()
        }
    }
})

//target coordinate check listeners
tar_check_1.addEventListener('change', () =>{
    if(document.getElementById("x_coord_1").innerHTML == "--"){
        Swal.fire(
            'Error',
            'No coordinate in that row.',
            'success'
        )
        tar_check_1.checked = false
    }
    else{
        if(tar_check_1.checked){
            draw_coord(document.getElementById("x_coord_1").innerHTML, document.getElementById("y_coord_1").innerHTML)
        }
        else{
            clear_coord(document.getElementById("x_coord_1").innerHTML, document.getElementById("y_coord_1").innerHTML)
        }
}
})
tar_check_2.addEventListener('change', () =>{
    if(document.getElementById("x_coord_2").innerHTML == "--"){
        Swal.fire(
            'Error',
            'No coordinate in that row.',
            'success'
        )
        tar_check_2.checked = false
    }
    else{
    if(tar_check_2.checked){
        draw_coord(document.getElementById("x_coord_2").innerHTML, document.getElementById("y_coord_2").innerHTML)
    }
    else{
        clear_coord(document.getElementById("x_coord_2").innerHTML, document.getElementById("y_coord_2").innerHTML)
    }
}
})
tar_check_3.addEventListener('change', () =>{
    if(document.getElementById("x_coord_3").innerHTML == "--"){
        Swal.fire(
            'Error',
            'No coordinate in that row.',
            'success'
        )
        tar_check_3.checked = false
    }
    else{
    if(tar_check_3.checked){
        draw_coord(document.getElementById("x_coord_3").innerHTML, document.getElementById("y_coord_3").innerHTML)
    }
    else{
        clear_coord(document.getElementById("x_coord_3").innerHTML, document.getElementById("y_coord_3").innerHTML)
    }
}
})
tar_check_4.addEventListener('change', () =>{
    if(document.getElementById("x_coord_4").innerHTML == "--"){
        Swal.fire(
            'Error',
            'No coordinate in that row.',
            'success'
        )
        tar_check_4.checked = false
    }
    else{
    if(tar_check_4.checked){
        draw_coord(document.getElementById("x_coord_4").innerHTML, document.getElementById("y_coord_4").innerHTML)
    }
    else{
        clear_coord(document.getElementById("x_coord_4").innerHTML, document.getElementById("y_coord_4").innerHTML)
    }
}
})
tar_check_5.addEventListener('change', () =>{
    if(document.getElementById("x_coord_5").innerHTML == "--"){
        Swal.fire(
            'Error',
            'No coordinate in that row.',
            'success'
        )
        tar_check_5.checked = false
    }
    else{
    if(tar_check_5.checked){
        draw_coord(document.getElementById("x_coord_5").innerHTML, document.getElementById("y_coord_5").innerHTML)
    }
    else{
        clear_coord(document.getElementById("x_coord_5").innerHTML, document.getElementById("y_coord_5").innerHTML)
    }
}
})
tar_check_6.addEventListener('change', () =>{
    if(document.getElementById("x_coord_6").innerHTML == "--"){
        Swal.fire(
            'Error',
            'No coordinate in that row.',
            'success'
        )
        tar_check_6.checked = false
    }
    else{
    if(tar_check_6.checked){
        draw_coord(document.getElementById("x_coord_6").innerHTML, document.getElementById("y_coord_6").innerHTML)
    }
    else{
        clear_coord(document.getElementById("x_coord_6").innerHTML, document.getElementById("y_coord_6").innerHTML)
    }
}
})
tar_check_7.addEventListener('change', () =>{
    if(document.getElementById("x_coord_7").innerHTML == "--"){
        Swal.fire(
            'Error',
            'No coordinate in that row.',
            'success'
        )
        tar_check_7.checked = false
    }
    else{
    if(tar_check_7.checked){
        draw_coord(document.getElementById("x_coord_7").innerHTML, document.getElementById("y_coord_7").innerHTML)
    }
    else{
        clear_coord(document.getElementById("x_coord_7").innerHTML, document.getElementById("y_coord_7").innerHTML)
    }
}
})
tar_check_8.addEventListener('change', () =>{
    if(document.getElementById("x_coord_8").innerHTML == "--"){
        Swal.fire(
            'Error',
            'No coordinate in that row.',
            'success'
        )
        tar_check_8.checked = false
    }
    else{
    if(tar_check_8.checked){
        draw_coord(document.getElementById("x_coord_8").innerHTML, document.getElementById("y_coord_8").innerHTML)
    }
    else{
        clear_coord(document.getElementById("x_coord_8").innerHTML, document.getElementById("y_coord_8").innerHTML)
    }
}
})
