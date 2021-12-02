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
let res_veg_avrg;
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
let currentSliderValue;
let oldSliderValue;
let FluxPointList = [];

// -------
// PRELOAD
// -------
function preload() {
  //baseData = loadTable("data/carbonCycleData19592020.csv", "csv", "header");
  baseData = loadTable("data/carbonCycleData17512100.csv", "csv", "header");

  fontRegular = loadFont("fonts/OpenSans-Regular.ttf");
  fontBold = loadFont("fonts/OpenSans-Bold.ttf");
  fontThin = loadFont("fonts/OpenSans-Light.ttf");

  //   fontRegular = loadFont("fonts/Montserrat-Regular.ttf");
  //   fontBold = loadFont("fonts/Montserrat-Bold.ttf");
  //   fontThin = loadFont("fonts/Montserrat-Thin.ttf");
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
  res_veg_avrg = baseData.getColumn("res_veg_avrg");
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
  push();
  year_slider.position(150, canvasHeight * 0.92);
  year_slider.style("transform", "rotate(180deg)");
  year_slider.style("color", "FF00FF");
  year_slider.size(1000);
  pop();
  currentSliderValue = year_slider.value();
  oldSliderValue = year_slider.value();

  textFont(fontBold);
  textSize(fontsize);

  // -------
  // CLASSES
  // -------
  reservoirAtmosphere = new Atmosphere(
    "Atmosphere",
    "this is the atmosphere, which shows we're fucked.",
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

  titleBox = new TitleBox(
    "Carbon Cycle",
    "slow",
    "fast",
    "slow",
    canvasWidth * 0.1,
    canvasHeight * 0.1,
    20,
    20,
    2
  );

  timeline = new Timeline(
    year,
    fossil_emission_total,
    canvasWidth * 0.03,
    canvasHeight - 500,
    canvasWidth * 0.4,
    150
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
  let numberFactor = 5;
  let randomFactor = 100;
  currentSliderValue = year_slider.value();
  if (oldSliderValue != currentSliderValue) {
    currentYear = year_slider.value();
    if (oldSliderValue > currentSliderValue) {
      // --> FOWARDS
      // FOSSIL TO ATMOSPHERE
      if (fossil_emission_total[currentYear] <= 0.5) {
        //Draw for small Values
        FluxPointList.push(
          new FluxPoint(
            reservoirFossil.x,
            reservoirFossil.y,
            reservoirAtmosphere.x + random(-randomFactor, randomFactor),
            reservoirAtmosphere.y + random(-randomFactor, randomFactor)
          )
        );
      } else {
        //Draw for Big Numbers
        for (
          let i = 0;
          i <= fossil_emission_total[currentYear] * numberFactor;
          i++
        ) {
          FluxPointList.push(
            new FluxPoint(
              reservoirFossil.x,
              reservoirFossil.y,
              reservoirAtmosphere.x + random(-randomFactor, randomFactor),
              reservoirAtmosphere.y + random(-randomFactor, randomFactor)
            )
          );
        }
      }
      // -------------------
      // ATMOSPHERE TO OCEAN
      if (ocean_sink[currentYear] <= 1.0) {
        //Draw for small Values
        FluxPointList.push(
          new FluxPoint(
            reservoirAtmosphere.x,
            reservoirAtmosphere.y,
            reservoirOcean.x + random(-randomFactor, randomFactor),
            reservoirOcean.y + random(-randomFactor, randomFactor)
          )
        );
      } else {
        //Draw for Big Numbers
        for (let i = 0; i <= ocean_sink[currentYear] * numberFactor; i++) {
          FluxPointList.push(
            new FluxPoint(
              reservoirAtmosphere.x ,
              reservoirAtmosphere.y,
              reservoirOcean.x + random(-randomFactor, randomFactor),
              reservoirOcean.y  + random(-randomFactor, randomFactor)
            )
          );
        }
      }
      // -------------------
      // ATMOSPHERE TO BIOSPHERE
      if (bio_sink[currentYear] <= 1.0) {
        //Draw for small Values
        FluxPointList.push(
          new FluxPoint(
            reservoirAtmosphere.x,
            reservoirAtmosphere.y ,
            reservoirTerrestial.x + random(-randomFactor, randomFactor),
            reservoirTerrestial.y+ random(-randomFactor, randomFactor)
          )
        );
      } else {
        //Draw for Big Numbers
        for (let i = 0; i <= bio_sink[currentYear] * numberFactor; i++) {
          FluxPointList.push(
            new FluxPoint(
              reservoirAtmosphere.x ,
              reservoirAtmosphere.y ,
              reservoirTerrestial.x+ random(-randomFactor, randomFactor),
              reservoirTerrestial.y+ random(-randomFactor, randomFactor)
            )
          );
        }
      }
      // -------------------
    } else {
      // BACKWARDS <--
      // ATMOSPHERE TO FOSSIL 
      if (fossil_emission_total[currentYear] <= 1.0) {
        //Draw for small Values
        FluxPointList.push(
          new FluxPoint(
            reservoirAtmosphere.x ,
            reservoirAtmosphere.y ,
            reservoirFossil.x + random(-randomFactor, randomFactor),
            reservoirFossil.y+ random(-randomFactor, randomFactor)
          )
        );
      } else {
        for (
          let i = 0;
          i <= fossil_emission_total[currentYear] * numberFactor;
          i++
        ) {
          FluxPointList.push(
            new FluxPoint(
              reservoirAtmosphere.x ,
              reservoirAtmosphere.y ,
              reservoirFossil.x+ random(-randomFactor+50, randomFactor-50),
              reservoirFossil.y+ random(-randomFactor+50, randomFactor-50)
            )
          );
        }
      }
      //--------------------
      // OCEAN TO ATMOSPHERE
      if (ocean_sink[currentYear] <= 1.0) {
        //Draw for small Values
        FluxPointList.push(
          new FluxPoint(
            reservoirOcean.x ,
            reservoirOcean.y ,
            reservoirAtmosphere.x+ random(-randomFactor, randomFactor),
            reservoirAtmosphere.y+ random(-randomFactor, randomFactor)
          )
        );
      } else {
        //Draw for Big Numbers
        for (let i = 0; i <= ocean_sink[currentYear] * numberFactor; i++) {
          FluxPointList.push(
            new FluxPoint(
              reservoirOcean.x,
              reservoirOcean.y ,
              reservoirAtmosphere.x + random(-randomFactor, randomFactor),
              reservoirAtmosphere.y + random(-randomFactor, randomFactor)
            )
          );
        }
      }
      // -------------------
      // BIOSPHERE TO ATMOSPHERE
      if (bio_sink[currentYear] <= 1.0) {
        //Draw for small Values
        FluxPointList.push(
          new FluxPoint(
            reservoirTerrestial.x ,
            reservoirTerrestial.y ,
            reservoirAtmosphere.x+ random(-randomFactor, randomFactor),
            reservoirAtmosphere.y+ random(-randomFactor, randomFactor)
          )
        );
      } else {
        //Draw for Big Numbers
        for (let i = 0; i <= bio_sink[currentYear] * numberFactor; i++) {
          FluxPointList.push(
            new FluxPoint(
              reservoirTerrestial.x,
              reservoirTerrestial.y,
              reservoirAtmosphere.x+ random(-randomFactor, randomFactor),
              reservoirAtmosphere.y+ random(-randomFactor, randomFactor)
            )
          );
        }
      }
      // -------------------
    }
    oldSliderValue = currentSliderValue;
  }

  // ------
  // OUTPUT
  // ------
  fill(255);
  drawText(150, canvasHeight * 0.9, year[currentYear]);

  // Draws Fluxes
  FluxPointList.forEach((point) => {
    if (point.step != false) {
      point.step();
      point.display();
    }
    if (point.step() == true) {
      FluxPointList.splice(point.index, 1);
    }
  });

  reservoirAtmosphere.display();
  reservoirOcean.display();
  reservoirTerrestial.display();
  reservoirFossil.display();
  currentInfoBox.display();
  titleBox.display();
  timeline.display();
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
    noStroke();
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
      this.name + "\n \n" + round(this.data[currentYear], 1) + " gtC/y"
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
  constructor(
    name,
    description,
    carbonData,
    ppmData,
    temperatureData,
    scaleIndizes,
    positionX,
    positionY,
    scale
  ) {
    this.name = name;
    this.description = description;
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
    this.diameter = this.diameter * this.scale;
    fill(100);
    noStroke();
    circle(this.x, this.y, this.diameter);

    this.drawMinDiameter();

    fill(255);
    drawText(
      this.x,
      this.y,
      this.name + "\n \n" + round(this.carbonData[currentYear], 0) + " gtC"
    );
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
      drawText(
        transX,
        transY,
        this.ppmData[index] + " ppm",
        12,
        255,
        CENTER,
        -angle
      );
      drawText(
        -transX,
        -transY,
        "+" + this.temperatureData[index] + " °C",
        12,
        255,
        CENTER,
        -angle
      );
    }
    pop();
  }

  drawMinDiameter() {
    push();
    stroke(255, 0, 0);
    noFill();
    circle(this.x, this.y, min(this.carbonData) * this.scale);
    pop();
  }

  clicked() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2) {
      currentInfoBox.title = this.name;
      currentInfoBox.description = this.description;
    }
  }
}

