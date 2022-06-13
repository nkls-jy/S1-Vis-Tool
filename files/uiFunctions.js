var pf = require('users/njy/I3:processingFunctions');
// Module for all helper UI functions for S1-Vis app

// Module structure:
// 1. Make variables and functions
// 2. Attach functions to export Variables
//-------------------------------------------------------

//---------- 1. Make variables and functions-------------
//-------------------- UI Widgets -----------------------
var aoi;
var t1_1;
var t1_2;
var t2_1;
var t2_2;
var polarization;
var instrMode;
var orbitPass;
var vList;

// Styles
//var background = 'EBE9E0';
var background = 'rgba(255, 255, 255, 0.0)';

var tBoxStyle = {
    width: '110px',
    height: '30px',
    fontSize: '10px',
    margin: '0px 10px 0px 10px',
    backgroundColor: background
};

var ovPanelStyle = {
    width: '25%',
    padding: '5px',
    backgroundColor: 'EBE9E0',
    border: '2px groove lightgrey',
    //border: '1px solid black'
};

var h1 = {
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: background
};

var h2 = {
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: background
};

var text = {
    fontSize: '12px',
    backgroundColor: background
};

var highlightText = {
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.0)'
};

var createImageBoxPanelStyle = {
    //border: '2px solid grey',
    backgroundColor: 'A9A48E'
};


//------------------------------------------------
// Widgets

// OV Panel
var ovPanel = ui.Panel({style: ovPanelStyle});

// Intro Button that shows intro text
var showIntro = false;
var introTextHandler = function(){
    if(showIntro){
        showIntro = false;
        guidePanel.style().set('shown', false);
        introButton.setLabel('Click here for Guide');
    } else {
        showIntro = true;
        guidePanel.style().set('shown', true);
        introButton.setLabel('Hide Guide');
    }
};

var introButton = ui.Button({label: 'Click here for Guide', onClick: introTextHandler});

var overviewText = ui.Label({
    value: 'This app aims at enabling everyone to visualize radar data and extract information from it. Please read the guide before starting to work with the app.',
    style: text
});

var step1 = ui.Label({
    value: 'Step 1',
    style: {fontSize: '12px', margin: '8px 8px 1px 8px', fontWeight: 'bold', backgroundColor: background}
});
var step1Note = ui.Label({
    value: '• Select you Area of Interest (AOI) by using the drawing tool in the map.',
    style: {fontSize: '12px', margin: '1px 8px 1px 8px', backgroundColor: background}
});
var step2 = ui.Label({
    value: 'Step 2',
    style: {fontSize: '12px', margin: '8px 8px 1px 8px', fontWeight: 'bold', backgroundColor: background}
});
var step2Note = ui.Label({
    value: '• Specify all relevant parameters for the radar data.',
    style: {fontSize: '12px', margin: '1px 8px 1px 8px', backgroundColor: background}
});
var step2Note1 = ui.Label({
    value: '• Currently all fields need to be filled, format requirements are highlighted in the respective boxes.',
    style: {fontSize: '12px', margin: '1px 8px 1px 8px', backgroundColor: background}
});
var step2Note2 = ui.Label({
    value: '• Create the images and the enter the viewing mode by clicking the button.',
    style: {fontSize: '12px', margin: '1px 8px 1px 8px', backgroundColor: background}
});
var step2Note3 = ui.Label({
    value: '• The following images are created: Radar Images for Timestep 1 and Timestep 2, a RGB composite (T1, T1, T2) and an optical mosaic for Timestep 2.',
    style: {fontSize: '12px', margin: '1px 8px 1px 8px', backgroundColor: background}
});
var step3 = ui.Label({
    value: 'Step 3',
    style: {fontSize: '12px', margin: '8px 8px 1px 8px', fontWeight: 'bold', backgroundColor: background}
});
var step3Note = ui.Label({
    value: '• Switch between the Viewing Modes to identify areas of potential change.',
    style: {fontSize: '12px', margin: '1px 8px 1px 8px', backgroundColor: background}
});
var step4 = ui.Label({
    value: 'Step 4',
    style: {fontSize: '12px', margin: '8px 8px 1px 8px', fontWeight: 'bold', backgroundColor: background}
});
var step4Note = ui.Label({
    value: '• Enter the digitisation mode to create polygons representing possible change.',
    style: {fontSize: '12px', margin: '1px 8px 1px 8px', backgroundColor: background}
});
var step5 = ui.Label({
    value: 'Step 5',
    style: {fontSize: '12px', margin: '8px 8px 1px 8px', fontWeight: 'bold', backgroundColor: background}
});
var step5Note = ui.Label({
    value: '• Export your results via the download button.',
    style: {fontSize: '12px', margin: '1px 8px 1px 8px', backgroundColor: background}
});

