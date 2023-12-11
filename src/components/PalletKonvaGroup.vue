<template>
<v-group
  ref="cargoGroupRef"
  :config="{id: 'cargoGroup', 
           draggable: true,
           }"
  :cargoId="item.id">
  
  <v-rect
    :config="{
             id: 'cargoGroup',
             x: 0,
             y: 0,
             width: item.units === 'Imperial' ? item.dimx * scaleFactor : Math.floor(item.dimx * 0.3937 * scaleFactor),
             height: item.units === 'Imperial' ? (item.dimy) * scaleFactor : Math.floor(item.dimy * 0.3937 * scaleFactor),
             fill: 'yellow',
             strokeWidth: 1,
             stroke: 'black',
             }"
    />

  <!-- old text with pixel coordinates: //tmpdbg
  text: `${item.x} x ${item.y}\n${item.id}\n${item.dimx}${item.units === 'Imperial' ? 'in' : 'cm'} x ${item.dimy}${item.units === 'Imperial' ? 'in' : 'cm'}`, -->
  <v-text
    :config="{
             x: 0,
             y: 0,
             text: `${item.id}\n${item.dimx}${item.units === 'Imperial' ? 'in' : 'cm'} x ${item.dimy}${item.units === 'Imperial' ? 'in' : 'cm'}`,
             fontFamily: 'Georgia',
             fontSize: 7*scaleFactor,
             fill: 'black',
             wrap: 'none',
             width: item.units === 'Imperial' ? Math.max(50*scaleFactor, (item.dimx) * scaleFactor) : Math.max(50*scaleFactor, (item.dimx) * 0.3937 * scaleFactor),
             height: item.units === 'Imperial' ? (item.dimy) * scaleFactor : (item.dimy) * 0.3937 * scaleFactor,
             align: 'center',
             verticalAlign: 'middle'
             }"
    />
  
  <!-- old width and height //tmpdbg
             width: (item.units === 'Imperial') ? Math.max(5, .005 * (item.dimx*item.dimy) * scaleFactor) : Math.max(5, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             height: (item.units === 'Imperial') ?  Math.max(5, .005 * (item.dimx*item.dimy) * scaleFactor) : Math.max(5, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             fillPatternImage: this.closeIcon,
             fillPatternScaleX: (item.units === 'Imperial') ? Math.max(5, .005 * (item.dimx*item.dimy) * scaleFactor)/16 : Math.max(5, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
             fillPatternScaleY: (item.units === 'Imperial') ?  Math.max(5, .005 * (item.dimx*item.dimy) * scaleFactor)/16 : Math.max(5, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
  -->
  <v-rect
    @tap="$emit('deleteCargo', item, index)"
    @click="$emit('deleteCargo', item, index)"
    @mouseover="mouseoverPointer"
    @mouseout="mouseoutPointer"
    :config="{
             x: 0,
             y: 0,
             width: (item.units === 'Imperial') ? Math.max(16, .005 * (item.dimx*item.dimy) * scaleFactor) : Math.max(16, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             height: (item.units === 'Imperial') ?  Math.max(16, .005 * (item.dimx*item.dimy) * scaleFactor) : Math.max(16, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             fillPatternImage: this.closeIcon,
             fillPatternScaleX: (item.units === 'Imperial') ? Math.max(16, .005 * (item.dimx*item.dimy) * scaleFactor)/16 : Math.max(16, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
             fillPatternScaleY: (item.units === 'Imperial') ?  Math.max(16, .005 * (item.dimx*item.dimy) * scaleFactor)/16 : Math.max(16, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
             }"
    />

  <!-- old width and height //tmpdbg
  width: (item.units === 'Imperial') ? Math.max(5, .005 * (item.dimx*item.dimy) * scaleFactor) : Math.max(5, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
  height: (item.units === 'Imperial') ? Math.max(5, .005 * (item.dimx*item.dimy) * scaleFactor) : Math.max(5, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
  fillPatternImage: rotateIcon,
  fillPatternScaleX: (item.units === 'Imperial') ? Math.max(5, .005 * (item.dimx*item.dimy) * scaleFactor)/16 : Math.max(5, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
  fillPatternScaleY: (item.units === 'Imperial') ? Math.max(5, .005 * (item.dimx*item.dimy) * scaleFactor)/16 : Math.max(5, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16, 
  -->
  <v-rect
    @tap="$emit('rotateCargo', item, index)"
    @click="$emit('rotateCargo', item, index)"
    @mouseover="mouseoverPointer"
    @mouseout="mouseoutPointer"
    :config="{
             x:(item.units === 'Imperial') ?  ((item.dimx) * scaleFactor) - Math.max(16, 0.005 * (item.dimx*item.dimy) * scaleFactor) 
             : ((item.dimx) * 0.3937 * scaleFactor) - Math.max(16, 0.005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             y: 0,
             width: (item.units === 'Imperial') ? Math.max(16, .005 * (item.dimx*item.dimy) * scaleFactor) : Math.max(16, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             height: (item.units === 'Imperial') ?  Math.max(16, .005 * (item.dimx*item.dimy) * scaleFactor) : Math.max(16, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             fillPatternImage: rotateIcon,
             fillPatternScaleX: (item.units === 'Imperial') ? Math.max(16, .005 * (item.dimx*item.dimy) * scaleFactor)/16 : Math.max(16, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
             fillPatternScaleY: (item.units === 'Imperial') ?  Math.max(16, .005 * (item.dimx*item.dimy) * scaleFactor)/16 : Math.max(16, .005 * (item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
             }"
    />
  <v-line
    :config="{
             id: 'topBorder',
             points: [0,0,item.units === 'Imperial' ? item.dimx * scaleFactor : item.dimx * 0.3937 * scaleFactor,0],
             strokeWidth: 2,
             stroke: 'black',
             shadowColor: 'red',
             shadowBlur: 10,
             shadowEnabled: false,
             }"
    />

  <v-line
    :config="{
             id: 'bottomBorder',
             points: [0,
                      item.units === 'Imperial' ? (item.dimy) * scaleFactor : (item.dimy) * 0.3937 * scaleFactor,
                      item.units === 'Imperial' ? item.dimx * scaleFactor : item.dimx * 0.3937 * scaleFactor,
                      item.units === 'Imperial' ? (item.dimy) * scaleFactor : (item.dimy) * 0.3937 * scaleFactor],
             strokeWidth: 2,
             stroke: 'black',
             shadowColor: 'red',
             shadowBlur: 10,
             shadowEnabled: false,
             }"
    />

  <v-line
    :config="{
             id: 'leftBorder',
             points: [0,
                      0,
                      0,
                      item.units === 'Imperial' ? (item.dimy) * scaleFactor : (item.dimy) * 0.3937 * scaleFactor],
             strokeWidth: 2,
             stroke: 'black',
             shadowColor: 'red',
             shadowBlur: 10,
             shadowEnabled: false,
             }"
    />

  <v-line
    :config="{
             id: 'rightBorder',
             points: [item.units === 'Imperial' ? item.dimx * scaleFactor : item.dimx * 0.3937 * scaleFactor,
                      0,
                      item.units === 'Imperial' ? item.dimx * scaleFactor : item.dimx * 0.3937 * scaleFactor,
                      item.units === 'Imperial' ? (item.dimy) * scaleFactor : (item.dimy) * 0.3937 * scaleFactor],
             strokeWidth: 2,
             stroke: 'black',
             shadowColor: 'red',
             shadowBlur: 10,
             shadowEnabled: false,
             }"
    />
  


</v-group>

</template>



<script>

//function prObj(obj) {return JSON.stringify(obj, undefined, 2)}

export default {
    props: {
        item: Object,
        index: Number,
        truck: Object,
        scaleFactor: Number,
        lowestYBound: Number,
    },
    mounted() {
        //console.log("Pallet component mounted"); //tmpdbg
        
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
        // set y value of pallet as lower than all other pallets for width of back truck wall
        // excluding the first one which is put in the top left corner of the truck
        if (this.index == 0) {
            this.$refs.cargoGroupRef.getNode().x(this.truck.originx + 11);
            this.$refs.cargoGroupRef.getNode().y(this.truck.originy + 11);
        } else {
            this.$refs.cargoGroupRef.getNode().x(this.truck.originx + 11);
            this.$refs.cargoGroupRef.getNode().y(this.lowestYBound);
        }
    },
    data() {
        return {
            closeIcon: null,
            rotateIcon: null,
        };
    },
    methods: {
        mouseoverPointer () {
            document.body.style.cursor = 'pointer';
        },
        mouseoutPointer () {
            document.body.style.cursor = 'default';
        },
    },
};


</script>

<style scoped>

</style>
