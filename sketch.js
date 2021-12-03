// ---------------
// SETUP VARIABLES
// ---------------
let canvas;
let canvasWidth = 3840;
let canvasHeight = 2160;
let font;
let fontsize = 40;
let bg;
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

// -----------------------------------------------------------------------
// PRELOAD
// -----------------------------------------------------------------------
function preload() {
  //baseData = loadTable("data/carbonCycleData19592020.csv", "csv", "header");
  baseData = loadTable("data/carbonCycleData17512100.csv", "csv", "header");

  fontRegular = loadFont("fonts/OpenSans-Regular.ttf");
  fontBold = loadFont("fonts/OpenSans-Bold.ttf");
  fontThin = loadFont("fonts/OpenSans-Light.ttf");

  bg = loadImage('data/background.png');
  //   fontRegular = loadFont("fonts/Montserrat-Regular.ttf");
  //   fontBold = loadFont("fonts/Montserrat-Bold.ttf");
  //   fontThin = loadFont("fonts/Montserrat-Thin.ttf");
}

// -----------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------
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
  canvas = createCanvas(canvasWidth, canvasHeight);

  // SLIDER
  year_slider = createSlider(
    0,
    baseData.getRows().length - 1,
    baseData.getRows().length - 1
  );
  year_slider.addClass("yearSlider");
  push();
  year_slider.position(76, canvasHeight - 60);
  year_slider.style("transform", "rotate(180deg)");
  year_slider.size(1358);
  pop();
  currentSliderValue = year_slider.value();
  oldSliderValue = year_slider.value();

  // Sets the defaul current Year
  currentYear = baseData.getRows().length - 1;

  // TEXT STYLE
  textFont(fontThin);
  textSize(fontsize);

  // -------
  // CLASSES
  // -------
  reservoirAtmosphere = new Atmosphere(
    "ATMOSPHERE",
    "this is the atmosphere, which shows we're fucked.",
    res_atmosphere,
    ppm,
    temperature,
    [348, 100, 81, 48, 21],
    1594,
    1076,
    0.60
  );

  reservoirOcean = new Reservoir(
    "OCEAN",
    "Ocean Reservoir Description Blablabla",
    res_ocean,
    canvasWidth * 0.75,
    canvasHeight * 0.2,
    0.04
  );

  reservoirTerrestial = new Reservoir(
    "BIOSPHERE",
    "Terrestial Reservoir Description Blablabla",
    res_bio_avrg,
    canvasWidth * 0.58,
    canvasHeight * 0.8,
    0.3
  );

  reservoirFossil = new Reservoir(
    "FOSSILS",
    "Fossil Reservoir Description Blablabla",
    res_fossil_avrg,
    canvasWidth * 0.15,
    canvasHeight * 0.5,
    0.3
  );

  currentInfoBox = new InfoBox(
    "THE CARBON CYCLES",
    "Most people have heard of the carbon cyle, but what's less known is the fact that there' actually two separate natural mechanisms on earth that move around carbon. this visualisation shows the slow and the fast domain of the cycle, and tries to build an understanding of why the use of fossil fuels has as big an impact it has on the environment. though a simplification, the visualisation tries to convey the science behind the call for zero fossil emission."
  );

  titleBox = new TitleBox(
    "CARBON CYCLE",
    "SLOW",
    "FAST",
    "SLOW",
    35,
    30,
    20,
    20,
    2
  );

  timeline = new Timeline(
    year,
    fossil_emission_total,
    75,
    canvasHeight - 75,
    1500,
    350
  );

  buttonChangeCycle = new Button(3280, 2030, "SLOW CYCLE");
}