var guidePanel = ui.Panel({
    widgets: [
        step1,
        step1Note,
        step2,
        step2Note,
        step2Note1,
        step2Note2,
        step2Note3,
        step3,
        step3Note,
        step4,
        step4Note,
        step5,
        step5Note
    ],
    style: {shown: false, backgroundColor: background}
});

var panelBreak1 = ui.Panel(null, null, {stretch: 'horizontal', height: '1px', backgroundColor: '000', margin: '8px 0px 8px 0px'});
var panelBreak2 = ui.Panel(null, null, {stretch: 'horizontal', height: '1px', backgroundColor: '000', margin: '8px 0px 8px 0px'});
var panelBreak3 = ui.Panel(null, null, {stretch: 'horizontal', height: '1px', backgroundColor: '000', margin: '8px 0px 8px 0px'});
var panelBreak4 = ui.Panel(null, null, {stretch: 'horizontal', height: '1px', backgroundColor: '000', margin: '8px 0px 8px 0px'});

// Intro Panel
var introPanel = ui.Panel({
    widgets: [
        ui.Label({
            value: 'S1 Visualization Tool',
            style: h1
        }),
        overviewText,
        introButton,
        guidePanel,
        panelBreak1],
    style: {backgroundColor: background}
});
introPanel.style().set('backgroundColor', background);

// Textboxes for Start and End Dates
var t1_1_box = ui.Textbox({
    placeholder: 'e.g. 2019-01-01',
    //value: '2019-01-01', //for faster testing
    style: tBoxStyle
});

var t1_2_box = ui.Textbox({
    placeholder: 'e.g. 2019-01-31',
    //value: '2019-01-31', //for faster testing
    style: tBoxStyle
});

var t2_1_box = ui.Textbox({
    placeholder: 'e.g. 2020-11-01',
    //value: '2020-11-01', //for faster testing
    style: tBoxStyle
});

var t2_2_box = ui.Textbox({
    placeholder: 'e.g. 2020-11-30',
    //value: '2020-11-30', //for faster testing
    style: tBoxStyle
});

var polarizationBox = ui.Textbox({
    placeholder: 'VV or VH',
    //value: 'VV', //for faster testing
    style: {
        width: '70px',
        height: '30px',
        fontSize: '10px',
        margin: '0px 10px 0px 10px',
        backgroundColor: background
    }
});

var instrumentBox = ui.Textbox({
    placeholder: 'IW, EW or SM',
    //value: 'IW', //for faster testing
    style: {
        width: '70px',
        height: '30px',
        fontSize: '10px',
        margin: '0px 10px 0px 10px',
        backgroundColor: background
    }
});

var orbitBox = ui.Textbox({
    placeholder: 'ASCENDING or DESCENDING',
    //value: 'ASCENDING', //for faster testing
    style: {
        width: '170px',
        height: '30px',
        fontSize: '10px',
        margin: '0px 10px 0px 10px',
        backgroundColor: background
    }
});
var checkImagery = ui.Button({
    label: 'Create Images',
    /*
    onClick: function(vList){
      t1_1 = t1_1_box.getValue();
      t1_2 = t1_2_box.getValue();
      t2_1 = t2_1_box.getValue();
      t2_2 = t2_2_box.getValue();
      polarization = polarizationBox.getValue();
      instrMode = instrumentBox.getValue();
      orbitPass = orbitBox.getValue();
      vList = ee.List([t1_1, t1_2, t2_1, t2_2, polarization, instrMode, orbitPass]);
      //print(vList);
      exports.vList = vList;
      //return exports.vList;
    }, */
    style: {stretch: 'horizontal', backgroundColor: background}
});


