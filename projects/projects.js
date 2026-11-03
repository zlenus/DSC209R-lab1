import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

if (projectsTitle) {
  projectsTitle.textContent = `${projects.length} Projects`;
}

const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
const sliceGenerator = d3.pie().sort(null);
const colors = d3.scaleOrdinal(d3.schemeTableau10);

renderProjects(projects, projectsContainer, 'h2');

let data = [1, 2, 3, 4, 5, 5];

let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

let svg = d3.select('#projects-pie-plot');

arcs.forEach((arc, idx) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(idx));
});