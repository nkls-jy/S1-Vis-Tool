var uf = require('users/njy/I3:uiFunctions');
var pf = require('users/njy/I3:processingFunctions');

var map = ui.Map();
// Ad Dana
//map.setCenter(36.77, 36.22, 12);
// World
map.setCenter(0, 0, 2);

var aoi;

var ovPanel = uf.makeOverviewPanel;

// -----------------------------------
// Getting User AOI Routine
// ----------------------------------

var drawingTools = map.drawingTools();
drawingTools.setShown(false);


while (drawingTools.layers().length() > 0) {
    var layer = drawingTools.layers().get(0);
    drawingTools.layers().remove(layer);
}

var dummyGeometry =
    ui.Map.GeometryLayer({geometries: null, name: 'geometry', color: '23cba7'});

drawingTools.layers().add(dummyGeometry);

function clearGeometry() {
    var layers = drawingTools.layers();
    if (layers.length() > 0){
        layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
    }
}

function drawPolygon() {
    clearGeometry();
    drawingTools.setShape('polygon');
    drawingTools.draw();
}

function stopDrawing() {
    // Get the drawn geometry
    print(drawingTools.layers().length());

    if (drawingTools.layers().length() > 0) {
        aoi = drawingTools.layers().get(0).getEeObject();

        drawingTools.setShape(null);
        map.centerObject(aoi);
        map.remove(aoiPanel);
    }else{
        print('No AOI yet');
    }
}

function getLyr(drawingTools) {
    var lyr = drawingTools.toFeatureCollection();
}

drawingTools.onDraw(ui.util.debounce(stopDrawing, 500));
drawingTools.onEdit(ui.util.debounce(stopDrawing, 500));

var aoiPanel = ui.Panel({
    widgets: [
        ui.Label('1) Select your AOI'),
        ui.Button({
            label: '🔺' + ' Polygon',
            onClick: drawPolygon,
            style: {stretch: 'horizontal'}
        })
    ],
    style: {position: 'top-center'},
    layout: null,
});

// -----------------------------------
// Implementing changing the View Mode
// ----------------------------------
var Modes = {
    "Split Panel": 1,
    "Linked Maps": 2
};

uf.viewMode.onChange(
    function(selection){
        if (Modes[selection] == 1) {
            //create Split Panel
            splitP.getFirstPanel().centerObject(aoi, 14);
            ui.root.widgets().reset([ovPanel, splitP]);
        }else{
            //create Linked Maps
            ui.root.widgets().reset([ovPanel, linkMaps]);
        }
    }
);

// ------------------------------------------
// Create images

var s1_t1;
var s1_t2;
var RGBstack;
var s2_t2;

var s1_vis;
var s2_vis;
var stackVis;
var splitP;
var linkMaps;

var images = {};
var visParams = [];

var dTools = map.drawingTools();

uf.checkImagery.onClick(
    function(){
        var t1_1 = uf.t1_1_box.getValue();
        var t1_2 = uf.t1_2_box.getValue();
        var t2_1 = uf.t2_1_box.getValue();
        var t2_2 = uf.t2_2_box.getValue();
        var polarization = uf.polarizationBox.getValue();
        var instrMode = uf.instrumentBox.getValue();
        var orbitPass = uf.orbitBox.getValue();
        //create images
        s1_t1 = pf.createS1Composite(t1_1, t1_2, polarization, instrMode, orbitPass, aoi);
        s1_t2 = pf.createS1Composite(t2_1, t2_2, polarization, instrMode, orbitPass, aoi);
        RGBstack = pf.createS1TempStack(s1_t1, s1_t2);
        s2_t2 = pf.createS2Composite(t2_1, t2_2, aoi);

        // get S1 Vis Params
        s1_vis = pf.getMinMax(s1_t1, s1_t2);
        stackVis = pf.stackVis(RGBstack);
        s2_vis = pf.S2Vis(s2_t2, 3);
        //print(s2_vis)
        visParams.push(s1_vis, stackVis, s2_vis);
        //print(visParams)
        // remove drawn AOI from Map
        drawingTools.layers().remove(drawingTools.layers().get(0));
        map.clear();

        // add images to Dictionary
        images['Radar T1'] = s1_t1.visualize(s1_vis);
        images['Radar T2'] = s1_t2.visualize(s1_vis);
        images['RGB composite'] = RGBstack.visualize(stackVis);
        images['Optical T2'] = s2_t2.visualize(s2_vis);
        //print(images)

        // create Split Panel as Default
        splitP = uf.createSplitPanel(s1_t1, s1_t2, images, s1_vis);
        splitP.getFirstPanel().centerObject(aoi);
        ovPanel.style().set('width', '25%');
        ui.root.widgets().reset([ovPanel, splitP]);


        // also create Linked Maps
        //linkMaps = uf.createLinkMaps(images, visParams);
        linkMaps = uf.createLinkMaps(images, s1_vis, stackVis, s2_vis);

        dTools = linkMaps.widgets().get(1).widgets().get(0).drawingTools();
        dTools.setShown(false);

    }
);

