<template>

<v-layout>
  <v-app-bar color="primary">
    
    
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>


    <div class="d-flex">
      <truck-dialog customClasses="ma-2 px-4" variantStyle="outlined" customColor="white"
                    :mobileOrDesktop="this.displayWidth"
                    :customStyle="{backgroundColor: 'green'}" @load-space-set="loadSpaceSet" />
      
      <add-dialog customClasses="ma-2 px-4" variantStyle="outlined" customColor="white"
                  :mobileOrDesktop="this.displayWidth"
                  :customStyle="{backgroundColor: 'green'}" @cargo-added="addCargo" />
      
      <v-btn v-if="this.displayWidth==='desktop'" :style="{backgroundColor: 'green'}"
             class="ma-2 px-4" color="white" @click="say()"> TEST </v-btn>
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
                   <v-row >
                     <v-col cols="2" align-self="center" class="ma-0 pa-0" :style="{userSelect: 'none'}">
                       <v-btn variant="tonal" density="compact" icon="mdi-trash-can-outline" color="primary"
                              @click="deleteCargoCategory(item)" @tap="deleteCargoCategory(item)"></v-btn>
                     </v-col>
                     <v-col cols="5" align-self="center" class="ma-0 pa-0" :style="{userSelect: 'none'}">
                       {{ item.title }}
                     </v-col>
                     <v-col cols="2" align-self="center" class="ma-0 pa-0" :style="{userSelect: 'none'}">
                       <v-btn variant="tonal" density="compact" icon="mdi-minus" color="primary"
                              @click="deleteCargoCategoryItem(item)" @tap="deleteCargoCategoryItem(item)"></v-btn>
                     </v-col>
                     <v-col cols="1" align-self="center" class="ma-0 pa-0" :style="{userSelect: 'none'}">
                       {{ item.value.length }}
                     </v-col>
                     <v-col cols="2" align-self="center" class="ma-0 pa-0" :style="{userSelect: 'none'}">
                       <v-btn variant="tonal" density="compact" icon="mdi-plus"  color="primary"
                              @click="addCargo(item['value'][0]['units'], item['value'][0]['dimx'], item['value'][0]['dimy'])"
                              @tap="addCargo(item['value'][0]['units'], item['value'][0]['dimx'], item['value'][0]['dimy'])"></v-btn>
                     </v-col>
                   </v-row>
                 </v-container>
    </div>
    <v-btn :style="{backgroundColor: 'green'}" class="ma-2 px-4" color="white" @click="say()"> TEST </v-btn>
  </v-navigation-drawer>
  
  <v-main id="container" class="d-flex align-center justify-center">
    
  </v-main>      
  
</v-layout>