// -----------------------------------------------------------------------
// DRAW
// -----------------------------------------------------------------------
function draw() {
  background(bg);
  // -----
  // INPUT
  // -----
  //Slider
  currentSliderValue = year_slider.value();
  if (oldSliderValue != currentSliderValue) {
    currentYear = year_slider.value();
    if (oldSliderValue > currentSliderValue) {
      // --> FOWARDS
      addForwardFluxPoints();
    } else {
      // BACKWARDS <--
      addBackwardFluxPoints();
    }
    oldSliderValue = currentSliderValue;
  }
  // CONSTANT FLUX
  addConstantFlux();

  // ------
  // OUTPUT
  // ------
  // Draw Fluxes
  drawAllFluxes();

  // Draw Reservoirs
  reservoirAtmosphere.display();
  reservoirOcean.display();
  reservoirTerrestial.display();
  reservoirFossil.display();

  // Draw Infos
  currentInfoBox.display();
  titleBox.display();
  timeline.display();

  // Draw Button
  buttonChangeCycle.display();
}

// -----------------------------------------------------------------------
// CLASSES
// -----------------------------------------------------------------------
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
    push();
    fill(11, 39, 55, 99);
    noStroke();
    circle(this.x, this.y, this.diameter);
    stroke(255, 225, 116);
    strokeWeight(6);
    noFill();
    circle(this.x, this.y, this.diameter);
    stroke(255, 225, 116, 80);
    strokeWeight(8);
    circle(this.x, this.y, this.diameter);
    stroke(255, 225, 116, 60);
    strokeWeight(12);
    circle(this.x, this.y, this.diameter);
    pop();

    
    if (this.name != "FOSSILS") {
      push();
      stroke(255, 255, 255, 50);
      strokeWeight(5);
      strokeCap(SQUARE);
      canvas.drawingContext.setLineDash([4, 4]);
      noFill();
      circle(this.x, this.y, min(this.data) * this.scale);
      pop();
    } else {
      push();
      stroke(255, 255, 255, 50);
      strokeWeight(5);
      strokeCap(SQUARE);
      canvas.drawingContext.setLineDash([4, 4]);
      noFill();
      circle(this.x, this.y, max(this.data) * this.scale);
      pop();
    }

    fill(255);
    if(this.name == "OCEAN"){
      drawText(
        this.x,
        this.y,
        this.name + "\n" + round(this.data[currentYear], 1) + " Gigaton Carbon"
      );
    }else{
    drawText(
      this.x,
      this.y,
      this.name + "\n" + round(this.data[currentYear], 1) + " gtC"
    );
  }
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
    this.x = positionX;
    this.y = positionY;
    this.scale = scale;

    this.chartData = {
      "ppmWidth": [PI * 0.1, PI * 0.076, PI * 0.06],
      "tempWidth": [PI * 0.085, PI * 0.067, PI * 0.05],
      "strokeWeight": [6, 7.5, 13],
      "pattern": [2, 10],
      "carbon": ["655", "860", "1070"],
      "ppm": ["410", "455", "498"],
      "temp": ["1.0", "1.5", "2.0"]
    };
  }

  display() {
    this.diameter = this.carbonData[currentYear];
    this.diameter = this.diameter * this.scale;
    fill(11, 39, 55, 99);
    noStroke();
    circle(this.x, this.y, this.diameter);
    noFill();
    stroke(255, 225, 116);
    strokeWeight(6);
    noFill();
    circle(this.x, this.y, this.diameter);
    stroke(255, 225, 116, 80);
    strokeWeight(8);
    circle(this.x, this.y, this.diameter);
    stroke(255, 225, 116, 60);
    strokeWeight(12);
    circle(this.x, this.y, this.diameter);
    this.drawMinDiameter();
    this.drawScales(PI / 4);


    fill(255);
    drawText(
      this.x,
      this.y,
      this.name + "\n" + round(this.carbonData[currentYear], 0) + " gtC"
    );
  }

  drawScales(angle) {
    push();
    translate(this.x, this.y);
    push();
    canvas.drawingContext.setLineDash(this.chartData.pattern);
    strokeCap(SQUARE);
    noFill();
    stroke(255);
    for (let i = 0; i < this.chartData.strokeWeight.length; i++) {
      let diameter = this.chartData.carbon[i] * this.scale
      strokeWeight(this.chartData.strokeWeight[i]);
      arc(0, 0, diameter, diameter, PI + angle + this.chartData.tempWidth[i], angle - this.chartData.ppmWidth[i]);
      arc(0, 0, diameter, diameter, angle + this.chartData.ppmWidth[i], angle - PI - this.chartData.tempWidth[i]);
    }
    pop();

    for (let i = 0; i < this.chartData.strokeWeight.length; i++) {
      let offset = 13;

      let radius = this.chartData.carbon[i] * this.scale * 0.5;
      radius -= offset
      let transX = radius * sin(angle);
      let transY = radius * cos(angle);
      drawText(
        transX,
        transY,
        this.chartData.ppm[i] + " ppm",
        25,
        255,
        CENTER,
        -angle
      );

      radius = this.chartData.carbon[i] * this.scale * 0.5;
      transX = radius * sin(angle);
      transY = radius * cos(angle);
      drawText(
        -transX,
        -transY,
        "+" + this.chartData.temp[i] + " °C",
        25,
        255,
        CENTER,
        -angle
      );
    }
    pop();
  }

  drawMinDiameter() {
    push();
    stroke(255, 255, 255, 50);
    strokeWeight(5);
    canvas.drawingContext.setLineDash([4, 4]);
    strokeCap(SQUARE);
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
  constructor(startX, startY, endX, endY, stepAmount = 90, diameter = 15) {
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
    fill(186, 198, 191);
    circle(this.currentVector.x, this.currentVector.y, this.diameter);
  }
}