function clearGeometryDTools(){
    var layers = dTools.layers();
    layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
}

function drawPolygonDTools(){
    clearGeometryDTools();
    dTools.setShape('polygon');
    dTools.draw();
}

var fc;

uf.digMode.onClick(
    function(){
        if (uf.digMode.getLabel() == 'Start Digitization'){
            uf.digMode.setLabel('Finish Drawing Mode');

            // Add labels for non-digitizable maps
            var nonDrawLabel1 = ui.Label({value: 'Drawing disabled in this map',
                style: {color: 'EE605E', position: 'bottom-center', backgroundColor: 'rgba(255, 255, 255, 1.0)'}});
            var nonDrawLabel2 = ui.Label({value: 'Drawing disabled in this map',
                style: {color: 'EE605E', position: 'bottom-center', backgroundColor: 'rgba(255, 255, 255, 1.0)'}});
            var nonDrawLabel3 = ui.Label({value: 'Drawing disabled in this map',
                style: {color: 'EE605E', position: 'bottom-center', backgroundColor: 'rgba(255, 255, 255, 1.0)'}});
            linkMaps.widgets().get(0).widgets().get(0).add(nonDrawLabel1);
            linkMaps.widgets().get(0).widgets().get(1).add(nonDrawLabel2);
            linkMaps.widgets().get(1).widgets().get(1).add(nonDrawLabel3);

            ui.root.widgets().reset([ovPanel, linkMaps]);
            linkMaps.widgets().get(0).widgets().get(0).centerObject(images['Radar T1']);

            //var m = linkMaps.widgets().get(0).widgets().get(1);
            //dTools = m.drawingTools();
            //dTools.setShown(false);

            while (dTools.layers().length() > 0) {
                var layer = dTools.layers().get(0);
                dTools.layers().remove(layer);
            }

            var dummyGeometry =
                ui.Map.GeometryLayer({geometries: null, name: 'change', color: 'red'});
            dTools.layers().add(dummyGeometry);

            //linkMaps.widgets().get(0).widgets().get(1).drawingTools().layers().add(dummyGeometry);

            drawPolygonDTools();

        } else {
            uf.digMode.setLabel('Start Digitization');
            //lyr = dTools.layers().get(0);
            dTools = dTools.stop();
            fc = dTools.toFeatureCollection();
            dTools.setShape(null);
        }

    });

dTools.onDraw(ui.util.debounce(getLyr(dTools), 500));
dTools.onEdit(ui.util.debounce(getLyr(dTools), 500));

// Export functionality
function downloadData() {
    var downloadArgs = {
        format: 'geojson',
        filename: 'Your_Geometries'
    };

    var fn = uf.fileName.getValue();
    //print(fn);

    if (fn !== ''){
        downloadArgs['filename'] = fn;
    }else{
        downloadArgs['filename'] = 'geometries'
    }
    var url = fc.getDownloadURL(downloadArgs);
    uf.exLabel.setUrl(url);
    uf.exLabel.style().set({shown: true});
}

uf.exButton.onClick(downloadData);

// -----------------------------------------------------------
//                    APP DISPLAY SETUP
// ---------------------------------------------------------
ui.root.clear();
// Test display setup with initial map


// Set initial app layout
map.add(aoiPanel);
drawingTools.setShape(null);
var mapSplitPanel = ui.SplitPanel(ovPanel, map);


ui.root.widgets().reset([mapSplitPanel]);
//ui.root.widgets().add(ovPanel);


//-------------------------------------------------
