<template>
<div class="hello">
  <h1>{{ msg }}</h1>
</div>
<v-btn color="primary" @click="addCargo()" > Add </v-btn>

<add-dialog />


<div id="container"></div>


<v-stage ref="stage" :config="stageSize">
  <v-layer ref="layer">
    <v-rect v-for="item in cargo"
            
            :key="item.id"
            :config="{
                     x: Math.floor(Math.random() * 300),
                     y: Math.floor(Math.random() * 300),
                     width: item.dimx,
                     height: item.dimy,
                     fill: 'red',
                     shadowBlur: 10,
                     draggable: true
                     }"
            />
  </v-layer>
</v-stage>
</template>



<script>
//import Konva from "konva";

import AddDialog from './AddDialog.vue'


const width = window.innerWidth;
const height = window.innerHeight;



export default {
    name: 'HelloWorld',
    components: {
        AddDialog
    },
    
    mounted() {
        this.$refs.stage.getStage().container().style.backgroundColor='#f0f0f0';
        // var shape = new Konva.Rect({x: 0, y: 30, width: 50, height: 90, stroke: "red", strokewidth: 1});
        // this.$refs.layer.getNode().getLayer().add(shape);
        // this.$refs.layer.getNode().getLayer().add(new Konva.Rect({x: 0, y: 30, width: 50, height: 90, stroke: "red", strokewidth: 1}));
    },
    data() {
        return {
            dialog: false,
            stageSize: {
                container: 'container',
                width: width,
                height: height,
            },
            cargo: [{id: 12, dimx: 10, dimy: 20},
                    {id: 34, dimx: 10, dimy: 30},
                    {id: 56, dimx: 20, dimy: 40},
                    {id: 78, dimx: 50, dimy: 40},
                    {id: 90, dimx: 5, dimy: 11}],
        };
    },
    methods: {
        say() {
            console.log("open dialog clicked");
        },
        addCargo() {
            this.cargo.push({id: 99, dimx: 100, dimy: 200});
        }
    }
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


