import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { useWindowSize } from '@react-hook/window-size';
import { getVisualData } from '../fetcher';
import { Spin } from 'antd'

export default function VisualizationPage() {
  const [data, setData] = useState(0);
  const [links, setLinks] = useState({});
  const [width, height] = useWindowSize();
  let countriesList = require("countries-list")
  const contriesOnly = countriesList["countries"];

  useEffect(() => {
    getVisualData().then(res => {
      // console.log(res.results);
      // process the results
      const theResult = res.results;
      let dataToWrite = {"nodes":[], "links":[]}
      let countries = new Set();
      const countinents = {"AF": 1, "AN":2, "AS":3, "EU":4, "NA":5, "SA":6};
      theResult.forEach(function (element) {
        let linkObject = {
          "source": `${contriesOnly[element.EarliestCountry]["name"]}`, "target": `${contriesOnly[element.Country2016]["name"]}`
        }
        let tempLink = JSON.stringify(linkObject);
        if (links[tempLink]) {
          links[tempLink] = links[tempLink]+1;
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
      // console.log(links);
      setLinks(links);
      setData(data);
      // console.log(links);
      // var json = JSON.stringify(dataToWrite);
      // console.log(json);
    })
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
  }, []);

  if (!data) {
    fetch('myjsonfile.json').then(res => res.json()).then(d => {
      setData(d);
    });
  }

  if (data && links) {
    return (
      <div>
        <MenuBar />
        <div>
          <ForceGraph3D
            graphData={data}
            width={width}
            height={height-68}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}

            //linkWidth={link => links[JSON.stringify({"source": `${link["source"]}`, "target": `${link["target"]}`})]}
            linkThreeObjectExtend={true}
            linkThreeObject={link => {
              // extend link with text sprite
              const str = links[JSON.stringify({"source": `${link["source"]}`, "target": `${link["target"]}`})];
              const sprite = new SpriteText(str);
              sprite.color = 'white';
              sprite.textHeight = 4;
              return sprite;
            }}

            // calculates the position of the link text
            linkPositionUpdate={(sprite, { start, end }) => {
              const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
                [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
              })));
  
              // Position sprite
              Object.assign(sprite.position, middlePos);
            }}
            linkColor = {() => 'white'}
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
    <div>
      <MenuBar />
      <Spin size="large" />
    </div>
  );
};