<v-stage ref="stage" :config="stageConfig">
  <v-layer @dragstart="saveCoords" @dragend="layerDragHandler" ref="layer">
    <!-- truck left wall -->
    <v-rect
      :config="{
               id: 'truckWall',
               x: this.truck.originx,
               y: this.truck.originy,
               width: 10,
               height: this.truck.units === 'Imperial' ? this.truck.dimy * this.scaleFactor : this.truck.dimy * 0.3937 * this.scaleFactor,
               fill: 'red',
               }"
      />
    <!-- truck back wall -->
    <v-rect
      :config="{
               id: 'truckWall',
               x: this.truck.originx + 10,
               y: this.truck.originy,
               width: this.truck.units === 'Imperial' ?  this.truck.dimx * this.scaleFactor : this.truck.dimx * 0.3937 * this.scaleFactor,
               height: 10,
               fill: 'red',
               }"
      />
    <!-- truck right wall -->
    <v-rect
      :config="{
               id: 'truckWall',
               x: this.truck.units === 'Imperial' ? this.truck.originx + this.truck.dimx * this.scaleFactor + 10 : this.truck.originx + this.truck.dimx * 0.3937 * this.scaleFactor + 10,
               y: this.truck.originy,
               width: 10,
               height: this.truck.units === 'Imperial' ? this.truck.dimy * this.scaleFactor : this.truck.dimy * 0.3937 * this.scaleFactor,
               fill: 'red',
               }"
      />
    
    <template v-for="(item, index) in cargo" :key="item.id">
      <!-- everything in the group is  offset by a 10x10 pixel square in the v-group, -->
      <!-- :cargoId accessible from layer children el: el.attrs.cargoId  -->
      <pallet-konva-group :truck="this.truck" :item="item" :index="index" :scaleFactor="this.scaleFactor"
                          :lowestYBound="this.lowestYBound()"
                          @delete-cargo="deleteCargo(item, index)"
                          @rotate-cargo="rotateCargo(item, index)"/>
    </template>
  </v-layer>
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
        
        var closeIcon = new Image();
        closeIcon.src = 'close.jpg';
        closeIcon.onload = () => {
            // set image only when it is loaded
            this.closeIcon = closeIcon;
        };
        var rotateIcon = new Image();
        rotateIcon.src = 'rotate.jpg';
        rotateIcon.onload = () => {
            // set image only when it is loaded
            this.rotateIcon = rotateIcon;
        };
        
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
                container: 'container',
                width: width,
                height: height,
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
        prObj(obj) {return JSON.stringify(obj, undefined, 2);},
        say () {
            //this.$refs.stage.getStage().container().style.backgroundColor='#f0f0f0';
            // console.log(this.$refs.layer.getNode().getLayer().children[0].id())
            // console.log(this.$refs.layer.getNode().getLayer().children[0].getClientRect())
            // console.log(this.$refs.layer.getNode().getLayer().children[3].id())
            // console.log(this.$refs.layer.getNode().getLayer().children[3].findOne('Rect').getClientRect())
            console.log(this.displayWidth); // returns "desktop" or "mobile"
            // console.log(this.$refs.stage.getStage().width());
            // console.log(this.truckLocationX());
            // console.log(this.lowestYBound());
            
            
        },
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
            console.log("this.cargo before add:");
            console.table(this.cargo);
            var cargoId = uniqueId("cargo-")
            this.cargo.push({id: cargoId,
                             units: units,
                             dimx: parseFloat(dimx),
                             dimy: parseFloat(dimy)});
            console.log("this.cargo after add: ");
            console.table(this.cargo);
        },
        loadSpaceSet(units, dimx, dimy){
            //console.log("Captured event with units: " + units + " dimx: " + dimx + " dimy: " + dimy);
            //Captured event with units: Imperial dimx: 48.00 dimy: 40.00
            //Captured event with units: Metric dimx: 80.00 dimy: 120.00
            console.log("this.truck before loadSpaceSet:");
            console.table(this.truck);
            // truck: {units: "Imperial", originx: 500, originy: 10, dimx: 100, dimy: 200 }, 
            this.truck = {units: units,
                          originx: this.truck.originx,
                          originy: this.truck.originy,
                          dimx: dimx,
                          dimy: dimy,};
            console.log("this.truck after loadSpaceSet: ");
            console.table(this.truck);
        },
        deleteCargo(item, index) {
            this.cargo.splice(index, 1);
            console.log(`deleteCargo rectangle clicked or tapped: index: ${index} id: ${item.id} dimx: ${item.dimx} dimy: ${item.dimy}`)
            this.mouseoutPointer(); // restore mouse pointer to default
        },
        deleteCargoCategory(drawerItem) {
            console.log(drawerItem);
            drawerItem.value.forEach(
                function (cargoItem) {
                    console.log("cargoItem");
                    console.log(cargoItem);
                    console.log("this.cargo");
                    console.log(this.cargo);
                    var foundIndex = this.cargo.findIndex(cargoEl=> (cargoEl.id === cargoItem.id));
                    if (foundIndex > -1) {
                        console.log("cargoItem.id " + cargoItem.id + " was found at index " + foundIndex );
                        this.deleteCargo(cargoItem, foundIndex);
                    }
                }.bind(this));
        },
        deleteCargoCategoryItem(item) {
            if (item['value'].length <= 1) {
                console.log("item['value'].length is : " + item['value'].length + "stop deleting");
                console.log(("the last value of item['value'] is : "
                             + this.prObj(item['value'][item['value'].length - 1]) +
                             " with id: " + this.prObj(item['value'][item['value'].length - 1]['id'])));
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
                    console.log("lastCargoCategoryItem['id'] " + lastCargoCategoryItem['id'] + " was found at index " + foundIndex);
                    this.deleteCargo(lastCargoCategoryItem, foundIndex);
                }
                
            }
        },
        rotateCargo(item, index) {
            console.log(`rotateCargo rectangle clicked or tapped before: index: ${index} id: ${item.id} dimx: ${item.dimx} dimy: ${item.dimy}`)
            var tempdimx = this.cargo[index].dimx;
            this.cargo[index].dimx = this.cargo[index].dimy;
            this.cargo[index].dimy = tempdimx;
            console.log(`rotateCargo rectangle clicked or tapped after: index: ${index} id: ${item.id} dimx: ${item.dimx} dimy: ${item.dimy}`)
        },
        haveIntersection(r1, r2) {
            return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
        },
        //target is being dragged, groupOrRect is being collided with
        processCollisions (groupOrRect, target, targetRect){
            //console.log(groupOrRect.id());
            //console.log(targetRect);
            var bareRect = (groupOrRect.id() === 'truckWall') ? groupOrRect.getClientRect() : groupOrRect.findOne('Rect').getClientRect();
            if (groupOrRect === target) {
                return;
            }
            if (this.haveIntersection(bareRect, targetRect)) {
                // (groupOrRect.id() === 'truckWall') ? groupOrRect.fill('green') : groupOrRect.findOne('Rect').fill('green');
                target.x(this.saveStartDragCoords.x);
                target.y(this.saveStartDragCoords.y);
            }
            // else {
            //     (groupOrRect.id() === 'truckWall') ? groupOrRect.fill('red') : groupOrRect.findOne('Rect').fill('red');
            // }
        },
        saveCoords (event) {
            this.saveStartDragCoords.x = event.target.x()
            this.saveStartDragCoords.y = event.target.y()
            console.log(`dragstart event: event.target.findOne('Rect').getClientRect() ${JSON.stringify(event.target.findOne('Rect').getClientRect(), undefined, 2)}`);
            // {
            //     "x": 40,
            //     "y": 40,
            //     "width": 100,
            //     "height": 80
            // }
            console.log(`this.saveStartDragCoords.x ${this.saveStartDragCoords.x} this.saveStartDragCoords.y ${this.saveStartDragCoords.y}`);
            // this.saveStartDragCoords.x 40 this.saveStartDragCoords.y 40
            
            
        },
        layerDragHandler(event) {
            var target = event.target;
            var targetRect = event.target.findOne('Rect').getClientRect();
            this.$refs.layer.getNode().getLayer().children.forEach((groupOrRect)=>this.processCollisions(groupOrRect, target, targetRect));
            //console.log(`target.x : ${JSON.stringify(target.x, undefined, 2)}, target.y : ${JSON.stringify(target.y, undefined, 2)}`)
            //console.log(`event.target: ${JSON.stringify(event.target, undefined, 2)}, 
            //             event.target.getClientRect() ${JSON.stringify(event.target.getClientRect(), undefined, 2)} `);
        },
        resizeStage() {
            var stage = this.$refs.stage.getStage()
            var parentOfContainerWidth = document.getElementById("container").parentNode.offsetWidth;
            
            stage.width(parentOfContainerWidth);
            stage.height(window.innerHeight);
            this.truck.originx = this.truckLocationX();
            
            console.log("resize has occured stage width: " + stage.width() + " stage height: " + stage.height() );
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
            console.log(this.$refs.layer.getNode().getLayer().children);
            this.$refs.layer.getNode().getLayer().children.forEach(
                function (el) {
                    if (el.id() === "cargoGroup") {
                        console.log("data?: " + el.attrs.cargoId + "el.id: " + el.id() +  " y value: " + el.y() +  " height: "
                                    + el.findOne('Rect').getClientRect().height)
                    }
                }
            );
            var allChildren = this.$refs.layer.getNode().getLayer().children;
            var cargoGroupElements = allChildren.filter(el => el.id() === "cargoGroup")
            var lowestYBound = cargoGroupElements.map((el)=>el.y() + el.findOne('Rect').getClientRect().height);
            console.log(lowestYBound);
            return Math.max(...lowestYBound, 0);
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


