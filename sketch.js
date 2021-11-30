// ---------------
// SETUP VARIABLES
// ---------------
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
let currentInfoBox;

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

  createCanvas(canvasWidth, canvasHeight);

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
  reservoirOcean = new Reservoir(
    "Ocean Reservoir",
    "Ocean Reservoir Description Blablabla",
    res_ocean,
    canvasWidth * 0.8,
    canvasHeight * 0.25,
    0.04
  );

  reservoirTerrestial = new Reservoir(
    "Terrestial Reservoir",
    "Terrestial Reservoir Description Blablabla",
    res_bio_avrg,
    canvasWidth * 0.55,
    canvasHeight * 0.75,
    0.3
  );

  reservoirFossil = new Reservoir(
    "Fossil Reservoir",
    "Fossil Reservoir Description Blablabla",
    res_fossil_avrg,
    canvasWidth * 0.15,
    canvasHeight * 0.5,
    0.3
  );

  currentInfoBox = new InfoBox("ANY", "Description");
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

  reservoirOcean.display();
  reservoirTerrestial.display();
  reservoirFossil.display();
  currentInfoBox.display();
}

// -------
// CLASSES
// -------
class Reservoir {
  constructor(name, description, data, positionX, positionY, scale) {
    this.name = name;
    this.description = description;
    this.data = data;
    this.x = positionX;
    this.y = positionY;
    this.diameter = data[currentYear];
    this.scale = scale;
    this.infoBox = new InfoBox(this.name, this.description);
  }

  display() {
    this.diameter = this.data[currentYear];
    this.diameter = this.diameter * this.scale;
    fill(255, 255, 255, 50);
    circle(this.x, this.y, this.diameter);

    if (this.name != "Fossil Reservoir") {
      push();
      stroke(255, 0, 0);
      noFill();
      circle(this.x, this.y, min(this.data) * this.scale);
      pop();
    }

    fill(255);
    drawText(
      this.x,
      this.y,
      this.name + "\n \n" + round(this.data[currentYear], 0) + " gtC/y"
    );
  }

  clicked() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2) {
      currentInfoBox.title = this.name;
      currentInfoBox.description = this.description;
    }
  }
}

class Atmosphere {
  constructor(name, data, positionX, positionY) {
    this.name = name;
    this.data = data;
    this.positionX = positionX;
    this.positionY = positionY;
  }

  display() {}
}

class Flux {}

class InfoBox {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  changeText(title, description) {
    this.title = title;
    this.description = description;
  }

  display() {
    fill(255);
    drawText(canvasWidth * 0.8, canvasHeight * 0.8, this.title);
    drawText(canvasWidth * 0.8, canvasHeight * 0.82, this.description);
  }
}

// ---------
// FUNCTIONS
// ---------
// Draws Text at a specific location
function drawText(x, y, textVal) {
  textAlign(CENTER, CENTER);
  text(textVal, x, y);
}

// Check if one of the listed objects is clicked
function mousePressed() {
  reservoirOcean.clicked();
  reservoirTerrestial.clicked();
  reservoirFossil.clicked();
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
