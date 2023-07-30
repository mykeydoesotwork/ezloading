<template>


<v-dialog v-model="dialog" :width="displayWidth">
  <template v-slot:activator="{ props }">
    <v-btn v-if="mobileOrDesktop==='desktop'"
      prepend-icon="mdi-forklift" :color="customColor"
      :class="customClasses" :block="blockStyle" :variant="variantStyle"
      :style="customStyle"
      v-bind="props">
      Add Cargo </v-btn>
    <v-btn v-else
      icon="mdi-forklift" :color="customColor"
      class="my-2" :block="blockStyle"
      v-bind="props"> </v-btn>
  </template>
  
  <v-card>
    <v-card-title class="text-h5"> Add Cargo </v-card-title>
    <v-form ref="addCargoForm" @submit.prevent="onSubmit">
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
              label="Metric Pallet Sizes (centimetres)"
              v-model="metricPallet"
              :items="metricPalletSizes"
              item-title="desc"
              item-value="tuple"
              @update:modelValue="newMetricPalletSelected()"
              return-object
              ></v-select>
            
            <v-select
              v-else
              label="Imperial Pallet Sizes (inches)"
              v-model="imperialPallet"
              :items="imperialPalletSizes"
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
            metricPallet: { desc: 'EUR 1 80cm x 120cm', tuple: ["80.00", "120.00"] },
            metricPalletSizes: [
                { desc: 'EUR 1 80cm x 120cm', tuple: ["80.00", "120.00"] },
                { desc: 'EUR 2 120cm x 100cm', tuple: ["120.00", "100.00"] },
                { desc: 'EUR 3 100cm x 120cm', tuple: ["100.00", "120.00"] },
                { desc: 'EUR 6 80cm x 60cm', tuple: ["80.00", "60.00"] },
            ],
            imperialPallet: { desc: '48" x 40"', tuple: ["48.00", "40.00"] },
            imperialPalletSizes: [
                { desc: '48" x 40"', tuple: ["48.00", "40.00"] },
                { desc: '42" x 42"', tuple: ["42.00", "42.00"] },
                { desc: '48" x 48"', tuple: ["48.00", "48.00"] }
            ],
            dimx: "48.00",
            dimy: '40.00',
            dialog: false,
        };
    },
    
    methods: {
        newUnitSelected() {
            if (this.selectedUnits.unit === "Metric") {
                this.dimx=this.metricPallet.tuple[0];
                this.dimy=this.metricPallet.tuple[1];
            }
            else {
                this.dimx=this.imperialPallet.tuple[0];
                this.dimy=this.imperialPallet.tuple[1];
            }
        },
        newMetricPalletSelected() {
            this.dimx=this.metricPallet.tuple[0];
            this.dimy=this.metricPallet.tuple[1];
        },
        newImperialPalletSelected() {
            this.dimx=this.imperialPallet.tuple[0];
            this.dimy=this.imperialPallet.tuple[1];
        },
        onSubmit() {
            this.$emit('cargo-added', this.selectedUnits.unit, this.dimx, this.dimy);
            //this.$refs.addCargoForm.reset(); //fails
            this.$refs.addCargoForm.resetValidation(); //works!
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


