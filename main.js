//-----------  GET DOCUMENT OBJECT REFERENCES; prefixed with o_ -----
let o_City = document.getElementById('city');
let o_Width = document.getElementById('width');
let o_Height = document.getElementById('height');
let o_Speed = document.getElementById('speed');
let o_Size = document.getElementById('size');
let o_Random_Pattern = document.getElementById('random');
let o_Hourglass_Pattern = document.getElementById('hourglass');
let o_Lined_Pattern = document.getElementById('lined');
let o_Clear_Pattern = document.getElementById('clear');
let o_Generation = document.getElementById('generations');
let o_Living = document.getElementById('living');
let o_Resize = document.getElementsByClassName('resize');
let o_Go = document.getElementById('go');
let o_Initial = document.getElementById('initial');
//------------------------------------------------------------
//------  EVENT LISTENERS/X-BROWSER FUNCTION  --------------------
addEvent(window,'load',setupGame);
for(let i= 0;i<o_Resize.length;i++){
  addEvent(o_Resize[i],'input',setupGame);
}
addEvent(o_Random_Pattern,'click',makeRandom);
addEvent(o_Hourglass_Pattern,'click',makeHourglass);
addEvent(o_Lined_Pattern,'click',makeLined);
addEvent(o_Clear_Pattern,'click',makeClear);
addEvent(o_Initial,'click',initialPattern);
addEvent(o_Go,'click',conwayCaller);
addEvent(o_Size,'input',cellSize);

function addEvent(elem,evtType,func){if(elem.addEventListener){elem.addEventListener(evtType,func,false);}else if(elem.attachEvent){elem.attachEvent("on"+evtType,func);}else{elem["on"+evtType]=func;}}
//---------------------------------------------
//-------------  GET INTIAL GLOBAL letIABLES  ---------------
let city_width = parseInt(o_Width.value);
let city_height = parseInt(o_Height.value);
let game_speed = parseInt(o_Speed.value);
let a_TD,o_Table,a_Cells,timer,generation;
let d_Initial_State = {};
let DIRECTION_NAMES = ['north','north_east','east','south_east','south','south_west','west','north_west'];
//------------------------------------------------------------
function conwayCaller(){
/*
  handler for starting and stopping Game
  and saving initial state of 'city'
            */
if( generation == 0 ){	//---if initial generation, save 'city' and call conwayGame

  let cell_states = new Array();
  for(let i = 0;i < a_TD.length;i++){
    if( a_TD[i].className == 'alive' )
      cell_states.push(i);
  }
  d_Initial_State['array'] = cell_states;
  d_Initial_State['width'] = parseInt(o_Width.value);
  d_Initial_State['height'] = parseInt(o_Height.value);
  o_Go.value = 'STOP';
  timer = true;
  conwayGame();
}						
else if( timer ){	//---if running already, set timer to false so setTimeout in conwayGame isn't called
  timer = false;
  o_Go.value = 'START';
}
else if( !timer ){	//--- else it is stopped and needs restarted
  timer = true;
  o_Go.value = 'STOP';
  conwayGame();	
}
}