// ---------
// FLUXPOINT
// ---------
class FluxPoint {
  constructor(startX, startY, endX, endY, stepAmount = 60, diameter = 10) {
    this.startVector = createVector(startX, startY);
    this.currentVector = this.startVector;
    this.endVector = createVector(endX, endY);
    this.stepAmount = stepAmount;
    this.diameter = diameter;

    this.distance = createVector(
      this.endVector.x - this.startVector.x,
      this.endVector.y - this.startVector.y
    );
    this.stepDistance = createVector(
      this.distance.x / this.stepAmount,
      this.distance.y / this.stepAmount
    );
    this.currentStep = 0;
  }

  step() {
    if (this.currentStep < this.stepAmount) {
      this.currentVector.add(this.stepDistance);
      this.currentStep++;
      return false;
    } else {
      return true;
    }
  }

  display() {
    fill(255, 0, 0);
    circle(this.currentVector.x, this.currentVector.y, this.diameter);
  }
}

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

class TitleBox {
  constructor(
    title,
    option1,
    option2,
    selected,
    positionX,
    positionY,
    marginTB,
    marginLR,
    scale
  ) {
    this.title = title;
    this.option1 = option1;
    this.option2 = option2;
    this.selected = selected;
    this.x = positionX;
    this.y = positionY;
    this.marginTB = marginTB;
    this.marginLR = marginLR;
    this.scale = scale;

    // calculate bounding box size
    this.textsize = fontsize * this.scale;
    this.width = textWidth(this.title) * this.scale + 2 * this.marginLR;
    this.height = 2 * (this.textsize + 2 * this.marginTB);
  }