var Modes = {
    "Split Panel": 1,
    "Linked Maps": 2
};
/*
var switchModes = function(selection){
  if (Modes[selection] == 1) {
    //create Split Panel
    ui.root.widgets().reset([ovPanel, splitP])
  }else{
    //create Linked Maps
    ui.root.widgets().reset([ovPanel, linkMaps])
  }
}
*/
var viewMode = ui.Select({
    items: Object.keys(Modes),
    value: "Split Panel",
    style: {stretch: 'horizontal', backgroundColor: background}
});

// Button for Step 4: Digitizing Data on Map
var digMode = ui.Button({
    label: 'Start Digitization',
    style: {stretch: 'horizontal', backgroundColor: background}
});

// UI for Export section
var fLabel = ui.Label('Optional: Enter a Filename: ', {backgroundColor: background, fontSize: '12px'});

var fileName = ui.Textbox({
    placeholder: 'Filename here',
    style: {
        width: '150px',
        height: '20px',
        fontSize: '9px',
        margin: '0px 5px 0px 5px',
        backgroundColor: background
    }
});

var fPanel = ui.Panel({widgets: [fLabel, fileName], layout: ui.Panel.Layout.flow('horizontal'), style: {stretch: 'horizontal', backgroundColor: background}});

var exButton = ui.Button({
    label: 'Get Download Link',
    style: {stretch: 'horizontal', backgroundColor: background}
});

var exLabel = ui.Label('Click here for Data Download', {stretch: 'horizontal', shown: false, color: 'white', backgroundColor: background});
var labelPan = ui.Panel({widgets: [exLabel], style: createImageBoxPanelStyle});

var exPanel = ui.Panel({widgets: [exButton, labelPan], style: {backgroundColor: background}});

// -------------------------------------------------------------
// Assemble Panel for S1 Parameters
var S1panel = ui.Panel({
    widgets: [
        ui.Label({
            value: '2) Sentinel-1 Parameters',
            style: h2}),
        ui.Label({
            value: 'Timestep 1 (Start - End)',
            style: text}),
        ui.Panel({widgets: [t1_1_box, t1_2_box], layout: ui.Panel.Layout.flow('horizontal'), style: {backgroundColor: background}}),
        ui.Label({
            value: 'Timestep 2 (Start - End)',
            style: text}),
        ui.Panel({widgets: [t2_1_box, t2_2_box], layout: ui.Panel.Layout.flow('horizontal'), style: {backgroundColor: background}}),
        ui.Panel({widgets: [
                ui.Label({
                    value: 'Polarization',
                    style: text}),
                ui.Panel({widgets: [polarizationBox], style: {backgroundColor: background}})
            ], layout: ui.Panel.Layout.flow('horizontal'), style: {backgroundColor: background}}),
        ui.Panel({widgets: [
                ui.Label({
                    value: 'Instrument Mode (IW recommended)',
                    style: text}),
                ui.Panel({widgets: [instrumentBox], style: {backgroundColor: background}})
            ], layout: ui.Panel.Layout.flow('horizontal'), style: {backgroundColor: background}}),
        ui.Panel({widgets: [
                ui.Label({
                    value: 'Orbit Pass',
                    style: text}),
                ui.Panel({widgets: [orbitBox], style: {backgroundColor: background}})
            ], style: {backgroundColor: background}}),
        ui.Panel({widgets: [checkImagery], style: createImageBoxPanelStyle}),
        panelBreak2,
        ui.Label({value: '3) Change View Mode', style: h2}),
        ui.Panel({widgets: [
                ui.Panel({widgets: [viewMode], style: {backgroundColor: 'rgba(255, 255, 255, 0.0)'}})
            ],  style: {backgroundColor: background}}),
        panelBreak3,
        ui.Label({value: '4) Digitize Change', style: h2}),
        ui.Label({value: 'When finished please press Button again to finish drawing session', style: {backgroundColor: background}}),
        digMode,
        panelBreak4,
        ui.Label({value: '5) Export Geometries', style: h2}),
        fPanel,
        exPanel
    ],
    style: {backgroundColor: background}
});

//-------------------- Functions -----------------------

