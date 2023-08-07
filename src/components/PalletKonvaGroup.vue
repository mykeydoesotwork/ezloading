<template>
<v-group
  ref="cargoGroupRef"
  :config="{id: 'cargoGroup', 
           x: 10, 
           y: 10, 
           draggable: true,
           }"
  :cargoId="item.id">
  
  <v-rect
    :config="{
             id: 'cargoGroup',
             x: truck.originx,
             y: truck.originy,
             width: item.units === 'Imperial' ? Math.round(item.dimx) * scaleFactor : Math.round(item.dimx) * 0.3937 * scaleFactor,
             height: item.units === 'Imperial' ? Math.round(item.dimy) * scaleFactor : Math.round(item.dimy) * 0.3937 * scaleFactor,
             fill: 'yellow',
             strokeWidth: 1,
             stroke: 'black',
             }"
    />
  
  <v-text
    :config="{
             x: truck.originx,
             y: truck.originy,
             text: `${item.dimx}${item.units === 'Imperial' ? 'in' : 'cm'} x ${item.dimy}${item.units === 'Imperial' ? 'in' : 'cm'}`,
             fontFamily: 'Georgia',
             fontSize: 7*scaleFactor,
             fill: 'black',
             wrap: 'none',
             width: item.units === 'Imperial' ? Math.max(50*scaleFactor, Math.round(item.dimx) * scaleFactor) : Math.max(50*scaleFactor, Math.round(item.dimx) * 0.3937 * scaleFactor),
             height: item.units === 'Imperial' ? Math.round(item.dimy) * scaleFactor : Math.round(item.dimy) * 0.3937 * scaleFactor,
             align: 'center',
             verticalAlign: 'middle'
             }"
    />
  
  <v-rect
    @tap="$emit('deleteCargo', item, index)"
    @click="$emit('deleteCargo', item, index)"
    @mouseover="mouseoverPointer"
    @mouseout="mouseoutPointer"
    :config="{
             x: truck.originx,
             y: truck.originy,
             width: (item.units === 'Imperial') ? Math.max(5, .005 * Math.round(item.dimx*item.dimy) * scaleFactor) : Math.max(5, .005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             height: (item.units === 'Imperial') ?  Math.max(5, .005 * Math.round(item.dimx*item.dimy) * scaleFactor) : Math.max(5, .005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             fillPatternImage: this.closeIcon,
             fillPatternScaleX: (item.units === 'Imperial') ? Math.max(5, .005 * Math.round(item.dimx*item.dimy) * scaleFactor)/16 : Math.max(5, .005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
             fillPatternScaleY: (item.units === 'Imperial') ?  Math.max(5, .005 * Math.round(item.dimx*item.dimy) * scaleFactor)/16 : Math.max(5, .005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
             }"
    />
  
  <v-rect
    @tap="$emit('rotateCargo', item, index)"
    @click="$emit('rotateCargo', item, index)"
    @mouseover="mouseoverPointer"
    @mouseout="mouseoutPointer"
    :config="{
             x:(item.units === 'Imperial') ?  truck.originx + (Math.round(item.dimx) * scaleFactor) - Math.max(5, 0.005 * Math.round(item.dimx*item.dimy) * scaleFactor) 
             : truck.originx + (Math.round(item.dimx) * 0.3937 * scaleFactor) - Math.max(5, 0.005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             y: truck.originy,
             width: (item.units === 'Imperial') ? Math.max(5, .005 * Math.round(item.dimx*item.dimy) * scaleFactor) : Math.max(5, .005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             height: (item.units === 'Imperial') ? Math.max(5, .005 * Math.round(item.dimx*item.dimy) * scaleFactor) : Math.max(5, .005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor),
             fillPatternImage: rotateIcon,
             fillPatternScaleX: (item.units === 'Imperial') ? Math.max(5, .005 * Math.round(item.dimx*item.dimy) * scaleFactor)/16 : Math.max(5, .005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
             fillPatternScaleY: (item.units === 'Imperial') ? Math.max(5, .005 * Math.round(item.dimx*item.dimy) * scaleFactor)/16 : Math.max(5, .005 * Math.round(item.dimx*0.3937*item.dimy*0.3937) * scaleFactor)/16,
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
        console.log("Pallet component mounted");
        
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
        // excluding the first one
        if (this.index > 0) {
            this.$refs.cargoGroupRef.getNode().y(this.lowestYBound)
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
