(function(){"use strict";var e={84:function(e,t,i){var a=i(9242),l=i(3396);function o(e,t,i,a,o,r){const s=(0,l.up)("EzLoading");return(0,l.wg)(),(0,l.j4)(s)}var r=i(7139);const s={class:"d-flex"},n={class:"d-flex flex-column"};function c(e,t,i,o,c,d){const u=(0,l.up)("v-app-bar-nav-icon"),m=(0,l.up)("truck-dialog"),h=(0,l.up)("add-dialog"),p=(0,l.up)("v-btn"),g=(0,l.up)("v-app-bar-title"),f=(0,l.up)("v-app-bar"),y=(0,l.up)("v-sheet"),x=(0,l.up)("v-col"),v=(0,l.up)("v-row"),k=(0,l.up)("v-container"),S=(0,l.up)("v-navigation-drawer"),w=(0,l.up)("v-main"),b=(0,l.up)("v-layout"),C=(0,l.up)("v-rect"),M=(0,l.up)("v-text"),W=(0,l.up)("v-group"),F=(0,l.up)("v-layer"),_=(0,l.up)("v-stage");return(0,l.wg)(),(0,l.iD)(l.HY,null,[(0,l.Wm)(b,null,{default:(0,l.w5)((()=>[(0,l.Wm)(f,{color:"primary"},{default:(0,l.w5)((()=>[(0,l.Wm)(u,{onClick:t[0]||(t[0]=(0,a.iM)((e=>c.drawer=!c.drawer),["stop"]))}),(0,l._)("div",s,[(0,l.Wm)(m,{customClasses:"ma-2 px-4",variantStyle:"outlined",customColor:"white",mobileOrDesktop:this.displayWidth,customStyle:{backgroundColor:"green"},onLoadSpaceSet:d.loadSpaceSet},null,8,["mobileOrDesktop","onLoadSpaceSet"]),(0,l.Wm)(h,{customClasses:"ma-2 px-4",variantStyle:"outlined",customColor:"white",mobileOrDesktop:this.displayWidth,customStyle:{backgroundColor:"green"},onCargoAdded:d.addCargo},null,8,["mobileOrDesktop","onCargoAdded"]),"desktop"===this.displayWidth?((0,l.wg)(),(0,l.j4)(p,{key:0,style:{backgroundColor:"green"},class:"ma-2 px-4",color:"white",onClick:t[1]||(t[1]=e=>d.say())},{default:(0,l.w5)((()=>[(0,l.Uk)(" TEST ")])),_:1})):(0,l.kq)("",!0)]),(0,l.Wm)(g,null,{default:(0,l.w5)((()=>[(0,l.Uk)("Ez-Loading")])),_:1})])),_:1}),(0,l.Wm)(S,{modelValue:c.drawer,"onUpdate:modelValue":t[6]||(t[6]=e=>c.drawer=e),location:"left",temporary:""},{default:(0,l.w5)((()=>[(0,l._)("div",n,[(0,l.Wm)(y,{class:"ma-2"},{default:(0,l.w5)((()=>[(0,l.Wm)(m,{blockStyle:!0,mobileOrDesktop:"desktop",onLoadSpaceSet:d.loadSpaceSet},null,8,["onLoadSpaceSet"])])),_:1}),(0,l.Wm)(y,{class:"ma-2"},{default:(0,l.w5)((()=>[(0,l.Wm)(h,{blockStyle:!0,mobileOrDesktop:"desktop",onCargoAdded:d.addCargo},null,8,["onCargoAdded"])])),_:1}),((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(this.generateNavDrawerList,(e=>((0,l.wg)(),(0,l.j4)(k,{class:"ma-2",key:e.title},{default:(0,l.w5)((()=>[(0,l.Wm)(v,null,{default:(0,l.w5)((()=>[(0,l.Wm)(x,{cols:"2","align-self":"center",class:"ma-0 pa-0",style:{userSelect:"none"}},{default:(0,l.w5)((()=>[(0,l.Wm)(p,{variant:"tonal",density:"compact",icon:"mdi-trash-can-outline",color:"primary",onClick:t[2]||(t[2]=e=>d.say())})])),_:1}),(0,l.Wm)(x,{cols:"5","align-self":"center",class:"ma-0 pa-0",style:{userSelect:"none"}},{default:(0,l.w5)((()=>[(0,l.Uk)((0,r.zw)(e.title),1)])),_:2},1024),(0,l.Wm)(x,{cols:"2","align-self":"center",class:"ma-0 pa-0",style:{userSelect:"none"}},{default:(0,l.w5)((()=>[(0,l.Wm)(p,{variant:"tonal",density:"compact",icon:"mdi-minus",color:"primary",onClick:t[3]||(t[3]=e=>d.say())})])),_:1}),(0,l.Wm)(x,{cols:"1","align-self":"center",class:"ma-0 pa-0",style:{userSelect:"none"}},{default:(0,l.w5)((()=>[(0,l.Uk)((0,r.zw)(e.value.length),1)])),_:2},1024),(0,l.Wm)(x,{cols:"2","align-self":"center",class:"ma-0 pa-0",style:{userSelect:"none"}},{default:(0,l.w5)((()=>[(0,l.Wm)(p,{variant:"tonal",density:"compact",icon:"mdi-plus",color:"primary",onClick:t[4]||(t[4]=e=>d.say())})])),_:1})])),_:2},1024)])),_:2},1024)))),128))]),(0,l.Wm)(p,{style:{backgroundColor:"green"},class:"ma-2 px-4",color:"white",onClick:t[5]||(t[5]=e=>d.say())},{default:(0,l.w5)((()=>[(0,l.Uk)(" TEST ")])),_:1})])),_:1},8,["modelValue"]),(0,l.Wm)(w,{id:"container",class:"d-flex align-center justify-center"})])),_:1}),(0,l.Wm)(_,{ref:"stage",config:c.stageConfig},{default:(0,l.w5)((()=>[(0,l.Wm)(F,{onDragstart:d.saveCoords,onDragend:d.layerDragHandler,ref:"layer"},{default:(0,l.w5)((()=>[(0,l.Wm)(C,{config:{id:"truckWall",x:this.truck.originx,y:this.truck.originy,width:10,height:"Imperial"===this.truck.units?this.truck.dimy*this.scaleFactor:.3937*this.truck.dimy*this.scaleFactor,fill:"red"}},null,8,["config"]),(0,l.Wm)(C,{config:{id:"truckWall",x:this.truck.originx+10,y:this.truck.originy,width:"Imperial"===this.truck.units?this.truck.dimx*this.scaleFactor:.3937*this.truck.dimx*this.scaleFactor,height:10,fill:"red"}},null,8,["config"]),(0,l.Wm)(C,{config:{id:"truckWall",x:"Imperial"===this.truck.units?this.truck.originx+this.truck.dimx*this.scaleFactor+10:this.truck.originx+.3937*this.truck.dimx*this.scaleFactor+10,y:this.truck.originy,width:10,height:"Imperial"===this.truck.units?this.truck.dimy*this.scaleFactor:.3937*this.truck.dimy*this.scaleFactor,fill:"red"}},null,8,["config"]),((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(c.cargo,((e,t)=>((0,l.wg)(),(0,l.j4)(W,{key:e.id,config:{id:"cargoGroup",x:10,y:10,draggable:!0},cargoId:e.id},{default:(0,l.w5)((()=>[(0,l.Wm)(C,{config:{x:this.truck.originx,y:this.truck.originy,width:"Imperial"===e.units?Math.round(e.dimx)*this.scaleFactor:.3937*Math.round(e.dimx)*this.scaleFactor,height:"Imperial"===e.units?Math.round(e.dimy)*this.scaleFactor:.3937*Math.round(e.dimy)*this.scaleFactor,fill:"yellow",strokeWidth:1,stroke:"black"}},null,8,["config"]),(0,l.Wm)(M,{config:{x:this.truck.originx,y:this.truck.originy,text:`${e.dimx}${"Imperial"===e.units?"in":"cm"} x ${e.dimy}${"Imperial"===e.units?"in":"cm"}`,fontFamily:"Georgia",fontSize:7*this.scaleFactor,fill:"black",wrap:"none",width:"Imperial"===e.units?Math.max(50*this.scaleFactor,Math.round(e.dimx)*this.scaleFactor):Math.max(50*this.scaleFactor,.3937*Math.round(e.dimx)*this.scaleFactor),height:"Imperial"===e.units?Math.round(e.dimy)*this.scaleFactor:.3937*Math.round(e.dimy)*this.scaleFactor,align:"center",verticalAlign:"middle"}},null,8,["config"]),(0,l.Wm)(C,{onTap:i=>d.deleteCargo(e,t),onClick:i=>d.deleteCargo(e,t),onMouseover:d.mouseoverPointer,onMouseout:d.mouseoutPointer,config:{x:this.truck.originx,y:this.truck.originy,width:"Imperial"===e.units?Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor):Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor),height:"Imperial"===e.units?Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor):Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor),fillPatternImage:this.closeIcon,fillPatternScaleX:"Imperial"===e.units?Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor)/16:Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor)/16,fillPatternScaleY:"Imperial"===e.units?Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor)/16:Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor)/16}},null,8,["onTap","onClick","onMouseover","onMouseout","config"]),(0,l.Wm)(C,{onTap:i=>d.rotateCargo(e,t),onClick:i=>d.rotateCargo(e,t),onMouseover:d.mouseoverPointer,onMouseout:d.mouseoutPointer,config:{x:"Imperial"===e.units?this.truck.originx+Math.round(e.dimx)*this.scaleFactor-Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor):this.truck.originx+.3937*Math.round(e.dimx)*this.scaleFactor-Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor),y:this.truck.originy,width:"Imperial"===e.units?Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor):Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor),height:"Imperial"===e.units?Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor):Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor),fillPatternImage:this.rotateIcon,fillPatternScaleX:"Imperial"===e.units?Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor)/16:Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor)/16,fillPatternScaleY:"Imperial"===e.units?Math.max(5,.1*Math.round(e.dimx)*this.scaleFactor)/16:Math.max(5,.1*Math.round(e.dimx)*.3937*this.scaleFactor)/16}},null,8,["onTap","onClick","onMouseover","onMouseout","config"])])),_:2},1032,["cargoId"])))),128))])),_:1},8,["onDragstart","onDragend"])])),_:1},8,["config"])],64)}i(7658);var d=i(8157),u=i(4806);function m(e,t,i,o,r,s){const n=(0,l.up)("v-btn"),c=(0,l.up)("v-card-title"),d=(0,l.up)("v-select"),u=(0,l.up)("v-col"),m=(0,l.up)("v-row"),h=(0,l.up)("v-text-field"),p=(0,l.up)("v-container"),g=(0,l.up)("v-form"),f=(0,l.up)("v-spacer"),y=(0,l.up)("v-card-actions"),x=(0,l.up)("v-card"),v=(0,l.up)("v-dialog");return(0,l.wg)(),(0,l.j4)(v,{modelValue:r.dialog,"onUpdate:modelValue":t[11]||(t[11]=e=>r.dialog=e),width:o.displayWidth},{activator:(0,l.w5)((({props:e})=>["desktop"===i.mobileOrDesktop?((0,l.wg)(),(0,l.j4)(n,(0,l.dG)({key:0,"prepend-icon":"mdi-forklift",color:i.customColor,class:i.customClasses,block:i.blockStyle,variant:i.variantStyle,style:i.customStyle},e),{default:(0,l.w5)((()=>[(0,l.Uk)(" Add Cargo ")])),_:2},1040,["color","class","block","variant","style"])):((0,l.wg)(),(0,l.j4)(n,(0,l.dG)({key:1,icon:"mdi-forklift",color:i.customColor,class:"my-2",block:i.blockStyle},e),null,16,["color","block"]))])),default:(0,l.w5)((()=>[(0,l.Wm)(x,null,{default:(0,l.w5)((()=>[(0,l.Wm)(c,{class:"text-h5"},{default:(0,l.w5)((()=>[(0,l.Uk)(" Add Cargo ")])),_:1}),(0,l.Wm)(g,{ref:"addCargoForm",onSubmit:(0,a.iM)(s.onSubmit,["prevent"])},{default:(0,l.w5)((()=>[(0,l.Wm)(p,null,{default:(0,l.w5)((()=>[(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.Wm)(d,{label:"Select Metric (cm) or Imperial (in) Units",modelValue:r.selectedUnits,"onUpdate:modelValue":[t[0]||(t[0]=e=>r.selectedUnits=e),t[1]||(t[1]=e=>s.newUnitSelected())],items:r.unitChoice,"item-title":"desc","item-value":"unit","return-object":""},null,8,["modelValue","items"])])),_:1})])),_:1}),(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.Wm)(h,{modelValue:r.dimx,"onUpdate:modelValue":t[2]||(t[2]=e=>r.dimx=e),onChange:t[3]||(t[3]=e=>r.dimx=Number.parseFloat(r.dimx).toFixed(2).toString()),label:"Metric"===this.selectedUnits.unit?"Width (cm)":"Width (in)",suffix:"Metric"===this.selectedUnits.unit?"cm":"in",rules:r.dimRules,"validate-on":"input"},null,8,["modelValue","label","suffix","rules"])])),_:1}),(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.Wm)(h,{modelValue:r.dimy,"onUpdate:modelValue":t[4]||(t[4]=e=>r.dimy=e),onChange:t[5]||(t[5]=e=>r.dimy=Number.parseFloat(r.dimy).toFixed(2).toString()),label:"Metric"===this.selectedUnits.unit?"Length (cm)":"Length (in)",suffix:"Metric"===this.selectedUnits.unit?"cm":"in",rules:r.dimRules},null,8,["modelValue","label","suffix","rules"])])),_:1})])),_:1}),(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(u,null,{default:(0,l.w5)((()=>["Metric"===r.selectedUnits.unit?((0,l.wg)(),(0,l.j4)(d,{key:0,label:"Metric Pallet Sizes (centimetres)",modelValue:r.metricPallet,"onUpdate:modelValue":[t[6]||(t[6]=e=>r.metricPallet=e),t[7]||(t[7]=e=>s.newMetricPalletSelected())],items:r.metricPalletSizes,"item-title":"desc","item-value":"tuple","return-object":""},null,8,["modelValue","items"])):((0,l.wg)(),(0,l.j4)(d,{key:1,label:"Imperial Pallet Sizes (inches)",modelValue:r.imperialPallet,"onUpdate:modelValue":[t[8]||(t[8]=e=>r.imperialPallet=e),t[9]||(t[9]=e=>s.newImperialPalletSelected())],items:r.imperialPalletSizes,"item-title":"desc","item-value":"tuple","return-object":""},null,8,["modelValue","items"]))])),_:1})])),_:1})])),_:1})])),_:1},8,["onSubmit"]),(0,l.Wm)(y,null,{default:(0,l.w5)((()=>[(0,l.Wm)(f),(0,l.Wm)(n,{color:"success",onClick:s.onSubmit},{default:(0,l.w5)((()=>[(0,l.Uk)(" Submit ")])),_:1},8,["onClick"]),(0,l.Wm)(n,{color:"error",onClick:t[10]||(t[10]=e=>r.dialog=!1)},{default:(0,l.w5)((()=>[(0,l.Uk)(" Cancel ")])),_:1})])),_:1})])),_:1})])),_:1},8,["modelValue","width"])}var h={customColor:"",customClasses:"",blockStyle:!1,variantStyle:"",customStyle:"",mobileOrDesktop:"desktop",props:{customColor:String,customClasses:String,blockStyle:Boolean,variantStyle:String,customStyle:Object,mobileOrDesktop:String},setup(){const{name:e}=(0,d.AW)(),t=(0,l.Fl)((()=>{switch(e.value){case"xs":case"sm":return"100vw";case"md":case"lg":case"xl":case"xxl":return"40vw";default:return"100vw"}}));return{displayWidth:t}},data(){return{dimRules:[e=>!!e||"Dimension is required.",e=>!isNaN(e)&&!isNaN(parseFloat(e))||"Dimension must be a number."],selectedUnits:{desc:"Imperial (inches)",unit:"Imperial"},unitChoice:[{desc:"Metric (centimetres)",unit:"Metric"},{desc:"Imperial (inches)",unit:"Imperial"}],metricPallet:{desc:"EUR 1 80cm x 120cm",tuple:["80.00","120.00"]},metricPalletSizes:[{desc:"EUR 1 80cm x 120cm",tuple:["80.00","120.00"]},{desc:"EUR 2 120cm x 100cm",tuple:["120.00","100.00"]},{desc:"EUR 3 100cm x 120cm",tuple:["100.00","120.00"]},{desc:"EUR 6 80cm x 60cm",tuple:["80.00","60.00"]}],imperialPallet:{desc:'48" x 40"',tuple:["48.00","40.00"]},imperialPalletSizes:[{desc:'48" x 40"',tuple:["48.00","40.00"]},{desc:'42" x 42"',tuple:["42.00","42.00"]},{desc:'48" x 48"',tuple:["48.00","48.00"]}],dimx:"48.00",dimy:"40.00",dialog:!1}},methods:{newUnitSelected(){"Metric"===this.selectedUnits.unit?(this.dimx=this.metricPallet.tuple[0],this.dimy=this.metricPallet.tuple[1]):(this.dimx=this.imperialPallet.tuple[0],this.dimy=this.imperialPallet.tuple[1])},newMetricPalletSelected(){this.dimx=this.metricPallet.tuple[0],this.dimy=this.metricPallet.tuple[1]},newImperialPalletSelected(){this.dimx=this.imperialPallet.tuple[0],this.dimy=this.imperialPallet.tuple[1]},onSubmit(){this.$emit("cargo-added",this.selectedUnits.unit,this.dimx,this.dimy),this.$refs.addCargoForm.resetValidation(),this.dialog=!1}}},p=i(89);const g=(0,p.Z)(h,[["render",m],["__scopeId","data-v-4bf83775"]]);var f=g;function y(e,t,i,o,r,s){const n=(0,l.up)("v-btn"),c=(0,l.up)("v-card-title"),d=(0,l.up)("v-select"),u=(0,l.up)("v-col"),m=(0,l.up)("v-row"),h=(0,l.up)("v-text-field"),p=(0,l.up)("v-container"),g=(0,l.up)("v-form"),f=(0,l.up)("v-spacer"),y=(0,l.up)("v-card-actions"),x=(0,l.up)("v-card"),v=(0,l.up)("v-dialog");return(0,l.wg)(),(0,l.j4)(v,{modelValue:r.dialog,"onUpdate:modelValue":t[11]||(t[11]=e=>r.dialog=e),width:o.displayWidth},{activator:(0,l.w5)((({props:e})=>["desktop"===i.mobileOrDesktop?((0,l.wg)(),(0,l.j4)(n,(0,l.dG)({key:0,"prepend-icon":"mdi-truck-outline",color:i.customColor,class:i.customClasses,block:i.blockStyle,variant:i.variantStyle,style:i.customStyle},e),{default:(0,l.w5)((()=>[(0,l.Uk)(" Set Loading Space ")])),_:2},1040,["color","class","block","variant","style"])):((0,l.wg)(),(0,l.j4)(n,(0,l.dG)({key:1,icon:"mdi-truck-outline",color:i.customColor,class:"my-2",block:i.blockStyle},e),null,16,["color","block"]))])),default:(0,l.w5)((()=>[(0,l.Wm)(x,null,{default:(0,l.w5)((()=>[(0,l.Wm)(c,{class:"text-h5"},{default:(0,l.w5)((()=>[(0,l.Uk)(" Set Loading Space ")])),_:1}),(0,l.Wm)(g,{ref:"setTruckSizeForm",onSubmit:(0,a.iM)(s.onSubmit,["prevent"])},{default:(0,l.w5)((()=>[(0,l.Wm)(p,null,{default:(0,l.w5)((()=>[(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.Wm)(d,{label:"Select Metric (cm) or Imperial (in) Units",modelValue:r.selectedUnits,"onUpdate:modelValue":[t[0]||(t[0]=e=>r.selectedUnits=e),t[1]||(t[1]=e=>s.newUnitSelected())],items:r.unitChoice,"item-title":"desc","item-value":"unit","return-object":""},null,8,["modelValue","items"])])),_:1})])),_:1}),(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.Wm)(h,{modelValue:r.dimx,"onUpdate:modelValue":t[2]||(t[2]=e=>r.dimx=e),onChange:t[3]||(t[3]=e=>r.dimx=Number.parseFloat(r.dimx).toFixed(2).toString()),label:"Metric"===this.selectedUnits.unit?"Width (cm)":"Width (in)",suffix:"Metric"===this.selectedUnits.unit?"cm":"in",rules:r.dimRules,"validate-on":"input"},null,8,["modelValue","label","suffix","rules"])])),_:1}),(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.Wm)(h,{modelValue:r.dimy,"onUpdate:modelValue":t[4]||(t[4]=e=>r.dimy=e),onChange:t[5]||(t[5]=e=>r.dimy=Number.parseFloat(r.dimy).toFixed(2).toString()),label:"Metric"===this.selectedUnits.unit?"Length (cm)":"Length (in)",suffix:"Metric"===this.selectedUnits.unit?"cm":"in",rules:r.dimRules},null,8,["modelValue","label","suffix","rules"])])),_:1})])),_:1}),(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(u,null,{default:(0,l.w5)((()=>["Metric"===r.selectedUnits.unit?((0,l.wg)(),(0,l.j4)(d,{key:0,label:"Loading Spaces (centimetres)",modelValue:r.metricLoadingSpace,"onUpdate:modelValue":[t[6]||(t[6]=e=>r.metricLoadingSpace=e),t[7]||(t[7]=e=>s.newMetricPalletSelected())],items:r.metricLoadingSpaceSizes,"item-title":"desc","item-value":"tuple","return-object":""},null,8,["modelValue","items"])):((0,l.wg)(),(0,l.j4)(d,{key:1,label:"Loading Spaces (inches)",modelValue:r.imperialLoadingSpace,"onUpdate:modelValue":[t[8]||(t[8]=e=>r.imperialLoadingSpace=e),t[9]||(t[9]=e=>s.newImperialPalletSelected())],items:r.imperialLoadingSpaceSizes,"item-title":"desc","item-value":"tuple","return-object":""},null,8,["modelValue","items"]))])),_:1})])),_:1})])),_:1})])),_:1},8,["onSubmit"]),(0,l.Wm)(y,null,{default:(0,l.w5)((()=>[(0,l.Wm)(f),(0,l.Wm)(n,{color:"success",onClick:s.onSubmit},{default:(0,l.w5)((()=>[(0,l.Uk)(" Submit ")])),_:1},8,["onClick"]),(0,l.Wm)(n,{color:"error",onClick:t[10]||(t[10]=e=>r.dialog=!1)},{default:(0,l.w5)((()=>[(0,l.Uk)(" Cancel ")])),_:1})])),_:1})])),_:1})])),_:1},8,["modelValue","width"])}var x={customColor:"",customClasses:"",blockStyle:!1,variantStyle:"",customStyle:"",mobileOrDesktop:"desktop",props:{customColor:String,customClasses:String,blockStyle:Boolean,variantStyle:String,customStyle:Object,mobileOrDesktop:String},setup(){const{name:e}=(0,d.AW)(),t=(0,l.Fl)((()=>{switch(e.value){case"xs":case"sm":return"100vw";case"md":case"lg":case"xl":case"xxl":return"40vw";default:return"100vw"}}));return{displayWidth:t}},data(){return{dimRules:[e=>!!e||"Dimension is required.",e=>!isNaN(e)&&!isNaN(parseFloat(e))||"Dimension must be a number."],selectedUnits:{desc:"Imperial (inches)",unit:"Imperial"},unitChoice:[{desc:"Metric (centimetres)",unit:"Metric"},{desc:"Imperial (inches)",unit:"Imperial"}],metricLoadingSpace:{desc:"Box Trailer 246cm x 1350cm",tuple:["246.00","1350.00"]},metricLoadingSpaceSizes:[{desc:"Box Trailer 246cm x 1350cm",tuple:["246.00","1350.00"]},{desc:"Mega Trailer 247cm x 1360cm",tuple:["247.00","1360.00"]},{desc:"Refridgerated Trailer 249cm x 1341cm",tuple:["249.00","1341.00"]},{desc:"Single Truck Unit 250cm x 800cm",tuple:["250.00","800.00"]}],imperialLoadingSpace:{desc:'Flatbed Trailer 102" (8.5ft) x 576" (48ft)',tuple:["102.00","576.00"]},imperialLoadingSpaceSizes:[{desc:'Flatbed Trailer 102" (8.5ft) x 576" (48ft)',tuple:["102.00","576.00"]},{desc:'Flatbed Trailer 96" (8ft) x 576" (48ft)',tuple:["96.00","576.00"]},{desc:'Container Chassis 102" (8.5ft) x 240" (48ft)',tuple:["102.00","240.00"]},{desc:'Container Chassis 96" (8ft) x 240" (48ft)',tuple:["96.00","240.00"]}],dimx:"102.00",dimy:"576.00",dialog:!1}},methods:{newUnitSelected(){"Metric"===this.selectedUnits.unit?(this.dimx=this.metricLoadingSpace.tuple[0],this.dimy=this.metricLoadingSpace.tuple[1]):(this.dimx=this.imperialLoadingSpace.tuple[0],this.dimy=this.imperialLoadingSpace.tuple[1])},newMetricPalletSelected(){this.dimx=this.metricLoadingSpace.tuple[0],this.dimy=this.metricLoadingSpace.tuple[1]},newImperialPalletSelected(){this.dimx=this.imperialLoadingSpace.tuple[0],this.dimy=this.imperialLoadingSpace.tuple[1]},onSubmit(){this.$emit("load-space-set",this.selectedUnits.unit,this.dimx,this.dimy),this.$refs.setTruckSizeForm.resetValidation(),this.dialog=!1}}};const v=(0,p.Z)(x,[["render",y],["__scopeId","data-v-41d7d97d"]]);var k=v;const S=window.innerWidth,w=window.innerHeight;var b={name:"EzLoading",components:{AddDialog:f,TruckDialog:k},mounted(){this.$refs.stage.getStage().container().style.backgroundColor="#f0f0f0",this.$refs.stage.getStage().container().style.border="2px solid black",window.addEventListener("resize",this.resizeStage),this.resizeStage(),this.truck.originx=this.truckLocationX();var e=new Image;e.src="close.jpg",e.onload=()=>{this.closeIcon=e};var t=new Image;t.src="rotate.jpg",t.onload=()=>{this.rotateIcon=t}},unmounted(){window.removeEventListener("resize",this.resizeStage)},setup(){const{name:e}=(0,d.AW)(),t=(0,l.Fl)((()=>{switch(e.value){case"xs":case"sm":return"mobile";case"md":case"lg":case"xl":case"xxl":return"desktop";default:return"desktop"}}));return{displayWidth:t}},data(){return{drawer:!1,group:null,saveStartDragCoords:{x:0,y:0},dialog:!1,scaleFactor:2,stageConfig:{container:"container",width:S,height:w},truck:{units:"Imperial",originx:679,originy:10,dimx:102,dimy:576},cargo:[],closeIcon:null,rotateIcon:null}},methods:{prObj(e){return JSON.stringify(e,void 0,2)},say(){console.log(this.lowestYBound())},mouseoverPointer(){document.body.style.cursor="pointer"},mouseoutPointer(){document.body.style.cursor="default"},addCargo(e,t,i){console.log("this.cargo before add:"),console.table(this.cargo);var a=(0,u.uniqueId)("cargo-");this.cargo.push({id:a,units:e,dimx:parseFloat(t),dimy:parseFloat(i)}),console.log("this.cargo after add: "),console.table(this.cargo),this.$refs.layer.getNode().getLayer().children.length>3&&setTimeout(function(){var e=this.$refs.layer.getNode().getLayer().children.filter((e=>e.attrs.cargoId===a))[0];e.y(this.lowestYBound())}.bind(this),50)},loadSpaceSet(e,t,i){console.log("this.truck before loadSpaceSet:"),console.table(this.truck),this.truck={units:e,originx:this.truck.originx,originy:this.truck.originy,dimx:t,dimy:i},console.log("this.truck after loadSpaceSet: "),console.table(this.truck)},deleteCargo(e,t){this.cargo.splice(t,1),console.log(`deleteCargo rectangle clicked or tapped: index: ${t} id: ${e.id} dimx: ${e.dimx} dimy: ${e.dimy}`),this.mouseoutPointer()},rotateCargo(e,t){console.log(`rotateCargo rectangle clicked or tapped before: index: ${t} id: ${e.id} dimx: ${e.dimx} dimy: ${e.dimy}`);var i=this.cargo[t].dimx;this.cargo[t].dimx=this.cargo[t].dimy,this.cargo[t].dimy=i,console.log(`rotateCargo rectangle clicked or tapped after: index: ${t} id: ${e.id} dimx: ${e.dimx} dimy: ${e.dimy}`)},haveIntersection(e,t){return!(t.x>e.x+e.width||t.x+t.width<e.x||t.y>e.y+e.height||t.y+t.height<e.y)},processCollisions(e,t,i){var a="truckWall"===e.id()?e.getClientRect():e.findOne("Rect").getClientRect();e!==t&&this.haveIntersection(a,i)&&(t.x(this.saveStartDragCoords.x),t.y(this.saveStartDragCoords.y))},saveCoords(e){this.saveStartDragCoords.x=e.target.x(),this.saveStartDragCoords.y=e.target.y(),console.log(`dragstart event: event.target.findOne('Rect').getClientRect() ${JSON.stringify(e.target.findOne("Rect").getClientRect(),void 0,2)}`),console.log(`this.saveStartDragCoords.x ${this.saveStartDragCoords.x} this.saveStartDragCoords.y ${this.saveStartDragCoords.y}`)},layerDragHandler(e){var t=e.target,i=e.target.findOne("Rect").getClientRect();this.$refs.layer.getNode().getLayer().children.forEach((e=>this.processCollisions(e,t,i)))},resizeStage(){var e=this.$refs.stage.getStage(),t=document.getElementById("container").parentNode.offsetWidth;e.width(t),e.height(window.innerHeight),this.truck.originx=this.truckLocationX(),console.log("resize has occured stage width: "+e.width()+" stage height: "+e.height())},truckLocationX(){var e,t=this.$refs.stage.getStage(),i=t.width();return"Imperial"===this.truck.units?(e=this.truck.dimx*this.scaleFactor,Math.round((i-(e+20))/2)):(e=.3937*this.truck.dimx*this.scaleFactor,Math.round((i-(e+20))/2))},lowestYBound(){console.log(this.$refs.layer.getNode().getLayer().children),this.$refs.layer.getNode().getLayer().children.forEach((function(e){"cargoGroup"===e.id()&&console.log("data?: "+e.attrs.cargoId+"el.id: "+e.id()+" y value: "+e.y()+" height: "+e.findOne("Rect").getClientRect().height)}));var e=this.$refs.layer.getNode().getLayer().children,t=e.filter((e=>"cargoGroup"===e.id())),i=t.map((e=>e.y()+e.findOne("Rect").getClientRect().height));return console.log(i),Math.max(...i,0)}},computed:{generateNavDrawerList(){var e=(0,u.groupBy)(this.cargo,(e=>[e.units,e.dimx,e.dimy])),t=Object.entries(e).map((e=>[e[0].split(","),e[1]])),i=Object.entries(t).map((e=>[[e[1][0][0],parseInt(e[1][0][1]),parseInt(e[1][0][2])],e[1][1]])),a=(0,u.orderBy)(i,[e=>e[0][0],e=>e[0][1],e=>e[0][2],["asc","asc","asc"]]),l=a.map((e=>({title:`${e[0][1]}${"Imperial"===e[0][0]?"in":"cm"} x ${e[0][2]}${"Imperial"===e[0][0]?"in":"cm"}`,value:e[1]})));return l}},watch:{group(){this.drawer=!1}}};const C=(0,p.Z)(b,[["render",c],["__scopeId","data-v-9280fcfa"]]);var M=C,W={name:"App",components:{EzLoading:M}};const F=(0,p.Z)(W,[["render",o]]);var _=F,I=i(3571),U=i.n(I),L=(i(9773),i(8727)),P=i(1669),V=i(8600);const D=(0,L.Rd)({components:P,directives:V}),O=(0,a.ri)(_);O.use(U()),O.use(D),O.mount("#app")}},t={};function i(a){var l=t[a];if(void 0!==l)return l.exports;var o=t[a]={id:a,loaded:!1,exports:{}};return e[a].call(o.exports,o,o.exports,i),o.loaded=!0,o.exports}i.m=e,function(){var e=[];i.O=function(t,a,l,o){if(!a){var r=1/0;for(d=0;d<e.length;d++){a=e[d][0],l=e[d][1],o=e[d][2];for(var s=!0,n=0;n<a.length;n++)(!1&o||r>=o)&&Object.keys(i.O).every((function(e){return i.O[e](a[n])}))?a.splice(n--,1):(s=!1,o<r&&(r=o));if(s){e.splice(d--,1);var c=l();void 0!==c&&(t=c)}}return t}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[a,l,o]}}(),function(){i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,{a:t}),t}}(),function(){i.d=function(e,t){for(var a in t)i.o(t,a)&&!i.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})}}(),function(){i.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){i.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){var e={143:0};i.O.j=function(t){return 0===e[t]};var t=function(t,a){var l,o,r=a[0],s=a[1],n=a[2],c=0;if(r.some((function(t){return 0!==e[t]}))){for(l in s)i.o(s,l)&&(i.m[l]=s[l]);if(n)var d=n(i)}for(t&&t(a);c<r.length;c++)o=r[c],i.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return i.O(d)},a=self["webpackChunkezloading"]=self["webpackChunkezloading"]||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))}();var a=i.O(void 0,[998],(function(){return i(84)}));a=i.O(a)})();
//# sourceMappingURL=app.904b3708.js.map