// --------
// INFO BOX
// --------
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
    //Title
    push();
    textSize(40);
    textAlign(LEFT, BOTTOM);
    noStroke();
    fill(255);
    textWrap(WORD);
    text(this.title, 2830, 1490, 850);
    pop();
    //Description
    push();
    textSize(32);
    textAlign(LEFT, BOTTOM);
    noStroke();
    fill(255);
    textWrap(WORD);
    text(this.description, 2830, 1540, 850);
    pop();
  }
}

// ---------
// TITLE BOX
// ---------
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
    strokeWeight(1);

    // draw boxes
    line(this.x + 25, transY, this.x + this.width - 25, transY);
    line(this.x + this.width * 0.5, this.y + this.height * 0.5, this.x + this.width * 0.5, this.y + this.height);
    /*rect(this.x, this.y, this.width, this.height, 50);
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
    );*/

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
    let c = option == this.selected ? color(255, 255, 255, 50) : 255;
    drawText(x, y, option, this.textsize, c);
  }
}

// --------
// TIMELINE
// --------
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
    this.padding = 10;

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
      let pos = ((this.x + this.width) - (this.textSpace + this.selectedBarWidth)) - mouseX;
      pos += this.memberSpace * 0.5;
      let index = Math.floor(pos / this.memberSpace);
      index = constrain(index, 0, this.dates.length - 1);
      currentYear = index;
      year_slider.value(index);
    }
  }

  rectIntersect() {
    return (
      mouseX >= this.x && mouseX <= this.x + (this.width - this.textSpace - this.selectedBarWidth) &&
      mouseY >= (this.y - this.height) && mouseY <= this.y
    );
  }

  drawChart() {
    noStroke();

    for (let i = 0; i < this.dates.length; i++) {
      fill(i == currentYear ? color(255, 225, 116) : 255);
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
      if(i == currentYear){
        push();
        textFont(fontRegular);
        drawText(this.x + (this.dates.length - i) * this.memberSpace,this.y-barHeight-10,"+ " + fossil_emission_total[currentYear]+ " gtC/y",30,color(255,225,116),LEFT,-HALF_PI);
        pop();
      }
    }
  }

  drawLabel() {
    let year = this.dates[currentYear];
    let textX = this.x + this.width + this.padding - this.textSpace;
    let smallText = fontsize * 0.74;
    let bigText = fontsize * 2.5;

    drawText(
      textX,
      this.y - bigText / 2 - 1,
      year,
      bigText,
      color(255, 225, 116),
      LEFT
    );
    push();
    textFont(fontRegular);
    drawText(
      textX+15,
      this.y - bigText,
      "FOSSIL EMISSIONS",
      smallText,
      color(255, 225, 116),
      LEFT,
      -HALF_PI
    );
    pop();
  }
}

