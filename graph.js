



















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



