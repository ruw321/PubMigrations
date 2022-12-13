import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { useWindowSize } from '@react-hook/window-size';
import { getVisualData } from '../fetcher'

export default function VisualizationPage() {
  const [data, setData] = useState(0);
  const [links, setLinks] = useState(new Map());
  const [width, height] = useWindowSize();
  var countriesList = require("countries-list")
  const contriesOnly = countriesList["countries"];
  useEffect(() => {
    getVisualData().then(res => {
      console.log(res.results);
      // process the results
      const theResult = res.results;
      let dataToWrite = {"nodes":[], "links":[]}
      let countries = new Set();
      const countinents = {"AF": 1, "AN":2, "AS":3, "EU":4, "NA":5, "SA":6};
      theResult.forEach(function (element) {
        let tempLink = {
          "source": `${contriesOnly[element.EarliestCountry]["name"]}`, "target": `${contriesOnly[element.Country2016]["name"]}`
        }
        console.log(tempLink);
        if (links.has(tempLink)) {
          links[tempLink] += 1;
        } else {
          links[tempLink] = 1;
        }
        if (!countries.has(element.EarliestCountry)) {
          dataToWrite["nodes"].push({"id": `${contriesOnly[element.EarliestCountry]["name"]}`, "group": countinents[contriesOnly[element.EarliestCountry]['continent']]});
          countries.add(element.EarliestCountry);
        }
        if (!countries.has(element.Country2016)) {
          dataToWrite["nodes"].push({"id": `${contriesOnly[element.Country2016]["name"]}`, "group": countinents[contriesOnly[element.Country2016]['continent']]});
          countries.add(element.Country2016);
        }
        dataToWrite["links"].push({"source": `${contriesOnly[element.EarliestCountry]["name"]}`, "target": `${contriesOnly[element.Country2016]["name"]}`});
      });
      // console.log(countries);
      setLinks(links);
      // var json = JSON.stringify(dataToWrite);
      // console.log(json);
    })
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
    if (!data) {
      fetch('myjsonfile.json').then(res => res.json()).then(d => {
        setData(d);
      });
    }
  }, []);

  if (data) {
    return (
      <div>
        <MenuBar />
        <body style={{height: '100%'}}>
        </body>
        <div>
          <ForceGraph3D
            graphData={data}
            width={width}
            height={height-68}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkWidth={link => links[link]}
            // nodeLabel="id" (this is what shows up when you mouse hover over the node)
            nodeAutoColorBy="group"
            nodeThreeObject={node => {
              const sprite = new SpriteText(node.id);
              sprite.color = node.color;
              sprite.textHeight = 8;
              return sprite;
            }}
            onNodeDragEnd={node => {
              node.fx = node.x;
              node.fy = node.y;
              node.fz = node.z;
            }}
          />
        </div>
      </div>
    )
  }
  return (
    <div />
  );
};