  select(option) {
    if (option == this.option1) {
      this.selected = this.option1;
      return 1;
    } else if (option == this.option2) {
      this.selected = this.option2;
      return 1;
    } else {
      return 0;
    }
  }

  display() {
    // calculate helpful coordinate
    let transY = this.y + this.height * 0.5;

    // style boxes
    noFill();
    stroke(255);
    strokeWeight(3);

    // draw boxes
    rect(this.x, this.y, this.width, this.height, 50);
    rect(this.x, transY, this.width * 0.5, this.height * 0.5, 0, 0, 0, 50);
    rect(
      this.x + this.width * 0.5,
      transY,
      this.width * 0.5,
      this.height * 0.5,
      0,
      0,
      50,
      0
    );

    // style text
    noStroke();
    fill(255);

    // draw text
    drawText(
      this.x + this.width * 0.5,
      this.y + this.height * 0.2,
      this.title,
      this.textsize
    );

    this.drawOption(
      this.x + this.width * 0.25,
      this.y + this.height * 0.7,
      this.option1
    );

    this.drawOption(
      this.x + this.width * 0.75,
      this.y + this.height * 0.7,
      this.option2
    );
  }

  drawOption(x, y, option) {
    let c = option == this.selected ? color(255, 232, 49) : 255;
    drawText(x, y, option, this.textsize, c);
  }
}

class Timeline {
  constructor(dates, values, positionX, positionY, width, height) {
    this.dates = dates;
    this.values = values;
    this.x = positionX;
    this.y = positionY;
    this.width = width;
    this.height = height;

    this.barWidth = 1;
    this.selectedBarWidth = 3;
    this.padding = 5;

    this.maxEmissionValue = max(values);
    this.textSpace = 130 + this.padding;
    this.memberSpace =
      (this.width - this.textSpace - this.selectedBarWidth) / this.dates.length;
  }

  display() {
    // noFill();
    // stroke(255);
    // rect(this.x, this.y, this.width, -this.height);

    this.drawChart();
    this.drawLabel();
  }

  clicked() {
    if (this.rectIntersect()) {
      let pos = (this.x + this.width - this.textSpace - this.selectedBarWidth) - mouseX;
      let index = Math.floor(pos / this.memberSpace);
      currentYear = index;
    }
  }

  rectIntersect() {
    return (
    mouseX >= this.x && mouseX <= this.x + (this.width - this.textSpace)
    &&
    mouseY >= (this.y - this.height) && mouseY <= this.y
    );
  }

  drawChart() {
    noStroke();

    for (let i = 0; i < this.dates.length; i++) {
      fill(i == currentYear ? color(255, 232, 49) : 255);
      let barHeight = map(
        this.values[i],
        0,
        this.maxEmissionValue,
        0,
        this.height
      );
      rect(
        this.x + (this.dates.length - i) * this.memberSpace,
        this.y,
        i == currentYear ? this.selectedBarWidth : this.barWidth,
        -barHeight
      );
    }
  }

  drawLabel() {
    let year = this.dates[currentYear];
    let textX = this.x + this.width + this.padding - this.textSpace;
    let smallText = fontsize * 0.48;
    let bigText = fontsize * 1.6;

    textFont(fontThin);

    drawText(
      textX,
      this.y - bigText / 2 - 1,
      year,
      bigText,
      color(255, 232, 49),
      LEFT
    );
    drawText(
      textX,
      this.y - bigText,
      "Fossil Emissions",
      smallText,
      color(255, 232, 49),
      LEFT
    );
  }
}

// ---------
// FUNCTIONS
// ---------
// Draws Text at a specific location
function drawText(
  x,
  y,
  textVal,
  size = fontsize,
  color = 255,
  alignment = CENTER,
  rotation = 0
) {
  push();
  translate(x, y);
  rotate(rotation);
  textSize(size);
  textAlign(alignment, CENTER);
  noStroke();
  fill(color);
  text(textVal, 0, 0);
  pop();
}

// Check if one of the listed objects is clicked
function mousePressed() {
  reservoirOcean.clicked();
  reservoirTerrestial.clicked();
  reservoirFossil.clicked();
  reservoirAtmosphere.clicked();
  timeline.clicked();
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
      console.log(res_veg_avrg[i]);
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
