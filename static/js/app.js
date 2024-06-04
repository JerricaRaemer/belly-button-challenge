// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {console.log(data);

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result_array = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = result_array[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in result) {
      panel.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result_array = samples.filter(sampleObj => sampleObj.id == sample);
    let result = result_array[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    let sample_bubble = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    
    var data = [sample_bubble];
    
    let layout = {
      title: 'Bacteria Cultures per Sample',
      margin: {t: 0},
      hovermode: 'closest',
      showlegend: false,
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      margin: {t: 30},
      height: 600,
      width: 1200
    };
   

    // Render the Bubble Chart
     Plotly.newPlot('bubble', data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(otuID => `OTU ${otuID} `);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
      let sample_bar = {
        x: sample_values.slice(0,10).reverse(),
        y: yticks.slice(0,10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      };

      let bar_data = [sample_bar];

      let bar_layout = {
        title: 'Top 10 Bacteria Cultures Found',
        margin: {t: 30},
        hovermode: 'closest',
        showlegend: false,
        xaxis: {title: 'Number of Bacteria'},
        height: 600,
        width: 600
      };

    // Render the Bar Chart
      Plotly.newPlot('bar', bar_data, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      selector
       .append("option")
       .text(name)
       .property("value", name);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
