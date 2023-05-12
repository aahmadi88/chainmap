var osmMap = L.tileLayer.provider('OpenStreetMap.Mapnik');

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4> (Tehran:East/Region:4/Year:2000) FMCG </h4>' +  (props ?
        '<b>' + props.ProbBuyPow + '</b><br />' + props.ProbBuyPow + '  / mi<sup>2</sup>'
        : 'نشانه گر موس را بر روی نقشه منطقه نمونه حرکت دهید بر روی فروشگاه ها کلید کنید (ابتدا لایه را از ایکون بالا انتخاب کنید)');
};




var geojson;

function getColor(d) {
    return d > 0.99 ? '#800026' :
           d > 0.80  ? '#BD0026' :
           d > 0.70  ? '#E31A1C' :
           d > 0.60  ? '#FC4E2A' :
           d > 0.45   ? '#FD8D3C' :
           d > 0.35   ? '#FEB24C' :
           d > 0.0   ? '#FED976' :
                      '#FFEDA0';
}


function style(feature) {
    return {
        fillColor: getColor(feature.properties.ProbBuyPow),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}
//As an additional touch, let’s define a click listener that zooms to the state:
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.0, 0.35, 0.45, 0.60, 0.70, 0.80, 0.99],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] ) + '"></i> ' +
            grades[i] + (grades[i] ? '&ndash;' + grades[i] + '<br>' : '+');
    }

    return div;
};


geojson = L.geoJSON(soft12, {
    style: style,
    onEachFeature: onEachFeature,
}
);



function getColor2(d) {
    return d == 1 ? '#00ffff':
    d == 2  ? '#ffde00':
    d == 3 ? '#0082ff': '#0082ff';
 }

var blkjson = L.geoJSON(blk, {
    style: function(feature) {return {
        weight : 1,
        opacity : 1,
        color : 'grey',
        dashArray:'',
        fillOpacity:0.9,
        fillColor :getColor2(feature.properties.Segment2)
    };
    },
    onEachFeature: function (features, layer) {
        layer.bindPopup("ُSales Area/Segment : " + features.properties.Segment + "<br>" );

      },
}
);
// var myIcon = L.icon({
//     iconUrl : 'resources/data/icon.png',
//     iconSize :[35,35]
// })




function makePopupcontent(pnt){
    return `
        <div>
            <h4> نام فروشگاه : ${pnt.properties.Chain} </h4>
            <p> رتیه فروشگاه : ${pnt.properties.rank}</p>
        </div>
    `;
 }
 
function showPopUp(feature,layer){
    layer.bindPopup(makePopupcontent(feature),{closeButton:false, offset: L.point(0,-8)});

}

var chainIcon = L.icon({
    iconUrl: 'chain5.png',
    iconSize:     [25, 30], // size of the icon
    //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



var chainMap= L.geoJSON(chain5,{
    onEachFeature:showPopUp,
    
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:chainIcon});
    }
    });   

var B400= L.geoJSON(B400,{   
   fillOpacity: 0.0
});  
var C_B500= L.geoJSON(C_B500);  
var ProChain= L.geoJSON(ProChain);  
var DM_B500= L.geoJSON(DM2_B500);
var THR2= L.geoJSON(THR2);


var prim_roud= L.geoJSON(roud_pri);
var sec_roud= L.geoJSON(roud_secn);
var tr_roud= L.geoJSON(roud_tr);


var geojsonMarkerOptions = {
    radius: 6,
    fillColor: "#0000FF",
    //color: "#0000FF",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.2
};
var grocery = L.geoJSON(grocery,{

    //onEachFeature:showPopUp,
    pointToLayer : function (feature,latlng){
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
    });  



var overlayerMap ={
    " نسبت قدرت خرید":geojson,
 "فروشگاه های زنجیره ای":chainMap,
   "فروشگاه محلی":grocery,
   "Sale_Segment":blkjson,
   "بلوک های با دسترسی مشترک در شعاع 400 متری":B400,
  " شعاع 100 تا 500 متری متری جانبو":C_B500,
" شعاع 100 تا 500 متری دیلی مارکت":DM_B500,
  " معابر اصلی":prim_roud,
  " (معابر (دو":sec_roud,
  " (معابر (سه":tr_roud,
  "احتمال ایجاد فروشگاه جدید (دقت 80 درصد)":ProChain,

};


var baseMap = {
    //OSM : osmMap,
    تهران:THR2
};


var map = L.map('map', {
    center: [ 35.74221,51.551849],
    zoom: 15,
    layers: [osmMap,THR2]
});

//  chart

// var xmlhttp = new XMLHttpRequest();
// var url =chain3
// xmlhttp.open("GET",url,true);
// xmlhttp.send();
// xmlhttp.onreadystatechange = function(){
//     if(this.readyState == 4 && this.status ==200){
//         var data = JSON.parse(this.responseText);
//         data =data.features.map(function(elem){
//             return elem.data;
//         })
//         console.log(data)
//     }

// }



//var values = chain3.features[0].properties.rank;

var data = []; 
var labels = [];
for(let i = 0; i <23; i++) { 
    data.push(.99/([chain3.features[i].properties.rank]));
    labels.push([chain3.features[i].properties.Chain]);  

}; 
const ctx = document.getElementById('canvas');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels ,
      datasets: [{
        label: 'رتیه نسبی موقعیت فروشگاه ها  ',
        data: data,
        backgroundColor:"#ff335e",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });



  var data2 = []; 
  var labels2 = [];
  for(let i = 0; i <7; i++) { 
      data2.push([piechart[i].chain.num]);
      labels2.push([piechart[i].chain.Name]);  
  
  }; 
  const ctx2 = document.getElementById('canvas2');
  
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: labels2 ,
        datasets: [{
          label: 'رتیه نسبی موقعیت فروشگاه ها  ',
          data: data2,
          backgroundColor:[
            "#FFFF00",
            " #0041C2",
            "#ff8397",
            "#f38b4a",
            "#6970d5",
           "#00FF00",
           "#56d798",
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  


    var data3 = []; 
    var labels3 = [];
    for(let i = 0; i <7; i++) { 
        data3.push([piechart[i].chain.num]);
        labels3.push([piechart[i].chain.Name]);  
    
    }; 
    const ctx3 = document.getElementById('canvas3');
    
    new Chart(ctx3, {
        type: 'line',
        data: {
          labels: labels3 ,
          datasets: [{
            label: 'تعداد فروشگاه ها ',
            data: [7,5,2,2,4,2,1],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    
    







var layerMap =  L.control.layers(baseMap,overlayerMap).addTo(map);
info.addTo(map);
legend.addTo(map);
