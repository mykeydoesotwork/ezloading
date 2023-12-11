<template>
    <v-layout>
        <v-app-bar color="primary">


            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>


            <div class="d-flex">
                <truck-dialog customClasses="ma-2 px-4" variantStyle="outlined" customColor="white"
                    :mobileOrDesktop="this.displayWidth" :customStyle="{ backgroundColor: 'green' }"
                    @load-space-set="loadSpaceSet" />

                <add-dialog customClasses="ma-2 px-4" variantStyle="outlined" customColor="white"
                    :mobileOrDesktop="this.displayWidth" :customStyle="{ backgroundColor: 'green' }"
                    @cargo-added="addCargo" />

                <!-- This menu is for debugging delete it -->
                <!-- <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn class="ma-2 px-4" :style="{ backgroundColor: 'green' }" color="white" v-bind="props">
                            DEBUG MENU
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item :key="1" :value="0" @click="processImpactStart">
                            <v-list-item-title>processImpactStart</v-list-item-title>
                        </v-list-item>
                        <v-list-item :key="1" :value="0" @click="TESTING_ForceHighlight">
                            <v-list-item-title>TESTING_ForceHighlight</v-list-item-title>
                        </v-list-item>
                        <v-list-item :key="2" :value="1" @click="TESTING_findOverlaps">
                            <v-list-item-title>TESTING_findOverlaps</v-list-item-title>
                        </v-list-item>
                        <v-list-item :key="3" :value="0" @click="TESTING_PrintCargo">
                            <v-list-item-title>TESTING_PrintCargo</v-list-item-title>
                        </v-list-item>
                        <v-list-item :key="5" :value="1" @click="TESTING_dedupeStackedCargo_dummy">
                            <v-list-item-title>TESTING_dedupeStackedCargo_dummy</v-list-item-title>
                        </v-list-item>
                        <v-list-item :key="6" :value="1" @click="TESTING_pixelPush_dummy">
                            <v-list-item-title>TESTING_pixelPush_dummy</v-list-item-title>
                        </v-list-item>

                    </v-list>
                </v-menu>


                <v-btn v-if="this.displayWidth === 'desktop'" :style="{ backgroundColor: 'green' }" class="ma-2 px-4"
                    color="white" @click="TESTING_Setup1()"> TESTING_Setup1() </v-btn>

                <v-btn v-if="this.displayWidth === 'desktop'" :style="{ backgroundColor: 'green' }" class="ma-2 px-4"
                    color="white" @click="TESTING_Setup2()"> TESTING_Setup2() </v-btn>

                <v-btn v-if="this.displayWidth === 'desktop'" :style="{ backgroundColor: 'green' }" class="ma-2 px-4"
                    color="white" @click="TESTING_guideWalls()"> TESTINGGUIDEWALLS </v-btn> -->
            </div>

            <v-app-bar-title>Ez-Loading</v-app-bar-title>


        </v-app-bar>


        <v-navigation-drawer v-model="drawer" location="left" temporary>
            <div class="d-flex flex-column">
                <v-sheet class="ma-2">
                    <truck-dialog :blockStyle="true" mobileOrDesktop="desktop" @load-space-set="loadSpaceSet" />
                </v-sheet>
                <v-sheet class="ma-2">
                    <add-dialog :blockStyle="true" mobileOrDesktop="desktop" @cargo-added="addCargo" />
                </v-sheet>
                <v-container class="ma-2" v-for="item in this.generateNavDrawerList" :key="item.title">
                    <v-row>
                        <v-col cols="2" align-self="center" class="ma-0 pa-0" :style="{ userSelect: 'none' }">
                            <v-btn variant="tonal" density="compact" icon="mdi-trash-can-outline" color="primary"
                                @click="deleteCargoCategory(item)" @tap="deleteCargoCategory(item)"></v-btn>
                        </v-col>
                        <v-col cols="5" align-self="center" class="ma-0 pa-0" :style="{ userSelect: 'none' }">
                            {{ item.title }}
                        </v-col>
                        <v-col cols="2" align-self="center" class="ma-0 pa-0" :style="{ userSelect: 'none' }">
                            <v-btn variant="tonal" density="compact" icon="mdi-minus" color="primary"
                                @click="deleteCargoCategoryItem(item)" @tap="deleteCargoCategoryItem(item)"></v-btn>
                        </v-col>
                        <v-col cols="1" align-self="center" class="ma-0 pa-0" :style="{ userSelect: 'none' }">
                            {{ item.value.length }}
                        </v-col>
                        <v-col cols="2" align-self="center" class="ma-0 pa-0" :style="{ userSelect: 'none' }">
                            <v-btn variant="tonal" density="compact" icon="mdi-plus" color="primary"
                                @click="addCargo(item['value'][0]['units'], item['value'][0]['dimx'], item['value'][0]['dimy'])"
                                @tap="addCargo(item['value'][0]['units'], item['value'][0]['dimx'], item['value'][0]['dimy'])"></v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
        </v-navigation-drawer>

        <v-main id="container" class="d-flex align-center justify-center">

        </v-main>

    </v-layout>

    <v-stage ref="stage" :config="stageConfig">
        <!-- <v-layer :config="{draggable: true}"
        @mousemove="handleMouseMove" @pointerdown="handlePointerDown" @dragstart="handleDragStart"
        @dragmove='handleDragMove' @dragend='handleDragEnd' ref="layer"> -->
        <v-layer 
        @mousemove="handleMouseMove" @pointerdown="handlePointerDown" @dragstart="handleDragStart"
        @dragmove='handleDragMove' @dragend='handleDragEnd' ref="layer">
        <!-- backing rectangle -->
        <!-- <v-rect :config="backingRectConfig"/> -->

        <!-- truck left wall -->
        <v-rect truckId='leftWall' :config="{
            id: 'truckWall',
            x: this.truck.originx,
            y: this.truck.originy,
            width: 10,
            height: this.truck.units === 'Imperial' ? this.truck.dimy * this.scaleFactor : this.truck.dimy * 0.3937 * this.scaleFactor,
            fill: 'black',
        }" />
        <!-- truck back wall -->
        <v-rect truckId='backWall' :config="{
            id: 'truckWall',
            x: this.truck.originx + 10,
            y: this.truck.originy,
            width: this.truck.units === 'Imperial' ? this.truck.dimx * this.scaleFactor : this.truck.dimx * 0.3937 * this.scaleFactor,
            height: 10,
            fill: 'black',
        }" />
        <!-- truck right wall -->
        <v-rect truckId='rightWall' :config="{
            id: 'truckWall',
            x: this.truck.units === 'Imperial' ? this.truck.originx + this.truck.dimx * this.scaleFactor + 10 : this.truck.originx + this.truck.dimx * 0.3937 * this.scaleFactor + 10,
            y: this.truck.originy,
            width: 10,
            height: this.truck.units === 'Imperial' ? this.truck.dimy * this.scaleFactor : this.truck.dimy * 0.3937 * this.scaleFactor,
            fill: 'black',
        }" />

        <template v-for="(item, index) in cargo" :key="item.id">
        <!-- everything in the group is  offset by a 10x10 pixel square in the v-group, -->
        <!-- :cargoId accessible from layer children el: el.attrs.cargoId  -->
        <pallet-konva-group :truck="this.truck" :item="item" :index="index" :scaleFactor="this.scaleFactor"
        :lowestYBound="this.lowestYBound()" @delete-cargo="deleteCargo(item, index)"
        @rotate-cargo="rotateCargo(item, index)" />
        </template>
        </v-layer>
        <!-- <v-layer ref="buttonlayer">
        
            <v-group ref="buttonGroup">

                <v-label @click="TESTING_BUTTON1" :config="{
                    x: 30,
                    y: 30,
                    opacity: 0.75
                }">
                <v-tag :config="{ fill: 'lightgrey' }" />
                <v-text :config="{
                    text: 'zoom in',
                    fontFamily: 'Calibri',
                    fontSize: 18,
                    padding: 5,
                    fill: 'black'
                }" />
                </v-label>

                <v-label @click="TESTING_BUTTON2" :config="{
                    x: 30,
                    y: 60,
                    opacity: 0.75
                }">
                <v-tag :config="{ fill: 'lightgrey' }" />
                <v-text :config="{
                    text: 'zoom out',
                    fontFamily: 'Calibri',
                    fontSize: 18,
                    padding: 5,
                    fill: 'black'
                }" />
                </v-label>

                <v-label @click="TESTING_BUTTON3" :config="{
                    x: 30,
                    y: 90,
                    opacity: 0.75
                }">
                <v-tag :config="{
                    fill: 'lightgrey'
                }" />
                <v-text :config="{
                    text: 'reset',
                    fontFamily: 'Calibri',
                    fontSize: 18,
                    padding: 5,
                    fill: 'black'
                }" />
                </v-label>


                </v-group>

                </v-layer> -->

        </v-stage>
