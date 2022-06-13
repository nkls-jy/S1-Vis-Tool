// Module for all helper processing functions for S1-Vis app
//var uf = require('users/njy/I3:uiFunctions_extended');

//-------------------- AOI generation -----------------------
/* // not working
exports.getAOI = function(){
    if (Map.drawingTools().layers().length() > 0) {
        var feature = Map.drawingTools().toFeatureCollection().first();
        var aoi = feature.geometry();
    }else{
      var drawingTools = Map.drawingTools();
      drawingTools.setDrawModes(['polygon']);
      var aoi = drawingTools.toFeatureCollection().first();
    }
    return aoi
}*/



//-------------------- Image Composites -----------------------
var createS1Composite = function(BeginDate, EndDate, polarization, instrumentMode, orbitPass,aoi) {
    var BeginDate = ee.Date(BeginDate);
    var EndDate = ee.Date(EndDate);
    var polarization = polarization;
    var instrumentMode = instrumentMode;
    var orbitPass = orbitPass;
    var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filterDate(ee.Date(BeginDate), ee.Date(EndDate))
        .filter(ee.Filter.eq('instrumentMode', instrumentMode))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', polarization))
        .filter(ee.Filter.eq('orbitProperties_pass', orbitPass))
        .select(polarization)
        .mean()
    var s1 = s1.clip(aoi);
    return s1
}

// S2 cloud masking (from EE data catalog example)
var maskS2clouds = function(image){
    var qa = image.select('QA60');

    // Bits 10 and 11 are clouds and cirrus, respectively.
    var cloudBitMask = 1 << 10;
    var cirrusBitMask = 1 << 11;

    // Both flags should be set to zero, indicating clear conditions.
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
        .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

    return image.updateMask(mask).divide(10000);
}

// S2 Composite
var createS2Composite = function(BeginDate, EndDate, aoi){
    var BeginDate = ee.Date(BeginDate);
    var EndDate = ee.Date(EndDate);
    // var cloudPerc = 20;
    var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
        .filterDate(BeginDate, EndDate)
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 80))
        .map(maskS2clouds)
        .mean()
    var s2 = s2.clip(aoi).select(['B4', 'B3', 'B2']);
    return s2
}

// Image Stack of S1 composites
var createS1TempStack = function(img1, img2){
    //function assumes a single band of reflectance values
    var stack = ee.Image.cat(img1, img1, img2);
    var RGBstack = stack.select(stack.bandNames()).rename(['t1_1', 't1_2', 't2']);
    return RGBstack
}

//-------------------- Create Visualisation Parameters -----------------------

// create function for getting Min and Max values of image and return visualization Parameters with 98% stretch
var getMinMax = function(img1, img2){
    var minmax1 = img1.reduceRegion({
        reducer: ee.Reducer.minMax(),
        scale: 10
    })
    var minmax2 = img2.reduceRegion({
        reducer: ee.Reducer.minMax(),
        scale:10
    })
    var mm1 = minmax1.values();
    var mm2 = minmax2.values()
    var mm = ee.List(mm1).add(mm2).flatten().sort();

    var minmaxVals = mm.getInfo();
    var min = minmaxVals[0];
    var min_st = min * 0.99;

    var max = minmaxVals[minmaxVals.length-1]
    var max_st = max * 0.99;

    var visParams = {
        min: min_st,
        max: max_st
    }
    return visParams
}
// visParams for the S1 RGB stack
var stackVis = function(stack){
    var dic = stack.reduceRegion({
        reducer: ee.Reducer.percentile([5, 95]),
        scale: 10
    })
    var pDict = dic.getInfo();
    //print(pDict)
    var visParams = {
        min: [pDict['t1_1_p5'], pDict['t1_2_p5'], pDict['t2_p5']],
        max: [pDict['t1_1_p95'], pDict['t1_2_p95'], pDict['t2_p95']]
    };
    return visParams
}

// visParams for stretching with StdDev (used for S2 composites)
var S2Vis = function(image, stdDev){
    var stats = image.reduceRegion({
        reducer: ee.Reducer.mean().combine({reducer2:ee.Reducer.stdDev(), sharedInputs:true})
            .setOutputs(['mean', 'stddev']),
        scale: 10,
        bestEffort: true
    })
    var minList = ee.List([ee.Number(stats.get('B4_mean')).subtract(ee.Number(stdDev).multiply(ee.Number(stats.get('B4_stddev'))))])
        .add(ee.Number(stats.get('B3_mean')).subtract(ee.Number(stdDev).multiply(ee.Number(stats.get('B3_stddev')))))
        .add(ee.Number(stats.get('B2_mean')).subtract(ee.Number(2).multiply(ee.Number(stats.get('B2_stddev')))));

    var maxList = ee.List([ee.Number(stats.get('B4_mean')).add(ee.Number(stdDev).multiply(ee.Number(stats.get('B4_stddev'))))])
        .add(ee.Number(stats.get('B3_mean')).add(ee.Number(stdDev).multiply(ee.Number(stats.get('B3_stddev')))))
        .add(ee.Number(stats.get('B2_mean')).add(ee.Number(stdDev).multiply(ee.Number(stats.get('B2_stddev')))));

    var s2VisParams = {
        min: minList.getInfo(),
        max: maxList.getInfo(),
        bands: ['B4', 'B3', 'B2'],
    };
    return s2VisParams
}

// -------------------------------------------------------------------
// Drawing Tools function


//---------- Attach functions to export Variables -------------
exports.createS1Composite = createS1Composite;
exports.maskS2clouds = maskS2clouds;
exports.createS2Composite = createS2Composite;
exports.createS1TempStack = createS1TempStack;
exports.getMinMax = getMinMax;
exports.stackVis = stackVis;
exports.S2Vis = S2Vis;
