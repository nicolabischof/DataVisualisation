// ---------------
// SETUP VARIABLES
// ---------------
let canvas;
let canvasWidth = 3840;
let canvasHeight = 2160;
let font;
let fontsize = 40;
// --------------
// DATA VARIABLES
// --------------
let baseData;
let year;
let ppm;
let temperature;
let coal_emission;
let oil_emission;
let gas_emission;
let cement_emission;
let flaring_emission;
let other_emission;
let fossil_emission_total;
let landuse_sink;
let landuse_emission;
let landuse_balance;
let bio_sink;
let ocean_sink;
let atmosphere_growth;
let res_gas_min;
let res_gas_max;
let res_gas_avrg;
let res_coal_min;
let res_coal_max;
let res_coal_avrg;
let res_oil_min;
let res_oil_max;
let res_oil_avrg;
let res_fossil_min;
let res_fossil_max;
let res_fossil_avrg;
let res_soil_min;
let res_soil_max;
let res_soil_avrg;
let res_veg_min;
let res_veg_max;
let res_ver_avrg;
let res_bio_min;
let res_bio_max;
let res_bio_avrg;
let res_ocean;
let res_atmosphere;
let res_permafrost;
// ----------------
// GLOBAL VARIABLES
// ----------------
let currentYear;

// -------
// PRELOAD
// -------
function preload() {
  //baseData = loadTable("data/carbonCycleData19592020.csv", "csv", "header");
  baseData = loadTable("data/carbonCycleData17512100.csv", "csv", "header");

  fontRegular = loadFont("fonts/Montserrat-Regular.ttf");
  fontBold = loadFont("fonts/Montserrat-Bold.ttf");
  fontThin = loadFont("fonts/Montserrat-Thin.ttf");
}
// -----
// SETUP
// -----
function setup() {
  // ----
  // DATA
  // ----
  year = baseData.getColumn("year");
  ppm = baseData.getColumn("ppm");
  temperature = baseData.getColumn("temperature");
  coal_emission = baseData.getColumn("coal");
  oil_emission = baseData.getColumn("oil");
  gas_emission = baseData.getColumn("gas");
  cement_emission = baseData.getColumn("cement");
  flaring_emission = baseData.getColumn("flaring");
  other_emission = baseData.getColumn("other");
  fossil_emission_total = baseData.getColumn("fossil_total");
  landuse_sink = baseData.getColumn("landuse_sink");
  landuse_emission = baseData.getColumn("landuse_emission");
  landuse_balance = baseData.getColumn("landuse_balance");
  bio_sink = baseData.getColumn("bio_sink");
  ocean_sink = baseData.getColumn("ocean_sink");
  atmosphere_growth = baseData.getColumn("atmosphere_growth");
  res_gas_min = baseData.getColumn("res_gas_min");
  res_gas_max = baseData.getColumn("res_gas_max");
  res_gas_avrg = baseData.getColumn("res_gas_avrg");
  res_coal_min = baseData.getColumn("res_coal_min");
  res_coal_max = baseData.getColumn("res_coal_max");
  res_coal_avrg = baseData.getColumn("res_coal_avrg");
  res_oil_min = baseData.getColumn("res_oil_min");
  res_oil_max = baseData.getColumn("res_oil_max");
  res_oil_avrg = baseData.getColumn("res_oil_avrg");
  res_fossil_min = baseData.getColumn("res_fossil_min");
  res_fossil_max = baseData.getColumn("res_fossil_max");
  res_fossil_avrg = baseData.getColumn("res_fossil_avrg");
  res_soil_min = baseData.getColumn("res_soil_min");
  res_soil_max = baseData.getColumn("res_soil_max");
  res_soil_avrg = baseData.getColumn("res_soil_avrg");
  res_veg_min = baseData.getColumn("res_veg_min");
  res_veg_max = baseData.getColumn("res_veg_max");
  res_veg_avrg = baseData.getColumn("res_ver_avrg");
  res_bio_min = baseData.getColumn("res_bio_min");
  res_bio_max = baseData.getColumn("res_bio_max");
  res_bio_avrg = baseData.getColumn("res_bio_avrg");
  res_ocean = baseData.getColumn("res_ocean");
  res_atmosphere = baseData.getColumn("res_atmosphere");
  res_permafrost = baseData.getColumn("res_permafrost");

  // -----
  // TABLE
  // -----
  currentYear = baseData.getRows().length - 1;

  canvas = createCanvas(canvasWidth, canvasHeight);

  year_slider = createSlider(
    0,
    baseData.getRows().length - 1,
    baseData.getRows().length - 1
  );
  year_slider.position(150, canvasHeight * 0.92);
  year_slider.size(1000);

  textFont(fontBold);
  textSize(fontsize);

  // -------
  // CLASSES
  // -------
  reservoirAtmosphere = new Atmosphere(
    "Atmosphere",
    res_atmosphere,
    ppm,
    temperature,
    [348, 100, 81, 48, 21],
    canvasWidth * 0.5,
    canvasHeight * 0.5,
    0.7
  );

  reservoirOcean = new Reservoir(
    "Ocean Reservoir",
    res_ocean,
    canvasWidth * 0.8,
    canvasHeight * 0.25,
    0.04
  );

  reservoirTerrestial = new Reservoir(
    "Terrestial Reservoir",
    res_bio_avrg,
    canvasWidth * 0.55,
    canvasHeight * 0.75,
    0.3
  );

  reservoirFossil = new Reservoir(
    "Fossil Reservoir",
    res_fossil_avrg,
    canvasWidth * 0.15,
    canvasHeight * 0.5,
    0.3
  );
}
// ----
// DRAW
// ----
function draw() {
  background(0);

  // -----
  // INPUT
  // -----
  currentYear = year_slider.value();

  // ------
  // OUTPUT
  // ------
  fill(255);
  drawText(150, canvasHeight * 0.9, year[currentYear]);

  reservoirAtmosphere.display();
  reservoirOcean.display();
  reservoirTerrestial.display();
  reservoirFossil.display();
}

