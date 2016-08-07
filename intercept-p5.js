var shadowDOMElement;
var canvasLocation ='';

//for object in setpu (??)


funcNames = refData["classitems"].map(function(x){
  return {
    name: x["name"],
    params: x["params"],
    class: x["class"],
    module: x["module"],
    submodule: x["submodule"]
  };
});

funcNames = funcNames.filter(function(x) {
  let className = x["class"];
  return (x["name"] && x["params"] && (className==='p5'));
})


funcNames.forEach(function(x){
  var originalFunc = p5.prototype[x.name];
  p5.prototype[x.name] = function(){
    orgArg = arguments;
    if(!shadowDOMElement){
      Interceptor.createShadowDOMElement();
    }

    if(frameCount == 0) { //for setup
      Interceptor.setupObject = Interceptor.populateObject(x,arguments, Interceptor.setupObject,  document.getElementById('shadowDOM-content-details'),false);
    }

    else if(frameCount%100 == 0 ) {
      Interceptor.drawObject = Interceptor.populateObject(x,arguments, Interceptor.drawObject, document.getElementById('shadowDOM-content-details'),true);
    }
    //reset some of the variables
    else if(frameCount%100 == 1 ) {
      if(Interceptor.drawObject.objectCount>0){
        var table = document.getElementById('shadowDOM-content-details');
        table.innerHTML = '';
        Interceptor.populateTable(table,Interceptor.setupObject);
        Interceptor.populateTable(table,Interceptor.drawObject);
      }
      Interceptor.getSummary(Interceptor.setupObject,Interceptor.drawObject,document.getElementById('shadowDOM-content-summary'));
      Interceptor.drawObject = Interceptor.clearVariables(Interceptor.drawObject);
    }
    return originalFunc.apply(this,arguments);
  }
});

/*** PSUEDO CODE

* Run @fc = 0
* make a list of all the objects/shapes that are present - make a list of the objects using data.json
* check if the same ones are present in fc=1 ??
* and update the content

*Caveats
- if there is already a circle, we can actually update the values on the same one if there is the SAME number of circles.
-else we can update the SAME ones and add the rest

links
- Color converter -   http://chir.ag/projects/ntc/
***/
