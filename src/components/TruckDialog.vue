<template>


<v-dialog v-model="dialog" :width="displayWidth">
  <template v-slot:activator="{ props }">
    <v-btn v-if="mobileOrDesktop==='desktop'"
      prepend-icon="mdi-truck-outline"  :color="customColor"
      :class="customClasses" :block="blockStyle" :variant="variantStyle"
      :style="customStyle"
      v-bind="props">
      Set Loading Space </v-btn>
    <v-btn v-else
      icon="mdi-truck-outline"  :color="customColor"
      class="my-2" :block="blockStyle"
      v-bind="props"></v-btn>
  </template>
  
  <v-card>
    <v-card-title class="text-h5"> Set Loading Space </v-card-title>
    <v-form ref="setTruckSizeForm" @submit.prevent="onSubmit">
      <v-container>
        <v-row>
          <v-col>
            <v-select
              label="Select Metric (cm) or Imperial (in) Units"
              v-model="selectedUnits"
              :items="unitChoice"
              item-title="desc"
              item-value="unit"
              @update:modelValue="newUnitSelected()"
              return-object
              ></v-select>
            
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="dimx"
              @change="dimx = Number.parseFloat(dimx).toFixed(2).toString()"
              :label="(this.selectedUnits.unit === 'Metric') ? 'Width (cm)' : 'Width (in)'"
              :suffix="(this.selectedUnits.unit === 'Metric') ? 'cm' : 'in'"
              :rules="dimRules"
              validate-on="input"
              ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="dimy"
              @change="dimy = Number.parseFloat(dimy).toFixed(2).toString()"
              :label="(this.selectedUnits.unit === 'Metric') ? 'Length (cm)' : 'Length (in)'"
              :suffix="(this.selectedUnits.unit === 'Metric') ? 'cm' : 'in'"
              :rules="dimRules"
              ></v-text-field>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col>
            <v-select
              v-if="selectedUnits.unit === 'Metric'"
              label="Loading Spaces (centimetres)"
              v-model="metricLoadingSpace"
              :items="metricLoadingSpaceSizes"
              item-title="desc"
              item-value="tuple"
              @update:modelValue="newMetricPalletSelected()"
              return-object
              ></v-select>
            
            <v-select
              v-else
              label="Loading Spaces (inches)"
              v-model="imperialLoadingSpace"
              :items="imperialLoadingSpaceSizes"
              item-title="desc"
              item-value="tuple"
              @update:modelValue="newImperialPalletSelected()"
              return-object
              ></v-select>
          </v-col>
        </v-row>
        
        
        
      </v-container>
    </v-form>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="onSubmit"> Submit </v-btn>
      <v-btn color="error" @click="dialog = false"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script>
  import { computed } from 'vue'
  import { useDisplay } from 'vuetify'

export default {
    customColor: "",
    customClasses: "",
    blockStyle: false,
    variantStyle: "",
    customStyle: "",
    mobileOrDesktop: "desktop",
    props:
    {
        customColor: String,
        customClasses: String,
        blockStyle: Boolean,
        variantStyle: String,
        customStyle: Object,
        mobileOrDesktop: String,
    },
    setup () {
        const { name } = useDisplay()
        
        const displayWidth = computed(() => {
            // console.log(name.value);
            // name is reactive and
            // must use .value
            switch (name.value) {
            case 'xs':
            case 'sm': return "100vw"
            case 'md': 
            case 'lg': 
            case 'xl': 
            case 'xxl': return "40vw"
            default: return "100vw"
            }
        })
        
        return { displayWidth }
    },
    
    data() {
        return {
            // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            // ...and ensure strings of whitespace fail
            dimRules: [
                value => {
                    if (value) return true
                    return "Dimension is required."},
                value => {
                    if(!isNaN(value) && !isNaN(parseFloat(value))) return true
                    return "Dimension must be a number."}],
            
            selectedUnits: { desc: 'Imperial (inches)', unit: 'Imperial' },
            unitChoice: [
                { desc: 'Metric (centimetres)', unit: 'Metric' },
                { desc: 'Imperial (inches)', unit: 'Imperial' },
            ],
            metricLoadingSpace: { desc: 'Box Trailer 246cm x 1350cm', tuple: ["246.00", "1350.00"] },
            metricLoadingSpaceSizes: [
                { desc: 'Box Trailer 246cm x 1350cm', tuple: ["246.00", "1350.00"] },
                { desc: 'Mega Trailer 247cm x 1360cm', tuple: ["247.00", "1360.00"] },
                { desc: 'Refridgerated Trailer 249cm x 1341cm', tuple: ["249.00", "1341.00"] },
                { desc: 'Single Truck Unit 250cm x 800cm', tuple: ["250.00", "800.00"] },
            ],
            imperialLoadingSpace: { desc: 'Flatbed Trailer 102" (8.5ft) x 576" (48ft)',   tuple: ["102.00", "576.00"] },
            imperialLoadingSpaceSizes: [
                { desc: 'Flatbed Trailer 102" (8.5ft) x 576" (48ft)',   tuple: ["102.00", "576.00"] },
                { desc: 'Flatbed Trailer 96" (8ft) x 576" (48ft)',      tuple: ["96.00",  "576.00"] },
                { desc: 'Container Chassis 102" (8.5ft) x 240" (48ft)', tuple: ["102.00", "240.00"] },
                { desc: 'Container Chassis 96" (8ft) x 240" (48ft)',    tuple: ["96.00", "240.00"] },
            ],
            dimx: "102.00",
            dimy: '576.00',
            dialog: false,
        };
    },
    
    methods: {
        newUnitSelected() {
            if (this.selectedUnits.unit === "Metric") {
                this.dimx=this.metricLoadingSpace.tuple[0];
                this.dimy=this.metricLoadingSpace.tuple[1];
            }
            else {
                this.dimx=this.imperialLoadingSpace.tuple[0];
                this.dimy=this.imperialLoadingSpace.tuple[1];
            }
        },
        newMetricPalletSelected() {
            this.dimx=this.metricLoadingSpace.tuple[0];
            this.dimy=this.metricLoadingSpace.tuple[1];
        },
        newImperialPalletSelected() {
            this.dimx=this.imperialLoadingSpace.tuple[0];
            this.dimy=this.imperialLoadingSpace.tuple[1];
        },
        onSubmit() {
            this.$emit('load-space-set', this.selectedUnits.unit, this.dimx, this.dimy);
            //this.$refs.addCargoForm.reset(); //fails
            this.$refs.setTruckSizeForm.resetValidation(); //works!
            this.dialog=false;
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