// -------
// CLASSES
// -------
class Reservoir {
  constructor(name, data, positionX, positionY, scale) {
    this.name = name;
    this.data = data;
    this.x = positionX;
    this.y = positionY;
    this.diameter = data[currentYear];
    this.scale = scale;
  }

  display() {
    this.diameter = this.data[currentYear];
    this.diameter = this.diameter * this.scale;
    fill(255, 255, 255, 50);
    //noStroke();
    circle(this.x, this.y, this.diameter);
    fill(255);
    drawText(this.x, this.y, this.name + "\n \n" + round(this.data[currentYear], 0) + " gtC/y");
  }

  clicked() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2) {
      //DO SOMETHING
    }
  }
}

class Atmosphere {
  constructor(name, carbonData, ppmData, temperatureData, scaleIndizes, positionX, positionY, scale) {
    this.name = name;
    this.carbonData = carbonData;
    this.ppmData = ppmData;
    this.temperatureData = temperatureData;
    this.scaleIndizes = scaleIndizes;
    this.x = positionX;
    this.y = positionY;
    this.scale = scale;
  }

  display() {
    this.drawScales(radians(45));
    this.diameter = this.carbonData[currentYear];
    this.diameter = (this.diameter * this.scale);
    fill(100);
    //noStroke();
    circle(this.x, this.y, this.diameter);
    fill(255);
    drawText(this.x, this.y, this.name + "\n \n" + round(this.carbonData[currentYear], 0) + " gtC");
  }

  drawScales(angle) {
    push();
    translate(this.x, this.y);
    push();
    canvas.drawingContext.setLineDash([6, 6]);
    noFill();
    stroke(255);
    strokeWeight(1);
    for (let i = 0; i < this.scaleIndizes.length; i++) {
      let index = this.scaleIndizes[i];
      circle(0, 0, this.carbonData[index] * this.scale);
    }
    pop();

    for (let i = 0; i < this.scaleIndizes.length; i++) {
      let index = this.scaleIndizes[i];
      let radius = this.carbonData[index] * this.scale * 0.5;
      radius = radius + 8;
      let transX = radius * sin(angle);
      let transY = radius * cos(angle);
      drawText(transX, transY, this.ppmData[index] + " ppm", 12, -angle);
      drawText(-transX, -transY, "+" + this.temperatureData[index] + " °C", 12, -angle);
    }
    pop();
  }
}

class Flux {}

class InfoBox {}

// ---------
// FUNCTIONS
// ---------
// Draws Text at a specific location
function drawText(x, y, textVal, size = fontsize, rotation = 0) {
  push();
  translate(x, y);
  rotate(rotation);
  textSize(size);
  textAlign(CENTER, CENTER);
  text(textVal, 0, 0);
  pop();
}

// Check if one of the listed objects is clicked
function mousePressed() {
  reservoirOcean.clicked();
}

// Show data in console
function logExistingData() {
  if (baseData.get) {
    for (var i = 0; i < baseData.getRows().length; i++) {
      console.log(year[i]);
      console.log(ppm[i]);
      console.log(temperature[i]);
      console.log(coal_emission[i]);
      console.log(oil_emission[i]);
      console.log(gas_emission[i]);
      console.log(cement_emission[i]);
      console.log(flaring_emission[i]);
      console.log(other_emission[i]);
      console.log(fossil_emission_total[i]);
      console.log(landuse_sink[i]);
      console.log(landuse_emission[i]);
      console.log(landuse_balance[i]);
      console.log(bio_sink[i]);
      console.log(ocean_sink[i]);
      console.log(atmosphere_growth[i]);
      console.log(res_gas_min[i]);
      console.log(res_gas_max[i]);
      console.log(res_gas_avrg[i]);
      console.log(res_coal_min[i]);
      console.log(res_coal_max[i]);
      console.log(res_coal_avrg[i]);
      console.log(res_oil_min[i]);
      console.log(res_oil_max[i]);
      console.log(res_oil_avrg[i]);
      console.log(res_fossil_min[i]);
      console.log(res_fossil_max[i]);
      console.log(res_fossil_avrg[i]);
      console.log(res_soil_min[i]);
      console.log(res_soil_max[i]);
      console.log(res_soil_avrg[i]);
      console.log(res_veg_min[i]);
      console.log(res_veg_max[i]);
      console.log(res_ver_avrg[i]);
      console.log(res_bio_min[i]);
      console.log(res_bio_max[i]);
      console.log(res_bio_avrg[i]);
      console.log(res_ocean[i]);
      console.log(res_atmosphere[i]);
      console.log(res_permafrost[i]);
      console.log("---------------------------");
    }
    console.log("Number of Rows: " + baseData.getRows().length);
  } else {
    console.log("--- No data found ---");
  }
}