</template>



<script>
//import Konva from "konva";
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { groupBy, orderBy, uniqueId } from 'lodash'

import AddDialog from './AddDialog.vue'
import TruckDialog from './TruckDialog.vue'
import PalletKonvaGroup from './PalletKonvaGroup.vue'

import * as collision from '../assets/collision.js'

const width = window.innerWidth;
const height = window.innerHeight;


export default {
    name: 'EzLoading',
    components: {
        AddDialog, TruckDialog, PalletKonvaGroup
    },
    
    mounted() {
        //If you set style from css id=#container, then only parent of actual inner container is stylized
        this.$refs.stage.getStage().container().style.backgroundColor='#f0f0f0';
        this.$refs.stage.getStage().container().style.border='2px solid black';
        window.addEventListener("resize", this.resizeStage);
        this.resizeStage();
        this.truck.originx = this.truckLocationX();
    },
    unmounted() {
        window.removeEventListener("resize", this.resizeStage);
    },
    setup() {
        const { name } = useDisplay()
        
        const displayWidth = computed(() => {
            // console.log(name.value);
            // name is reactive and
            // must use .value
            switch (name.value) {
            case 'xs':
            case 'sm': return "mobile"
            case 'md': 
            case 'lg': 
            case 'xl': 
            case 'xxl': return "desktop"
            default: return "desktop"
            }
        })
        
        return { displayWidth }
        
    },
    
    
    data() {
        return {
            drawer: false,
            group: null,
            saveStartDragCoords: {x: 0, y: 0},
            dialog: false,
            scaleFactor: 2,
            stageConfig: {
                // draggable: true,
                container: 'container',
                width: width,
                height: height,
                scaleX: 1,
                scaleY: 1,                
            },
            backingRectConfig: {
                id: 'truckFloor',
                width: width,
                height: height,
                // for debugging purposes, delete fill to make it transparent:
                fill: '#ffffcc',
            },
            truck: {units: "Imperial", originx: 679, originy: 10, dimx: 102, dimy: 576 },
            cargo: [],
            // cargo: [{id: uniqueId("cargo-"), units: "Imperial", dimx: 20, dimy: 40},
            //         {id: uniqueId("cargo-"), units: "Imperial", dimx: 10, dimy: 30},
            //         {id: uniqueId("cargo-"), units: "Imperial", dimx: 50, dimy: 40},
            //         {id: uniqueId("cargo-"), units: "Imperial", dimx: 10, dimy: 20},
            //         {id: uniqueId("cargo-"), units: "Imperial", dimx: 5, dimy: 11}],
            closeIcon: null,
            rotateIcon: null,
            
        };
    },
    methods: {
        prObj(obj) {return JSON.stringify(obj, undefined, 2)},
        // ---------------------------------------------------------------------------------------------------
        // start tdd -----------------------------------------------------------------------------------------
        /* eslint-disable */ 
        prt(variableName, debugVar) {
            console.log(variableName + ":");
            debugVar === undefined ? console.log(`${variableName} is undefined`) : console.log(debugVar);
        },
        TESTING_BUTTON1() {
            console.log("button1 clicked");
            this.scaleFactor = this.scaleFactor * 1.1;
            var layerChildren = this.$refs.layer.getNode().getLayer().children;

            // var wallsArray = layerChildren.filter(x=>x.id()==='truckWall');
            // var cargoGroupArray = layerChildren.filter(x => (x.id() === 'cargoGroup'))
            // cargoGroupArray.forEach(function(cargo){
            //     cargo.x(cargo.x()*1.1)
            //     cargo.y(cargo.y()*1.1)
            // })

            
        },
        TESTING_BUTTON2() {
            console.log("button2 clicked");
            this.scaleFactor = this.scaleFactor / 1.1
        },
        TESTING_BUTTON3() {
            console.log("button3 clicked");
            this.scaleFactor = 2
        },
        TESTING_findOverlaps() {
            var layerChildren = this.$refs.layer.getNode().getLayer().children;
            var target = layerChildren.find(x=>x.attrs.cargoId === 'cargo-1');
            collision.findOverlaps(target, target.x(), target.y(), layerChildren);
        },
        TESTING_dedupeStackedCargo_dummy(){
            // testing: TESTING_dedupeStackedCargo ----------------------------------------------------------
            var layerChildren = this.$refs.layer.getNode().getLayer().children;
            var target = layerChildren.find(x => x.attrs.cargoId === 'cargo-1');

            collision.dedupeStackedCargo(target, layerChildren);
        },
        TESTING_pixelPush_dummy() {
            var layerChildren = this.$refs.layer.getNode().getLayer().children;
            var target = layerChildren.find(x => x.attrs.cargoId === 'cargo-1');

            collision.pixelPush(target, layerChildren, this.saveStartDragCoords);
        },
        TESTING_Setup1() {
            console.log("TESTING_Setup1() called");
            //add cargo1 and set position
            this.addCargo('Imperial', "48.00", "40.00"); //overlap cases
            this.addCargo('Imperial', "48.00", "40.00");
        },
        TESTING_Setup2() {
            var layerChildren = this.$refs.layer.getNode().getLayer().children;
            var cargoGroupArray = layerChildren.filter(el => (el.id() === 'cargoGroup'))
            var testCargo1 = cargoGroupArray[0]
            var testCargo1Rect = testCargo1.findOne('Rect').getClientRect();
            var testCargo2 = cargoGroupArray[1]
            var testCargo2Rect = testCargo2.findOne('Rect').getClientRect();

            //testing pixelpushing
            //leftwall->[2][1][3]
            // testCargo1.x(750);
            // testCargo1.y(270);
            // testCargo1.moveToTop();
            // testCargo2.x(693);
            // testCargo2.y(250);
            // testCargo3.x(805);
            // testCargo3.y(250);

            //topwall->[2][1][3]
            var testCargo1Coordinates = "[280, 170]"
            testCargo1.x(280);
            testCargo1.y(130);
            testCargo2.x(430);
            testCargo2.y(170);
        },
        TESTING_PrintCargo() {
            console.table(this.cargo);
        },
        TESTING_ForceHighlight() {
            var layerChildren = this.$refs.layer.getNode().getLayer().children;
            var target = layerChildren.find(x => x.attrs.cargoId === 'cargo-1');

            var topBorder = target.findOne(x=>x.id() === 'topBorder');
            var bottomBorder = target.findOne(x => x.id() === 'bottomBorder');
            var rightBorder = target.findOne(x => x.id() === 'rightBorder');
            var leftBorder = target.findOne(x => x.id() === 'leftBorder');
            topBorder.stroke('red');
            topBorder.shadowEnabled(false);
            bottomBorder.stroke('red');
            bottomBorder.shadowEnabled(false);
            rightBorder.stroke('red');
            rightBorder.shadowEnabled(false);
            leftBorder.stroke('red');
            leftBorder.shadowEnabled(false);
        },
        // targetXPos and targetYPos are used to evaluate collision with prospective new coordinates for cargo being bumped
        // otherwise cargo will only process wall collision if the old stale coordinates of target are intersecting a wall
        processImpactStart() {
            //processImpactStart(event) { //@dragend event
            console.log("processImpactStart called");
            var layerChildren = this.$refs.layer.getNode().getLayer().children;
            //grabbing the first cargoGroup object from layer children does not work because order changes when z-index changes
            //therefore fetch and compare with the first element in this.cargo local data
            var testCargo1 = layerChildren.find(el=>(el.attrs.cargoId === this.cargo[0].id))
            //var testCargo1 = event.target //@dragend event
            var testCargoRect1 = testCargo1.findOne('Rect').getClientRect();
            
            var unresolvedArray = layerChildren.filter(el=> (!(el.attrs.cargoId === testCargo1.attrs.cargoId) &&
                                                             !(el.id() === 'truckWall') && !(el.id() === 'truckFloor')))
            // add x/y coordinates and wallstatus for unresolvedArray for blowback lazy new position processing
            unresolvedArray = unresolvedArray.map(x=>[x, x.x(), x.y(), 'isNotWall'])
            
            var resolvedArray = collision.processImpact(testCargo1, testCargo1.x(), testCargo1.y(), 'isNotWall', unresolvedArray, "", layerChildren);
            
            console.log("final resolvedArray from processImpactStart()");
            console.table(resolvedArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]]));
            resolvedArray.forEach( function(kgroup) {
                var collidedItem = kgroup[0];
                collidedItem.x(kgroup[1]);
                collidedItem.y(kgroup[2]);
            })
            
        },
        handleDragStart(event) {
            this.saveStartDragCoords.x = event.target.x()
            this.saveStartDragCoords.y = event.target.y()
            //console.log(`dragstart event: event.target.findOne('Rect').getClientRect() ${JSON.stringify(event.target.findOne('Rect').getClientRect(), undefined, 2)}`); //tmpdbg
            // {
            //     "x": 40,
            //     "y": 40,
            //     "width": 100,
            //     "height": 80
            // }
            //console.log(`this.saveStartDragCoords.x ${this.saveStartDragCoords.x} this.saveStartDragCoords.y ${this.saveStartDragCoords.y}`); //tmpdbg
            // this.saveStartDragCoords.x 40 this.saveStartDragCoords.y 40
        },
        handleMouseMove() {
            var layerChildren = this.$refs.layer.getNode().getLayer().children;
            this.cargo.forEach(function(cargoItem){
                // for each cargo item update it's x and  y values
                var cargoKObj = layerChildren.find(x=>(x.attrs.cargoId === cargoItem.id))
                cargoItem.x = cargoKObj.x();
                cargoItem.y = cargoKObj.y();
            })
        },
        // used for border highlighting in handleDragMove(event) {...}
        isCargoOutside(layerChildren, target, collidedCargoArray) {
            //var layerChildren = this.$refs.layer.getNode().getLayer().children;
            //var target = layerChildren.find(x => x.attrs.cargoId === 'cargo-1');
            // collidedCargo is [Group, {intersectionResult: true, transform: {…}}]
            var collidedCargo = collidedCargoArray[0];
            var collidedCargoRect = collidedCargo.findOne('Rect').getClientRect();

            var leftWall = layerChildren.find(el=>(el.attrs.truckId === 'leftWall'))
            var backWall = layerChildren.find(el=>(el.attrs.truckId === 'backWall'))
            var rightWall = layerChildren.find(el=>(el.attrs.truckId === 'rightWall'))

            if (collidedCargo.x() + collidedCargoRect.width - 1 < leftWall.x() ||
                rightWall.x() + rightWall.width() < collidedCargo.x() ||
                collidedCargo.y() + collidedCargoRect.height < backWall.y()) {
                //console.log("cargo is outside");   
                return true;    
            } else {
                //console.log("cargo is inside");
                return false;    
            }
        },
        guideLinesoldversion(target, layerChildren) {
            // TODO: 0. destroy all guidelines from layer
            var targetRect = target.findOne('Rect').getClientRect();
            var targetFirstXPos = target.absolutePosition().x;
            var targetThirdXPos = target.absolutePosition().x + targetRect.width;

            var targetFirstYPos = target.absolutePosition().y;
            var targetThirdYPos = target.absolutePosition().y + targetRect.height;

            var cargoGroupArray = layerChildren.filter(x => (x.id() === 'cargoGroup' && !(x.attrs.cargoId === target.attrs.cargoId)))

            var stage = this.$refs.stage.getStage()
            var layer = this.$refs.layer.getNode().getLayer();

            function drawGuide(orientation, anchorCoordinate) {
                if (orientation == 'vertical') {
                    var line = new Konva.Line({
                        points: [anchorCoordinate, -6000, anchorCoordinate, 6000],
                        stroke: 'rgb(0, 161, 255)',
                        strokeWidth: 1,
                        id: orientation + anchorCoordinate,
                        name: 'guid-line',
                        dash: [4, 6],
                    });
                    // if a line with the same orientation+anchorCoordinate id does not already exist then add it
                    if(!layer.children.find(x=> (x.name() === 'guid-line' && x.id() === orientation+anchorCoordinate))){
                        layer.add(line);
                    }
                } else { // orientation == 'horizontal'
                    var line = new Konva.Line({
                        points: [-6000, anchorCoordinate, 6000, anchorCoordinate],
                        stroke: 'rgb(0, 161, 255)',
                        strokeWidth: 1,
                        id: orientation + anchorCoordinate,
                        name: 'guid-line',
                        dash: [4, 6],
                    });
                    // if a line with the same orientation+anchorCoordinate id does not already exist then add it
                    if(!layer.children.find(x=> (x.name() === 'guid-line' && x.id() === orientation+anchorCoordinate))){
                        layer.add(line);
                    }

                }
            }
            function generateGuidelineObject(kObj) {
                var kObjRect = kObj.findOne('Rect').getClientRect()
                var leftGuide = { 
                    startInterval: (kObj.absolutePosition().x - 5), 
                    endInterval: (kObj.absolutePosition().x + 5), 
                    anchor: kObj.absolutePosition().x - 1};
                var rightGuide = {
                    startInterval: (kObj.absolutePosition().x + kObjRect.width - 5),
                    endInterval: (kObj.absolutePosition().x + kObjRect.width + 5),
                    anchor: kObj.absolutePosition().x + kObjRect.width };
                var aboveGuide = {
                    startInterval: (kObj.absolutePosition().y - 5),
                    endInterval: (kObj.absolutePosition().y + 5),
                    anchor: kObj.absolutePosition().y - 1};
                var belowGuide = {
                    startInterval: (kObj.absolutePosition().y + kObjRect.height - 5),
                    endInterval: (kObj.absolutePosition().y + kObjRect.height + 5),
                    anchor: kObj.absolutePosition().y + kObjRect.height};

                return { cargoId: kObj.attrs.cargoId, leftGuide: leftGuide, rightGuide: rightGuide, aboveGuide: aboveGuide, belowGuide: belowGuide };
            }
            var guideLinesArray = cargoGroupArray.map(x => generateGuidelineObject(x))
            guideLinesArray.forEach(function (g) {
                // LEFTGUIDE:
                // snap to guideline gutter, and draw the guideline   
                // target leftmost x point (should be 1 pixel more for right guide)
                // OR target rightmost x point (should be 1 pixel less for left guide)
                // else delete all guidelines
                var isFirstXPosInGutter = (g.leftGuide.startInterval < targetFirstXPos && targetFirstXPos < g.leftGuide.endInterval)
                var isThirdXPosInGutter = (g.leftGuide.startInterval < targetThirdXPos && targetThirdXPos < g.leftGuide.endInterval)
                if (isFirstXPosInGutter || isThirdXPosInGutter) {
                    // geometrically the two conditions must be exclusively (XOR) true    
                    switch (true) {
                        case isFirstXPosInGutter:
                            // caution: if you use targetFirstXYPos instead target.absolutePosition() the target will no longer be clamped to the vertical guide
                            target.absolutePosition({ x: g.leftGuide.anchor + 1, y: target.absolutePosition().y });
                            drawGuide('vertical', g.leftGuide.anchor)
                            stage.batchDraw()
                            break;
                        case isThirdXPosInGutter:
                            target.absolutePosition({ x: g.leftGuide.anchor - targetRect.width, y: target.absolutePosition().y });
                            drawGuide('vertical', g.leftGuide.anchor)
                            stage.batchDraw()
                            break;
                        default:
                            // if this switch statement is evaluating at least one of the above two OR conditions is true
                            break;
                    }
                } else {
                    var leftGuideLine = layer.children.find(x=> (x.name() === 'guid-line' && x.id() === 'vertical'+g.leftGuide.anchor));
                    if(leftGuideLine) {leftGuideLine.destroy()}
                }
                // RIGHTGUIDE:
                // snap to guideline gutter, and draw the guideline   
                // target leftmost x point (should be 1 pixel more for right guide)
                // OR target rightmost x point (should be 1 pixel less for left guide)
                // else delete all guidelines
                isFirstXPosInGutter = (g.rightGuide.startInterval < targetFirstXPos && targetFirstXPos < g.rightGuide.endInterval)
                isThirdXPosInGutter = (g.rightGuide.startInterval < targetThirdXPos && targetThirdXPos < g.rightGuide.endInterval)
                if (isFirstXPosInGutter || isThirdXPosInGutter) {
                    // geometrically the two conditions must be exclusively (XOR) true    
                    switch (true) {
                        case isFirstXPosInGutter:
                            // caution: if you use targetFirstXYPos instead target.absolutePosition() the target will no longer be clamped to the vertical guide
                            target.absolutePosition({ x: g.rightGuide.anchor + 1, y: target.absolutePosition().y });
                            drawGuide('vertical', g.rightGuide.anchor)
                            stage.batchDraw()
                            break;
                        case isThirdXPosInGutter:
                            target.absolutePosition({ x: g.rightGuide.anchor - targetRect.width, y: target.absolutePosition().y });
                            drawGuide('vertical', g.rightGuide.anchor)
                            stage.batchDraw()
                            break;
                        default:
                            // if this switch statement is evaluating at least one of the above two OR conditions is true
                            break;
                    }
                } else {
                    var rightGuideLine = layer.children.find(x=> (x.name() === 'guid-line' && x.id() === 'vertical'+g.rightGuide.anchor));
                    if(rightGuideLine) {rightGuideLine.destroy()}
                }
                // ABOVEGUIDE:
                // snap to guideline gutter, and draw the guideline   
                // target leftmost x point (should be 1 pixel more for right guide)
                // OR target rightmost x point (should be 1 pixel less for left guide)
                // else delete all guidelines
                var isFirstYPosInGutter = (g.aboveGuide.startInterval < targetFirstYPos && targetFirstYPos < g.aboveGuide.endInterval)
                var isThirdYPosInGutter = (g.aboveGuide.startInterval < targetThirdYPos && targetThirdYPos < g.aboveGuide.endInterval)
                if (isFirstYPosInGutter || isThirdYPosInGutter) {
                    // geometrically the two conditions must be exclusively (XOR) true
                    switch (true) {
                        case isFirstYPosInGutter:
                            // caution: if you use targetFirstXYPos instead target.absolutePosition() the target will no longer be clamped to the vertical guide
                            target.absolutePosition({ x: target.absolutePosition().x, y: g.aboveGuide.anchor + 1});
                            drawGuide('horizontal', g.aboveGuide.anchor)
                            stage.batchDraw()
                            break;
                        case isThirdYPosInGutter:
                            target.absolutePosition({ x: target.absolutePosition().x, y: g.aboveGuide.anchor - targetRect.height});
                            drawGuide('horizontal', g.aboveGuide.anchor)
                            stage.batchDraw()
                            break;
                        default:
                            // if this switch statement is evaluating at least one of the above two OR conditions is true
                            break;
                    }
                } else {
                    var aboveGuideLine = layer.children.find(x=> (x.name() === 'guid-line' && x.id() === 'horizontal'+g.aboveGuide.anchor));
                    if(aboveGuideLine) {aboveGuideLine.destroy()};
                }
                // BELOWGUIDE:
                // snap to guideline gutter, and draw the guideline   
                // target leftmost x point (should be 1 pixel more for right guide)
                // OR target rightmost x point (should be 1 pixel less for left guide)
                // else delete all guidelines
                var isFirstYPosInGutter = (g.belowGuide.startInterval < targetFirstYPos && targetFirstYPos < g.belowGuide.endInterval)
                var isThirdYPosInGutter = (g.belowGuide.startInterval < targetThirdYPos && targetThirdYPos < g.belowGuide.endInterval)
                if (isFirstYPosInGutter || isThirdYPosInGutter) {
                    // geometrically the three conditions must be exclusively (XOR) true
                    switch (true) {
                        case isFirstYPosInGutter:
                            // caution: if you use targetFirstXYPos instead target.absolutePosition() the target will no longer be clamped to the vertical guide
                            target.absolutePosition({ x: target.absolutePosition().x, y: g.belowGuide.anchor + 1});
                            drawGuide('horizontal', g.belowGuide.anchor)
                            stage.batchDraw()
                            break;
                        case isThirdYPosInGutter:
                            target.absolutePosition({ x: target.absolutePosition().x, y: g.belowGuide.anchor - targetRect.height});
                            drawGuide('horizontal', g.belowGuide.anchor)
                            stage.batchDraw()
                            break;
                        default:
                            // if this switch statement is evaluating at least one of the above two OR conditions is true
                            break;
                    }
                } else {
                    var belowGuideLine = layer.children.find(x=> (x.name() === 'guid-line' && x.id() === 'horizontal'+g.belowGuide.anchor));
                    if(belowGuideLine) {belowGuideLine.destroy()};
                }
            });
        },
        guideLines(target, layerChildren) {
            // TODO: 0. destroy all guidelines from layer
            var targetRect = target.findOne('Rect').getClientRect();
            var targetFirstXPos = target.x();
            var targetThirdXPos = target.x() + targetRect.width;

            var targetFirstYPos = target.y();
            var targetThirdYPos = target.y() + targetRect.height;

            var cargoGroupArray = layerChildren.filter(x => (x.id() === 'cargoGroup' && !(x.attrs.cargoId === target.attrs.cargoId)))

            var stage = this.$refs.stage.getStage()
            var layer = this.$refs.layer.getNode().getLayer();

            function drawGuide(orientation, anchorCoordinate) {
                if (orientation == 'vertical') {
                    var line = new Konva.Line({
                        points: [anchorCoordinate, -6000, anchorCoordinate, 6000],
                        stroke: 'rgb(0, 161, 255)',
                        strokeWidth: 1,
                        id: orientation + anchorCoordinate,
                        name: 'guid-line',
                        dash: [4, 6],
                    });
                    // if a line with the same orientation+anchorCoordinate id does not already exist then add it
                    if(!layer.children.find(x=> (x.name() === 'guid-line' && x.id() === orientation+anchorCoordinate))){
                        layer.add(line);
                    }
                } else { // orientation == 'horizontal'
                    var line = new Konva.Line({
                        points: [-6000, anchorCoordinate, 6000, anchorCoordinate],
                        stroke: 'rgb(0, 161, 255)',
                        strokeWidth: 1,
                        id: orientation + anchorCoordinate,
                        name: 'guid-line',
                        dash: [4, 6],
                    });
                    // if a line with the same orientation+anchorCoordinate id does not already exist then add it
                    if(!layer.children.find(x=> (x.name() === 'guid-line' && x.id() === orientation+anchorCoordinate))){
                        layer.add(line);
                    }

                }
            }
            function generateGuidelineObject(kObj) {
                var kObjRect = kObj.findOne('Rect').getClientRect()
                var leftGuide = { 
                    startInterval: (kObj.x() - 5), 
                    endInterval: (kObj.x() + 5), 
                    anchor: kObj.x() - 1};
                var rightGuide = {
                    startInterval: (kObj.x() + kObjRect.width - 5),
                    endInterval: (kObj.x() + kObjRect.width + 5),
                    anchor: kObj.x() + kObjRect.width };
                var aboveGuide = {
                    startInterval: (kObj.y() - 5),
                    endInterval: (kObj.y() + 5),
                    anchor: kObj.y() - 1};
                var belowGuide = {
                    startInterval: (kObj.y() + kObjRect.height - 5),
                    endInterval: (kObj.y() + kObjRect.height + 5),
                    anchor: kObj.y() + kObjRect.height};

                return { cargoId: kObj.attrs.cargoId, leftGuide: leftGuide, rightGuide: rightGuide, aboveGuide: aboveGuide, belowGuide: belowGuide };
            }
            var guideLinesArray = cargoGroupArray.map(x => generateGuidelineObject(x))
            guideLinesArray.forEach(function (g) {
                // LEFTGUIDE:
                // snap to guideline gutter, and draw the guideline   
                // target leftmost x point (should be 1 pixel more for right guide)
                // OR target rightmost x point (should be 1 pixel less for left guide)
                // else delete all guidelines
                var isFirstXPosInGutter = (g.leftGuide.startInterval < targetFirstXPos && targetFirstXPos < g.leftGuide.endInterval)
                var isThirdXPosInGutter = (g.leftGuide.startInterval < targetThirdXPos && targetThirdXPos < g.leftGuide.endInterval)
                if (isFirstXPosInGutter || isThirdXPosInGutter) {
                    // geometrically the two conditions must be exclusively (XOR) true    
                    switch (true) {
                        case isFirstXPosInGutter:
                            // caution: if you use targetFirstXYPos instead target.absolutePosition() the target will no longer be clamped to the vertical guide
                            target.position({ x: g.leftGuide.anchor + 1, y: target.y() });
                            drawGuide('vertical', g.leftGuide.anchor)
                            stage.batchDraw()
                            break;
                        case isThirdXPosInGutter:
                            target.position({ x: g.leftGuide.anchor - targetRect.width, y: target.y() });
                            drawGuide('vertical', g.leftGuide.anchor)
                            stage.batchDraw()
                            break;
                        default:
                            // if this switch statement is evaluating at least one of the above two OR conditions is true
                            break;
                    }
                } else {
                    var leftGuideLine = layer.children.find(x=> (x.name() === 'guid-line' && x.id() === 'vertical'+g.leftGuide.anchor));
                    if(leftGuideLine) {leftGuideLine.destroy()}
                }
                // RIGHTGUIDE:
                // snap to guideline gutter, and draw the guideline   
                // target leftmost x point (should be 1 pixel more for right guide)
                // OR target rightmost x point (should be 1 pixel less for left guide)
                // else delete all guidelines
                isFirstXPosInGutter = (g.rightGuide.startInterval < targetFirstXPos && targetFirstXPos < g.rightGuide.endInterval)
                isThirdXPosInGutter = (g.rightGuide.startInterval < targetThirdXPos && targetThirdXPos < g.rightGuide.endInterval)
                if (isFirstXPosInGutter || isThirdXPosInGutter) {
                    // geometrically the two conditions must be exclusively (XOR) true    
                    switch (true) {
                        case isFirstXPosInGutter:
                            // caution: if you use targetFirstXYPos instead target.absolutePosition() the target will no longer be clamped to the vertical guide
                            target.position({ x: g.rightGuide.anchor + 1, y: target.y() });
                            drawGuide('vertical', g.rightGuide.anchor)
                            stage.batchDraw()
                            break;
                        case isThirdXPosInGutter:
                            target.position({ x: g.rightGuide.anchor - targetRect.width, y: target.y() });
                            drawGuide('vertical', g.rightGuide.anchor)
                            stage.batchDraw()
                            break;
                        default:
                            // if this switch statement is evaluating at least one of the above two OR conditions is true
                            break;
                    }
                } else {
                    var rightGuideLine = layer.children.find(x=> (x.name() === 'guid-line' && x.id() === 'vertical'+g.rightGuide.anchor));
                    if(rightGuideLine) {rightGuideLine.destroy()}
                }
                // ABOVEGUIDE:
                // snap to guideline gutter, and draw the guideline   
                // target leftmost x point (should be 1 pixel more for right guide)
                // OR target rightmost x point (should be 1 pixel less for left guide)
                // else delete all guidelines
                var isFirstYPosInGutter = (g.aboveGuide.startInterval < targetFirstYPos && targetFirstYPos < g.aboveGuide.endInterval)
                var isThirdYPosInGutter = (g.aboveGuide.startInterval < targetThirdYPos && targetThirdYPos < g.aboveGuide.endInterval)
                if (isFirstYPosInGutter || isThirdYPosInGutter) {
                    // geometrically the two conditions must be exclusively (XOR) true
                    switch (true) {
                        case isFirstYPosInGutter:
                            // caution: if you use targetFirstXYPos instead target.absolutePosition() the target will no longer be clamped to the vertical guide
                            target.position({ x: target.x(), y: g.aboveGuide.anchor + 1});
                            drawGuide('horizontal', g.aboveGuide.anchor)
                            stage.batchDraw()
                            break;
                        case isThirdYPosInGutter:
                            target.position({ x: target.x(), y: g.aboveGuide.anchor - targetRect.height});
                            drawGuide('horizontal', g.aboveGuide.anchor)
                            stage.batchDraw()
                            break;
                        default:
                            // if this switch statement is evaluating at least one of the above two OR conditions is true
                            break;
                    }
                } else {
                    var aboveGuideLine = layer.children.find(x=> (x.name() === 'guid-line' && x.id() === 'horizontal'+g.aboveGuide.anchor));
                    if(aboveGuideLine) {aboveGuideLine.destroy()};
                }
                // BELOWGUIDE:
                // snap to guideline gutter, and draw the guideline   
                // target leftmost x point (should be 1 pixel more for right guide)
                // OR target rightmost x point (should be 1 pixel less for left guide)
                // else delete all guidelines
                var isFirstYPosInGutter = (g.belowGuide.startInterval < targetFirstYPos && targetFirstYPos < g.belowGuide.endInterval)
                var isThirdYPosInGutter = (g.belowGuide.startInterval < targetThirdYPos && targetThirdYPos < g.belowGuide.endInterval)
                if (isFirstYPosInGutter || isThirdYPosInGutter) {
                    // geometrically the three conditions must be exclusively (XOR) true
                    switch (true) {
                        case isFirstYPosInGutter:
                            // caution: if you use targetFirstXYPos instead target.absolutePosition() the target will no longer be clamped to the vertical guide
                            target.position({ x: target.x(), y: g.belowGuide.anchor + 1});
                            drawGuide('horizontal', g.belowGuide.anchor)
                            stage.batchDraw()
                            break;
                        case isThirdYPosInGutter:
                            target.position({ x: target.x(), y: g.belowGuide.anchor - targetRect.height});
                            drawGuide('horizontal', g.belowGuide.anchor)
                            stage.batchDraw()
                            break;
                        default:
                            // if this switch statement is evaluating at least one of the above two OR conditions is true
                            break;
                    }
                } else {
                    var belowGuideLine = layer.children.find(x=> (x.name() === 'guid-line' && x.id() === 'horizontal'+g.belowGuide.anchor));
                    if(belowGuideLine) {belowGuideLine.destroy()};
                }
            });
        },
        guideWalls(target, layerChildren, wallOverlap) {
            //console.log("guideWalls Called") //tmpdbg
            var wallsArray = layerChildren.filter(x=>x.id()==='truckWall');
            //If there are wall collisions, highlight the wall and return(? or highlight the appropriate border for intersected cargo), 
            //else set all walls to black and continue
            // wallOverlap == [[Group, 797, 40, 'isWall'] "rightWall"]     !(el.id() === 'truckWall')
            if(!(wallOverlap[1]==="isNotWall")){
                var wallObj = layerChildren.find(x=>x.attrs.truckId === wallOverlap[1]);
                wallObj.fill('red');
                wallsArray.filter(x=>!(x.attrs.truckId === wallOverlap[1])).forEach(x=>x.fill('black'))
            } else {
                wallsArray.forEach(x=>x.fill('black'));
            }
        },
        TESTING_guideWalls() {
            // var layerChildren = this.$refs.layer.getNode().getLayer().children;
            // var target = layerChildren.find(x => x.attrs.cargoId === 'cargo-1');
            // this.guideLines(target, layerChildren)
            var layerChildren = this.$refs.layer.getNode().getLayer().children;
            var target = layerChildren.find(x=>x.attrs.cargoId === 'cargo-1');
            this.guideWalls(target, layerChildren);
        },

        handleDragMove(event) {
            // x left to right: pos 0 -> inf, y up to down: pos 0 -> inf, width, height
            var target = event.target;
            // If target is the the Layer which has id '' then do nothing
            if (target.id() === ''){
                return;
            }

            var targetRect = event.target.findOne('Rect').getClientRect();
            //ensure truckFloor backing rectangle is not included in layerChildren
            var layerChildren = this.$refs.layer.getNode().getLayer().children.filter(el=>!(el.id() === 'truckFloor'));
            // draw guidelines
            this.guideLines(target, layerChildren)
            // collision.dprt("layerChildren monitoring: ", layerChildren) //tmpdbg
            var wallOverlap = collision.processWallCollisions(target, target.x(), target.y(), layerChildren);
            // [[Group, 797, 40, 'isWall'] "rightWall"]     !(el.id() === 'truckWall')
            this.guideWalls(target, layerChildren, wallOverlap);


            var cargoGroupArray = layerChildren.filter(x=>(x.id() === 'cargoGroup'  && 
                                                           !(x.attrs.cargoId === target.attrs.cargoId)))

            // Intersection for all elements, not just those which intersect with target
            var cargoGroupArrayIntersect =
                cargoGroupArray.map(x=>[x, collision.haveIntersection([x, x.x(), x.y(),'isNotWall'], 
                                                                 x.findOne('Rect').getClientRect(),
                                                                      targetRect, target.x(), target.y())]);
            
            target.findOne('Rect').opacity(0.5);
            
            cargoGroupArrayIntersect.forEach(
                function (x) {
                    var topBorder = x[0].findOne(x=>x.id() === 'topBorder');
                    var bottomBorder = x[0].findOne(x=>x.id() === 'bottomBorder');
                    var rightBorder = x[0].findOne(x=>x.id() === 'rightBorder');
                    var leftBorder = x[0].findOne(x=>x.id() === 'leftBorder')
                    if(x[1].intersectionResult) {
                        switch(true) {
                        // If a target cargo intersects a wall, then only highlight the collided cargo border parallel to that wall
                        // If the collided cargo is outside the truck walls, highlight the opposite border
                        //case (wallOverlap[1]==='backWall' || wallOverlap[1]==='isNotWall' && x[1].transform.y > 0):
                        case (wallOverlap[1]===(this.isCargoOutside(layerChildren, target, x) ? 'frontWall' : 'backWall')
                                || wallOverlap[1] === 'isNotWall' && x[1].transform.y > 0):
                            topBorder.stroke('red');//
                            topBorder.shadowEnabled(true);//
                            bottomBorder.stroke('black');
                            bottomBorder.shadowEnabled(false);
                            rightBorder.stroke('black');
                            rightBorder.shadowEnabled(false);
                            leftBorder.stroke('black');
                            leftBorder.shadowEnabled(false);
                            break;
                        //case (wallOverlap[1]==='isNotWall' && x[1].transform.y < 0):
                        case (wallOverlap[1]===(this.isCargoOutside(layerChildren, target, x) ? 'backWall' : 'frontWall')
                                || wallOverlap[1] === 'isNotWall' && x[1].transform.y < 0):
                            topBorder.stroke('black');
                            topBorder.shadowEnabled(false);
                            bottomBorder.stroke('red');//
                            bottomBorder.shadowEnabled(true);//
                            rightBorder.stroke('black');
                            rightBorder.shadowEnabled(false);
                            leftBorder.stroke('black');
                            leftBorder.shadowEnabled(false);
                            break;
                        case (wallOverlap[1]===(this.isCargoOutside(layerChildren, target, x) ? 'leftWall' : 'rightWall')
                                || wallOverlap[1] === 'isNotWall' && x[1].transform.x < 0):
                            topBorder.stroke('black');
                            topBorder.shadowEnabled(false);
                            bottomBorder.stroke('black');
                            bottomBorder.shadowEnabled(false);
                            rightBorder.stroke('red');
                            rightBorder.shadowEnabled(true);
                            leftBorder.stroke('black');
                            leftBorder.shadowEnabled(false);
                            break;
                        case (wallOverlap[1]===(this.isCargoOutside(layerChildren, target, x) ? 'rightWall' : 'leftWall')
                                || wallOverlap[1] === 'isNotWall' && x[1].transform.x > 0):
                            topBorder.stroke('black');
                            topBorder.shadowEnabled(false);
                            bottomBorder.stroke('black');
                            bottomBorder.shadowEnabled(false);
                            rightBorder.stroke('black');
                            rightBorder.shadowEnabled(false);
                            leftBorder.stroke('red');
                            leftBorder.shadowEnabled(true);
                            break;
                        }
                    } else {
                        topBorder.stroke('black');
                        topBorder.shadowEnabled(false);
                        bottomBorder.stroke('black');
                        bottomBorder.shadowEnabled(false);
                        rightBorder.stroke('black');
                        rightBorder.shadowEnabled(false);
                        leftBorder.stroke('black');
                        leftBorder.shadowEnabled(false);
                    }
                }.bind(this))
            // console.group("Transforms of cargo intersected with cargo-1");
            // console.log(JSON.stringify(cargoGroupArrayIntersect.map(x=>[x[0].attrs.cargoId, x[1].transform]), undefined, 2))
            // console.groupEnd("Transforms of cargo intersected with cargo-1");
        },
        handlePointerDown (event) {
            event.target.getParent().moveToTop()
            //console.log(event.target.getParent()); //tmpdbg
        },
        /* eslint-disable */ 
        // eslint disabled to ignore event declared but not used
        handleDragEnd(event){
            // event.target.attrs.cargoId
            var target = event.target;
            // If target is the the Layer which has id '' then do nothing
            if (target.id() === ''){
                // Return the layer to the bottom at the end of dragging or else the zoom buttons will be inaccessible
                target.moveToBottom()
                return;
            }

            
            // clear all guidelines
            var layer = this.$refs.layer.getNode().getLayer();
            //collision.dprt("layerChildren before: ", layer.children) //tmpdbg
            layer.find('.guid-line').forEach((l) => l.destroy())
            //collision.dprt("layerChildren after: ", layer.children) //tmpdbg
            

            //ensure truckFloor backing rectangle is not included in layerChildren, but likely won't execute due to target as layer handled above
            var layerChildren = layer.children.filter(el=>!(el.id() === 'truckFloor'));
            var wallsArray = layerChildren.filter(x=>x.id()==='truckWall');
            //clear wall highlighting
            wallsArray.forEach(x=>x.fill('black'));
            //reset borders and opacity
            var cargoNoWallsArray = layerChildren.filter(el=> (!(el.id() === 'truckWall') && !(el.id() === 'truckFloor')));
            cargoNoWallsArray.forEach(function(x){
                x.findOne('Rect').opacity(1);            
                var topBorder = x.findOne(x=>x.id() === 'topBorder');
                var bottomBorder = x.findOne(x=>x.id() === 'bottomBorder');
                var rightBorder = x.findOne(x=>x.id() === 'rightBorder');
                var leftBorder = x.findOne(x=>x.id() === 'leftBorder');
                topBorder.stroke('black');
                topBorder.shadowEnabled(false);
                bottomBorder.stroke('black');
                bottomBorder.shadowEnabled(false);
                rightBorder.stroke('black');
                rightBorder.shadowEnabled(false);
                leftBorder.stroke('black');
                leftBorder.shadowEnabled(false);
            })

            // process collisions of target with environment
            collision.pixelPush(target, layerChildren, this.saveStartDragCoords);


        },
        /* eslint-enable */  
        // end tdd -------------------------------------------------------------------------------------------
        // ---------------------------------------------------------------------------------------------------
        mouseoverPointer () {
            document.body.style.cursor = 'pointer';
        },
        mouseoutPointer () {
            document.body.style.cursor = 'default';
        },
        addCargo(units, dimx, dimy) {
            //console.log("Captured event with units: " + units + " dimx: " + dimx + " dimy: " + dimy);
            //Captured event with units: Imperial dimx: 48.00 dimy: 40.00
            //Captured event with units: Metric dimx: 80.00 dimy: 120.00
            //console.log("this.cargo before add:"); //tmpdbg
            //console.table(this.cargo); //tmpdbg
            var cargoId = uniqueId("cargo-")
            this.cargo.push({id: cargoId,
                             units: units,
                             dimx: parseFloat(dimx),
                             dimy: parseFloat(dimy),
                             x: 0,
                             y: 0,
                            });
            //console.log("this.cargo after add: "); //tmpdbg
            //console.table(this.cargo); //tmpdbg
        },
        loadSpaceSet(units, dimx, dimy){
            //console.log("Captured event with units: " + units + " dimx: " + dimx + " dimy: " + dimy);
            //Captured event with units: Imperial dimx: 48.00 dimy: 40.00
            //Captured event with units: Metric dimx: 80.00 dimy: 120.00
            //console.log("this.truck before loadSpaceSet:"); //tmpdbg
            //console.table(this.truck); //tmpdbg
            // truck: {units: "Imperial", originx: 500, originy: 10, dimx: 100, dimy: 200 }, 
            this.truck = {units: units,
                          originx: this.truck.originx,
                          originy: this.truck.originy,
                          dimx: dimx,
                          dimy: dimy,};
            //console.log("this.truck after loadSpaceSet: "); //tmpdbg
            //console.table(this.truck); //tmpdbg
            this.resizeStage();
        },
        deleteCargo(item, index) {
            this.cargo.splice(index, 1);
            //console.log(`deleteCargo rectangle clicked or tapped: index: ${index} id: ${item.id} dimx: ${item.dimx} dimy: ${item.dimy}`) //tmpdbg
            this.mouseoutPointer(); // restore mouse pointer to default
        },
        deleteCargoCategory(drawerItem) {
            //console.log(drawerItem); //tmpdbg
            drawerItem.value.forEach(
                function (cargoItem) {
                    // console.log("cargoItem"); //tmpdbg
                    // console.log(cargoItem); //tmpdbg
                    // console.log("this.cargo"); //tmpdbg
                    // console.log(this.cargo); //tmpdbg
                    var foundIndex = this.cargo.findIndex(cargoEl=> (cargoEl.id === cargoItem.id));
                    if (foundIndex > -1) {
                        //console.log("cargoItem.id " + cargoItem.id + " was found at index " + foundIndex ); //tmpdbg
                        this.deleteCargo(cargoItem, foundIndex);
                    }
                }.bind(this));
        },
        deleteCargoCategoryItem(item) {
            if (item['value'].length <= 1) {
                //console.log("item['value'].length is : " + item['value'].length + "stop deleting"); //tmpdbg
                // console.log(("the last value of item['value'] is : "
                //              + this.prObj(item['value'][item['value'].length - 1]) +
                //              " with id: " + this.prObj(item['value'][item['value'].length - 1]['id']))); //tmpdbg
                return;
            } else {
                // console.log("item['value'].length is : " + item['value'].length);
                // console.log(("the last value of item['value'] is : "
                //             + this.prObj(item['value'][item['value'].length - 1]) +
                //              " with id: " + this.prObj(item['value'][item['value'].length - 1]['id'])));
                
                var lastCargoCategoryItem =  item['value'][item['value'].length - 1];
                var deleteCargoCategoryItemIndex = lastCargoCategoryItem['id'];
                // console.log(this.prObj(this.cargo));
                
                var foundIndex = this.cargo.findIndex(cargoEl=> (cargoEl.id === deleteCargoCategoryItemIndex));
                if (foundIndex > -1) {
                    //console.log("lastCargoCategoryItem['id'] " + lastCargoCategoryItem['id'] + " was found at index " + foundIndex); //tmpdbg
                    this.deleteCargo(lastCargoCategoryItem, foundIndex);
                }
                
            }
        },
        rotateCargo(item, index) {
            //console.log(`rotateCargo rectangle clicked or tapped before: index: ${index} id: ${item.id} dimx: ${item.dimx} dimy: ${item.dimy}`) //tmpdbg
            var tempdimx = this.cargo[index].dimx;
            this.cargo[index].dimx = this.cargo[index].dimy;
            this.cargo[index].dimy = tempdimx;
            //console.log(`rotateCargo rectangle clicked or tapped after: index: ${index} id: ${item.id} dimx: ${item.dimx} dimy: ${item.dimy}`) //tmpdbg
        },
        /* eslint-enable */
        resizeStage() {
            var stage = this.$refs.stage.getStage()
            var parentOfContainerWidth = document.getElementById("container").parentNode.offsetWidth;
            
            stage.width(parentOfContainerWidth);
            stage.height(window.innerHeight*2);
            this.truck.originx = this.truckLocationX();
            
            //console.log("resize has occured stage width: " + stage.width() + " stage height: " + stage.height() ); //tmpdbg
        },
        truckLocationX() {
            // var parentOfContainerWidth = document.getElementById("container").parentNode.offsetWidth;
            // var parentOfContainerHeight = document.getElementById("container").parentNode.offsetHeight;
            var stage = this.$refs.stage.getStage()
            var stageWidth = stage.width()
            //             truck: {units: "Imperial", originx: 500, originy: 10, dimx: 102, dimy: 576 },
            // width: this.truck.units === 'Imperial' ?  this.truck.dimx * scaleFactor : this.truck.dimx * 0.3937 * scaleFactor,
            var truckWidth;
            if (this.truck.units === "Imperial") {
                truckWidth = this.truck.dimx * this.scaleFactor;
                // return "stageWidth: " + stageWidth + " truckWidth: " + truckWidth
                //     + " Math.round((stageWidth - truckWidth)/2): " + Math.round((stageWidth - truckWidth)/2);
                return Math.round((stageWidth - (truckWidth + 20))/2)
                //return [JSON.stringify(this.truck), this.scaleFactor, "IMPERIAL", truckWidth, stageWidth, parentOfContainerWidth];
            } else {
                truckWidth = this.truck.dimx * 0.3937 * this.scaleFactor;
                // return "stageWidth: " + stageWidth + " truckWidth: " + truckWidth
                //             + " Math.round((stageWidth - truckWidth)/2): " + Math.round((stageWidth - truckWidth)/2);
                return Math.round((stageWidth - (truckWidth + 20))/2)
                //return [JSON.stringify(this.truck), this.scaleFactor, "METRIC", truckWidth, stageWidth, parentOfContainerWidth];
            }
        },
        lowestYBound () {
            //console.log(this.$refs.layer.getNode().getLayer().children); //tmpdbg
            this.$refs.layer.getNode().getLayer().children.forEach(
                function (el) {
                    if (el.id() === "cargoGroup") {
                        // console.log("data?: " + el.attrs.cargoId + "el.id: " + el.id() +  " y value: " + el.y() +  " height: "
                        //             + el.findOne('Rect').getClientRect().height); //tmpdbg
                    }
                }
            );
            var allChildren = this.$refs.layer.getNode().getLayer().children;
            var cargoGroupElements = allChildren.filter(el => el.id() === "cargoGroup")
            var lowestYBound = cargoGroupElements.map((el)=>el.y() + el.findOne('Rect').getClientRect().height);
            //console.log(lowestYBound); //tmpdbg
            return Math.max(...lowestYBound, 0)+1;
        },
    },
    computed: {
        generateNavDrawerList () {
            var groupedCargo = groupBy(this.cargo, (cargo)=>[cargo.units, cargo.dimx, cargo.dimy]);
            var groupedCargoArrayStr = Object.entries(groupedCargo).map(element => [element[0].split(","), element[1]]);
            var groupedCargoArray = Object.entries(groupedCargoArrayStr).map(element =>
                                                                             [[element[1][0][0], parseInt(element[1][0][1]), parseInt(element[1][0][2])], element[1][1]]);
            var orderedGroupedCargoArray = (orderBy(groupedCargoArray, [(el)=>el[0][0], (el)=>el[0][1], (el)=>el[0][2], ['asc', 'asc', 'asc']]))
            var navDrawerListArray =
                orderedGroupedCargoArray.map(
                    (el)=> ({title : `${el[0][1]}${el[0][0] === 'Imperial' ? 'in' : 'cm'} x ${el[0][2]}${el[0][0] === 'Imperial' ? 'in' : 'cm'}`,
                             value : el[1]}));
            return navDrawerListArray;
            // console.log(this.prObj(navDrawerListArray)); 
            // [{"title": "42in x 42in",
            //   "value": [{"id": "cargo-3", "units": "Imperial", "dimx": 42, "dimy": 42}]},
            //  {"title": "48in x 40in",
            //   "value": [{"id": "cargo-1", "units": "Imperial", "dimx": 48, "dimy": 40},
            //             {"id": "cargo-2", "units": "Imperial", "dimx": 48, "dimy": 40}]},
            //  {"title": "48in x 48in",
            //   "value": [{"id": "cargo-4", "units": "Imperial", "dimx": 48, "dimy": 48}]},
            //  {"title": "80cm x 60cm",
            //   "value": [{"id": "cargo-8", "units": "Metric", "dimx": 80, "dimy": 60}]},
            //  {"title": "80cm x 120cm",
            //   "value": [{"id": "cargo-5", "units": "Metric", "dimx": 80, "dimy": 120},
            //             {"id": "cargo-6", "units": "Metric", "dimx": 80, "dimy": 120}]},
            //  {"title": "120cm x 100cm",
            //   "value": [{"id": "cargo-7", "units": "Metric", "dimx": 120, "dimy": 100}]}]





            
        },
    },
    watch: {
      group () {
        this.drawer = false
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}

</style>