function initialPattern(){
for(let i = 0;i < d_Initial_State['array'].length;i++){
  a_TD[d_Initial_State['array'][i]].className = 'alive';
}
}
function conwayGame(){
if( timer ){
  let neighbor_count,current_cell,current_neighbors;
  let a_Next_Gen = [];
  let living = 0;
  for(let row = 0;row < city_height;row++){
    for(let col = 0;col < city_width;col++){
      current_cell = a_Cells[row][col]['td'];
      current_neighbors = a_Cells[row][col]['neighbors'];
      neighbor_count = 0;
      for(let direction = 0;direction < DIRECTION_NAMES.length;direction++){
        if( current_neighbors[DIRECTION_NAMES[direction]].className == 'alive' )
          neighbor_count++;
      }
      if( neighbor_count == 3  || ( neighbor_count == 2 && current_cell.className == 'alive' ) )
        a_Next_Gen.push(true)
      else
        a_Next_Gen.push(false);
    }
  }
  generation++;
  for(let i = 0; i < a_Next_Gen.length; i++){
    if(a_Next_Gen[i]){
      a_TD[i].className = 'alive';
      living++;
    }
    else{
      a_TD[i].className = 'dead';
    }
  }
  o_Generation.textContent = generation;
  o_Living.textContent = living;
  timer = setTimeout(conwayGame,parseInt(o_Speed.value));

}
}
function setupGame(){
/* 
  FUNCTION TO SET UP THE INITIAL GAME;
  CALLED ON WINDOW-LOAD OR WHEN USER PRESSES 'RESIZE' BUTTON;
  DYNAMICALLY BUILDS <TABLE> BASED ON INPUT VALUES.
*/
timer = false;
generation = 0;
o_Generation.textContent = generation;
o_Living.textContent = 0;
let cell,temp,neighbors,up,right,down,left;;
let index = 0;
o_Table = document.getElementById('insertion_point');
a_Cells = new Array();
city_width = parseInt(o_Width.value);
city_height = parseInt(o_Height.value);
//---  BUILT TABLE_STRING  ----
let table_string = "<table style='margin: auto;' id='city'>";
for(let h = 0;h < city_height;h++){
  table_string += "<tr>";
  for(let w = 0;w < city_width;w++){
    table_string += "<td class='dead'></td>";

  }
  table_string += "</tr>";
}
table_string += "</table>";
//----  INSERT TABLE_STRING VIA DOM METHOD INNERHTML  -----
  document.getElementById('insertion_point').innerHTML = table_string;
/*	
  GET ARRAY OF ALL TD ELEMENTS IN TABLE AND CONVERT TO  2-D ARRAY a_Cells 
  WHICH HOLDS DICTIONARY ENTIRES OF ALL TD OBJECTS (HASHED 'td') WITH 
  POSITIONAL ARRAYS (HASHED 'neighbors') CORRESPONDING TO THAT TD'S NEIGHBORS' INDICES 
  WITHIN THE 2-D ARRAY a_Cells. WHILE DOM ARRAY (a_TD) IS USED FOR letIOUS METHODS,
  THE 2-D ARRAY (a_Cells) IS USED FOR THE PRIMARY FUNCTION CALL (Conway).
  2-D a_Cells ARRAY IS ESSENTIALLY A TOROIDAL COORDINATE MAPPING
*/
  //--- USE DOM METHOD TO GRAB ALL TD OBJECTS
  a_TD = document.getElementsByTagName("TD");
  for(let row = 0;row < city_height;row++){
    temp = [];
    for(let col = 0;col < city_width;col++,index++){
      cell = {};
      neighbors = {};
      cell['td'] = a_TD[index];
      up = row - 1;
      if(up < 0)
        up = city_height - 1;
      right = (col + 1) % city_width;
      down = (row + 1) % city_height;
      left = col - 1;
      if(left < 0)
        left = city_width - 1;
      neighbors['north'] = a_TD[up * city_width + col];		//[col,up];
      neighbors['north_east'] = a_TD[up * city_width + right];	//[right,up];
      neighbors['east'] = a_TD[row * city_width + right];		//[right,row];
      neighbors['south_east'] = a_TD[down * city_width + right];	//[right,row];
      neighbors['south'] = a_TD[down * city_width + col];		//[col,down];
      neighbors['south_west'] = a_TD[down * city_width + left];	//[left,down];
      neighbors['west'] = a_TD[row * city_width + left];		//[left,row];
      neighbors['north_west'] = a_TD[up * city_width + left];		//[left,up];

      cell['neighbors'] = neighbors;

      temp.push(cell);
    }
    a_Cells.push(temp);
  }
//-----  ATTACH EVENT-LISTENER TO TABLE FOR CLICKING/DRAGGING-OVER CELLS  -----
  for(let i = 0;i < a_TD.length;i++){
    addEvent(a_TD[i],'dragenter',dragClass);
    addEvent(a_TD[i],'click',changeClass);
  }
}
function setLiveCount(){
let count = 0;
for(let i = 0;i < a_TD.length;i++){
  if( a_TD[i].className == 'alive' )
    count++;
}
o_Living.textContent = count;
}
function cellSize(){
//---   Event handler for when user changes cell size
if(this.value > 0 ){
  for( let i = 0;i < a_TD.length;i++){
    a_TD[i].style.width = a_TD[i].style.height = this.value + "px";
    a_TD[i].style.borderWidth = 1;
  }
}
else{
  for( let i = 0;i < a_TD.length;i++){
    a_TD[i].style.width = a_TD[i].style.height = this.value + "px";
    a_TD[i].style.borderWidth = 0;
  }
}
}
function changeClass(e){
//---  Event handler for when user clicks on individual cells ----
if( e.target.className == 'dead' ){
  e.target.className = 'alive';
  o_Living.textContent++;
}
else{
  e.target.className = 'dead';
  o_Living.textContent--;
}
}
function dragClass(e){
if( e.target.className == 'dead' ){
  e.target.className = 'alive';
  o_Living.textContent++;
}
else{
  e.target.className = 'dead';
  o_Living.textContent--;
}
}
function makeRandom(){
//---  Event handler for random pattern
let percentage = parseInt( prompt('What percentage (0-100) of Cells do you want alive?',40) );
let rand,temp;
if( isNaN(percentage) )
  return;
else if( percentage < 0 )
  percentage = 0;
else if( percentage > 100 )
  percentage = 100;
percentage /= 100;
let cells_to_randomize = Math.ceil(a_TD.length * percentage);
let r = 0
for(; r < cells_to_randomize; r++){
  a_TD[r].className = 'alive';
}
for(;r < a_TD.length;r++){
  a_TD[r].className = 'dead';
}
for(r = 0; r < a_TD.length; r++){
  rand = Math.floor( Math.random() * a_TD.length );
  temp = a_TD[rand].className;
  a_TD[rand].className = a_TD[r].className;
  a_TD[r].className = temp;
}
setLiveCount();
}
function makeHourglass(){
//---  Event handler for pattern
let row_up = 0;
let col_left = 0;
let row_down = city_height - 1;
let col_right = city_width - 1;
while(row_up <= row_down){
  for(let c = 0;(c + col_left) <= col_right;c++){
    a_Cells[row_up][col_left+c]['td'].className = 'alive';
    a_Cells[row_down][col_left+c]['td'].className = 'alive';
  }
  row_up+=2;
  col_left+=2;
  row_down-=2;
  col_right-=2;
}
setLiveCount();
}
function makeLined(){
//---  Event handler for pattern
let row_up = 0;
let col_left = 0;
let row_down = city_height - 1;
let col_right = city_width - 1;
while(row_up <= row_down){
  for(let c = 0;(c + col_left) <= col_right;c++){
    a_Cells[row_up][col_left+c]['td'].className = 'alive';
    a_Cells[row_down][col_left+c]['td'].className = 'alive';
  }
  row_up+=2;
  col_left+=2;
  row_down-=2;
  col_right-=2;
}
row_up = col_left = 0;
row_down = city_height - 1;
col_right = city_width - 1;
while(col_left <= col_right){
  for(let r = 0;(r + row_up) <= row_down;r++){
    a_Cells[row_up+r][col_left]['td'].className = 'alive';
    a_Cells[row_down-r][col_right]['td'].className = 'alive';
  }
  row_up+=2;
  col_left+=2;
  row_down-=2;
  col_right-=2;
}
setLiveCount();
}
function makeClear(){
timer = null;
for(let i = 0;i < a_TD.length;i++)
  a_TD[i].className = 'dead';
o_Generation.textContent = '0';
o_Living.textContent = '0';
}