var makeOverviewPanel = function(ovPanel, introPanel, S1panel){
    var ovPanel = ovPanel;
    ovPanel.add(introPanel);
    ovPanel.add(S1panel);

    return ovPanel;
};

// Layer Selector
var addLayerSelector = function(images, mapToChange, defaultValue, position) {
    var label = ui.Label('Choose image to visualize');
    // This function changes the given map to show the selected image.
    function updateMap(selection) {
        mapToChange.layers().set(0, ui.Map.Layer(images[selection]));
    }
    // Configure a selection dropdown to allow the user to choose between images,
    // and set the map to update when a user makes a selection.
    var select = ui.Select({items: Object.keys(images), onChange: updateMap});
    select.setValue(Object.keys(images)[defaultValue], true);

    var controlPanel = ui.Panel({widgets: [label, select], style: {position: position}});

    mapToChange.add(controlPanel);
};

//----------------------- Split Panel ------------------------

var createSplitPanel = function(s1_t1, s1_t2, images, visParams){
    var leftMap = ui.Map();
    leftMap.setControlVisibility(false);
    leftMap.addLayer(s1_t1, visParams, 'S1 Before');
    var leftSelector = addLayerSelector(images, leftMap, 0, 'top-left');
    //print(leftMap)

    // Create the right map
    var rightMap = ui.Map();
    rightMap.setControlVisibility(false);
    rightMap.addLayer(s1_t2, visParams, 'S1 After');
    var rightSelector = addLayerSelector(images, rightMap, 1, 'top-right');
    //print(rightMap)

    var linker = ui.Map.Linker([leftMap, rightMap]);
    //print(linker)
    // Create a SplitPanel to hold the adjacent, linked maps.
    var splitP = ui.SplitPanel({
        firstPanel: leftMap,
        secondPanel: rightMap,
        wipe: true,
        style: {stretch: 'both'}
    });

    //print(splitP)
    return splitP;
};//createSplitPanel


//--------------------- Linked Maps ------------------------
var createLinkMaps = function (images, s1_vis, stackVis, s2_vis) {
    var maps = [];

    Object.keys(images).forEach(function(name){
        var map = ui.Map();
        map.add(ui.Label(name));

        if (name == 'Radar T1' || name == 'Radar T2') {
            //map.addLayer(images[name], visParams[0], name);
            map.addLayer(images[name], null, name);
            map.setControlVisibility(false);
            maps.push(map);
        } else if (name == 'RGB composite') {
            map.addLayer(images[name], null, name);
            map.setControlVisibility(false);
            maps.push(map);
        } else {
            print(images[name])
            map.addLayer(images[name], null, name)
            map.setControlVisibility(false);
            maps.push(map);
        }
    })

    var linker = ui.Map.Linker(maps)
    // Enable zooming on the top-left map.
    maps[0].setControlVisibility({zoomControl: true});

    // Show the scale (e.g. '500m') on the bottom-right map.
    maps[2].setControlVisibility({scaleControl: true});

    // Create a grid of maps
    var mapGrid = ui.Panel(
        [
            ui.Panel([maps[0], maps[1]], null, {stretch: 'both'}),
            ui.Panel([maps[2], maps[3]], null, {stretch: 'both'})
        ],
        ui.Panel.Layout.Flow('horizontal'), {stretch: 'both'}
    );

    maps[0].centerObject(images['Radar T1']);

    return mapGrid;
};

//---------- 2. Attach functions to export Variables -------------
exports.t1_1_box = t1_1_box;
exports.t1_2_box = t1_2_box;
exports.t2_1_box = t2_1_box;
exports.t2_2_box = t2_2_box;
exports.polarizationBox = polarizationBox;
exports.instrumentBox = instrumentBox;
exports.orbitBox = orbitBox;
exports.viewMode = viewMode;

exports.fileName = fileName;
exports.exButton = exButton;
exports.exLabel = exLabel;
exports.checkImagery = checkImagery;
exports.digMode = digMode;
exports.createSplitPanel = createSplitPanel;
exports.makeOverviewPanel = makeOverviewPanel(ovPanel, introPanel, S1panel);
exports.createLinkMaps = createLinkMaps;
