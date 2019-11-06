$(document).ready(function()
{
  const monthNames = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  path="https://totalcloud-static.s3.amazonaws.com/intern.json";
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200)
          {
            var data = JSON.parse(httpRequest.responseText);
            var c = [];
            $.each(data, function(i, item) {
              var arr = item.start.split("/");
              var arr1 = item.end.split("/");
              var mont=arr[1].substring(1)
              var mont1=arr1[1].substring(1);
              c.push("<tr>");
              c.push("<td class='table-success'>" + item.id + "</td>");
              c.push("<td><input type='checkbox'/></td>");
              c.push("<td colspan='3'>" + item.name + "</td>");
              c.push("<td>" +arr[0]+'/'+monthNames[mont]  + "</td>");
              c.push("<td>" + arr1[0]+'/'+monthNames[mont1] + "</td>");
              c.push("</tr>");
            });
            $('#result').html(c.join(""));
          }
      }
  };
  httpRequest.open('GET', path);
  httpRequest.send();

});

/**************Begin Any Chart Script***********************/

  anychart.onDocumentReady(function () {
  // create data
  // create a data tree
    var push_data=[];
    $.getJSON( "https://totalcloud-static.s3.amazonaws.com/intern.json", function( data )
    {
      $.each(data,function(key,value)
      {
        var arr = value.start.split("/");
        var arr1 = value.end.split("/");
        var sdate=arr[1]+'/'+arr[0]+'/'+arr[2];
        var edate=arr1[1]+'/'+arr1[0]+'/'+arr1[2];
        push_data.push({'id':value.id,'name':value.name,'actualStart':sdate,'actualEnd':edate});
      });
    var treeData = anychart.data.tree(push_data, "as-table");
    // create a chart
    var chart = anychart.ganttProject();
    chart.noData().label().enabled(true);
    chart.zoomTo(951350400000, 954201600000);
    // set the data
    chart.data(treeData);
    // configure the scale
    chart.getTimeline().scale().maximum("2019-09-30");
    // set the container id
    chart.container("anychart");
    // initiate drawing the chart
    chart.draw();
    // fit elements to the width of the timeline
    chart.fitAll();
    });
  });
/**************End Any Chart Script***********************/

/**************Begin Google Chart Script***********************/
google.charts.load('current', 
{
  packages: ['timeline']
}).then(function () 
{
  // create chart
  var container = $('#chart_div').get(0);
  var chart = new google.visualization.Timeline(container);
  var options = {
    chartArea: {
      height: '100%',
      width: '100%',
      top: 60,
      left: 60,
      right: 60,
      bottom: 60
    },
    hAxis: {
      date: 'MM/dd',
      title: 'Time'
    },
    height: '100%',
    legend: {
      position: 'top'
    },
    width: '100%',
    timeline:{showRowLabels:true,groupByRowLabel:false,colorByRowLabel:true,avoidOverlappingGridLines:true}
  };

  // create data table
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'x');
  data.addColumn('date', 'Start');
  data.addColumn('date', 'End');

  // after the chart draws, wait 60 seconds, get more data
  google.visualization.events.addListener(chart, 'ready', function () {
    //window.setTimeout(getData, 60000);
  });
  getData();
  function getData() 
  {

    $.getJSON( "https://totalcloud-static.s3.amazonaws.com/intern.json", function( data )
    {
      loadData(data);
    });
  }
  function loadData(jsonData) {
    // load json data
    $.each(jsonData, function (index, row) {
    var arr = row.start.split("/");
      var arr1 = row.end.split("/");
      var sdate=arr[1]+'/'+arr[0]+'/'+arr[2];
      var edate=arr1[1]+'/'+arr1[0]+'/'+arr1[2];
      data.addRow([
        row.name,
        new Date(sdate),
        new Date(edate)
      ]);
    });
    drawChart();
  }

  $(window).resize(drawChart);
  function drawChart() {
    // draw chart
    chart.draw(data, options);
  }
});
/**************End Google Chart Script***********************/
//onclick button graph
$(document).click("#tb_graph",function()
  {
    $("#anychart_details").show();
    $("#googlechart_details").toggle();
  });