class Button {
  constructor(positionX, positionY, text) {
    this.x = positionX;
    this.y = positionY;
    this.text = text;
  }
  display() {
    push();
    noFill();
    stroke(255);
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, 900, 119, 50, 50, 50, 50);
    drawText(this.x, this.y - 10, this.text, 48);
    pop();
  }
}

// -----------------------------------------------------------------------
// FUNCTIONS
// -----------------------------------------------------------------------

// Draws Text at a specific location
function drawText(
  x,
  y,
  textVal,
  size = fontsize,
  color = 255,
  alignment = CENTER,
  rotation = 0,
  alignmentH = CENTER
) {
  push();
  translate(x, y);
  rotate(rotation);
  textSize(size);
  textAlign(alignment, alignmentH);
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

function addForwardFluxPoints() {
  let numberFactor = 5;
  let randomFactor = 200;
  // FOSSIL TO ATMOSPHERE
  if (fossil_emission_total[currentYear] <= 0.5) {
    //Draw for small Values
    FluxPointList.push(
      new FluxPoint(
        reservoirFossil.x,
        reservoirFossil.y,
        reservoirAtmosphere.x + random(-randomFactor * 0.65, randomFactor * 0.65),
        reservoirAtmosphere.y + random(-randomFactor * 0.65, randomFactor * 0.65)
      )
    );
  } else {
    //Draw for Big Numbers
    for (
      let i = 0; i <= fossil_emission_total[currentYear] * numberFactor; i++
    ) {
      FluxPointList.push(
        new FluxPoint(
          reservoirFossil.x,
          reservoirFossil.y,
          reservoirAtmosphere.x + random(-randomFactor * 0.65, randomFactor * 0.65),
          reservoirAtmosphere.y + random(-randomFactor * 0.65, randomFactor * 0.65)
        )
      );
    }
  }
  // ATMOSPHERE TO OCEAN
  if (ocean_sink[currentYear] <= 1.3) {
    //Draw for small Values
    FluxPointList.push(
      new FluxPoint(
        reservoirAtmosphere.x,
        reservoirAtmosphere.y,
        reservoirOcean.x + random(-randomFactor * 2.5, randomFactor * 2.5),
        reservoirOcean.y + random(-randomFactor * 2.5, randomFactor * 2.5)
      )
    );
  } else {
    //Draw for Big Numbers
    for (let i = 0; i <= ocean_sink[currentYear] * numberFactor; i++) {
      FluxPointList.push(
        new FluxPoint(
          reservoirAtmosphere.x,
          reservoirAtmosphere.y,
          reservoirOcean.x + random(-randomFactor * 2.5, randomFactor * 2.5),
          reservoirOcean.y + random(-randomFactor * 2.5, randomFactor * 2.5)
        )
      );
    }
  }
  // ATMOSPHERE TO BIOSPHERE
  if (bio_sink[currentYear] <= 1.0) {
    //Draw for small Values
    FluxPointList.push(
      new FluxPoint(
        reservoirAtmosphere.x,
        reservoirAtmosphere.y,
        reservoirTerrestial.x + random(-randomFactor, randomFactor),
        reservoirTerrestial.y + random(-randomFactor, randomFactor)
      )
    );
  } else {
    //Draw for Big Numbers
    for (let i = 0; i <= bio_sink[currentYear] * numberFactor; i++) {
      FluxPointList.push(
        new FluxPoint(
          reservoirAtmosphere.x,
          reservoirAtmosphere.y,
          reservoirTerrestial.x + random(-randomFactor, randomFactor),
          reservoirTerrestial.y + random(-randomFactor, randomFactor)
        )
      );
    }
  }
}

function addBackwardFluxPoints() {
  let numberFactor = 5;
  let randomFactor = 100;
  // ATMOSPHERE TO FOSSIL
  if (fossil_emission_total[currentYear] <= 1.0) {
    //Draw for small Values
    FluxPointList.push(
      new FluxPoint(
        reservoirAtmosphere.x,
        reservoirAtmosphere.y,
        reservoirFossil.x + random(-randomFactor, randomFactor),
        reservoirFossil.y + random(-randomFactor, randomFactor)
      )
    );
  } else {
    for (
      let i = 0; i <= fossil_emission_total[currentYear] * numberFactor; i++
    ) {
      FluxPointList.push(
        new FluxPoint(
          reservoirAtmosphere.x,
          reservoirAtmosphere.y,
          reservoirFossil.x + random(-randomFactor + 50, randomFactor - 50),
          reservoirFossil.y + random(-randomFactor + 50, randomFactor - 50)
        )
      );
    }
  }
  // OCEAN TO ATMOSPHERE
  if (ocean_sink[currentYear] <= 1.3) {
    //Draw for small Values
    FluxPointList.push(
      new FluxPoint(
        reservoirOcean.x,
        reservoirOcean.y,
        reservoirFossil.x + random(-randomFactor, randomFactor),
        reservoirFossil.y + random(-randomFactor, randomFactor)
      )
    );
  } else {
    //Draw for Big Numbers
    for (let i = 0; i <= ocean_sink[currentYear] * numberFactor; i++) {
      FluxPointList.push(
        new FluxPoint(
          reservoirOcean.x,
          reservoirOcean.y,
          reservoirFossil.x + random(-randomFactor, randomFactor),
          reservoirFossil.y + random(-randomFactor, randomFactor)
        )
      );
    }
  }
  // BIOSPHERE TO ATMOSPHERE
  if (bio_sink[currentYear] <= 1.0) {
    //Draw for small Values
    FluxPointList.push(
      new FluxPoint(
        reservoirTerrestial.x,
        reservoirTerrestial.y,
        reservoirFossil.x + random(-randomFactor, randomFactor),
        reservoirFossil.y + random(-randomFactor, randomFactor)
      )
    );
  } else {
    //Draw for Big Numbers
    for (let i = 0; i <= bio_sink[currentYear] * numberFactor; i++) {
      FluxPointList.push(
        new FluxPoint(
          reservoirTerrestial.x,
          reservoirTerrestial.y,
          reservoirFossil.x + random(-randomFactor, randomFactor),
          reservoirFossil.y + random(-randomFactor, randomFactor)
        )
      );
    }
  }
}

function addConstantFlux() {
  let randomFactor = 100;
  if (frameCount % 24 == 0) {
    FluxPointList.push(
      new FluxPoint(
        reservoirTerrestial.x,
        reservoirTerrestial.y,
        reservoirAtmosphere.x + random(-randomFactor, randomFactor),
        reservoirAtmosphere.y + random(-randomFactor, randomFactor)
      )
    );
    FluxPointList.push(
      new FluxPoint(
        reservoirOcean.x,
        reservoirOcean.y,
        reservoirAtmosphere.x + random(-randomFactor, randomFactor),
        reservoirAtmosphere.y + random(-randomFactor, randomFactor)
      )
    );
    FluxPointList.push(
      new FluxPoint(
        reservoirAtmosphere.x,
        reservoirAtmosphere.y,
        reservoirTerrestial.x + random(-randomFactor, randomFactor),
        reservoirTerrestial.y + random(-randomFactor, randomFactor)
      )
    );
    FluxPointList.push(
      new FluxPoint(
        reservoirAtmosphere.x,
        reservoirAtmosphere.y,
        reservoirOcean.x + random(-randomFactor, randomFactor),
        reservoirOcean.y + random(-randomFactor, randomFactor)
      )
    );
  }
}

function drawAllFluxes() {
  FluxPointList.forEach((point) => {
    if (point.step != false) {
      point.step();
      point.display();
    }
    if (point.step() == true) {
      FluxPointList.splice(point.index, 1);
    }
  });
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