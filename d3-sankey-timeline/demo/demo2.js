/* global d3, sankeyTimeline */

const timeline = new sankeyTimeline.SankeyTimeline();
const margin = 100;
const range = [margin, window.innerWidth - margin];
const renderer = new sankeyTimeline.Renderer(timeline);
renderer.options.margin = margin;
renderer.options.width = window.innerWidth;
renderer.options.height = 700;
renderer.options.dynamicNodeHeight = true;
renderer.options.layout = 0;

let v0;
let v1;
let v2;
let v3;
let v4;
let v5;
const steps = [
  () => {
    v0 = timeline.createNode('v0', { endTime: 2, startTime: 0 });
  },
  () => {
    v1 = timeline.createNode('v1', { endTime: 4, startTime: 2 });
  },
  () => {
    timeline.createLink(v0, v1, 12);
  },
  () => {
    v2 = timeline.createNode('v2', { endTime: 8, startTime: 4 });
  },
  () => {
    timeline.createLink(v1, v2, 10);
  },
  () => {
    v3 = timeline.createNode('v3', { endTime: 5, startTime: 3 });
  },
  () => {
    timeline.createLink(v1, v3, 30);
  },
  () => {
    v4 = timeline.createNode('v4', { endTime: 12, meanTime: 8, startTime: 6, stdDeviation: 2 });
  },
  () => {
    timeline.createLink(v2, v4, 4);
  },
  () => {
    timeline.createLink(v3, v2, 1);
  },
  () => {
    // timeline.createLink(v4, v0, 12);
  },
  () => {
    v5 = timeline.createNode('v5', { endTime: 13, startTime: 11 });
  },
  () => {
    timeline.createLink(v2, v5, 3);
  },
  () => {
    timeline.createLink(v5, v5, 2);
  },
  () => {
    timeline.createLink(v5, v3, 4);
  },
];

const svg = d3.select('svg');
const animated = false;
const stepTime = 1000;
const maxStep = steps.length - 1;
if (animated) {
  steps[0]();
  let currentStep = 1;
  renderer.render();
  const interval = setInterval(() => {
    console.log(`Step ${currentStep}`);
    steps[currentStep]();
    d3.selectAll('svg > *').remove();
    renderer.render(svg);
    if (currentStep === maxStep) {
      clearInterval(interval);
    }
    currentStep += 1;
  }, stepTime);
} else {
  for (let currentStep = 0; currentStep < maxStep; currentStep += 1) {
    steps[currentStep]();
  }
  renderer.render(svg);
}
