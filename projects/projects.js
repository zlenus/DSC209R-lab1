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
const sliceGenerator = d3.pie().value((d) => d.value).sort(null);const colors = d3.scaleOrdinal(d3.schemeTableau10);

let query = '';
let selectedYear = null;

function filterByQuery(list) {
  const q = query.toLowerCase();
  return list.filter((project) => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(q);
  });
}

function renderPieChart(projectsGiven) {
  const rolledData = d3.rollups(projectsGiven, (v) => v.length, (d) => d.year);
  const data = rolledData
    .map(([year, count]) => ({ value: count, label: year }))
    .sort((a, b) => d3.descending(a.label, b.label));

  const arcData = sliceGenerator(data);
  const arcs = arcData.map((d) => arcGenerator(d));

  const svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();
  const legend = d3.select('.legend');
  legend.selectAll('li').remove();

  arcs.forEach((arc, i) => {
    const d = data[i];
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(d.label))
      .attr('class', d.label === selectedYear ? 'selected' : null)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', `${d.label}: ${d.value} project${d.value === 1 ? '' : 's'}`)
      .attr('aria-pressed', d.label === selectedYear)
      .on('click', () => toggleYear(d.label))
      .on('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleYear(d.label);
        }
      });
  });

  data.forEach((d) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(d.label)}`)
      .attr('class', d.label === selectedYear ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => toggleYear(d.label));
  });
}

function toggleYear(year) {
  selectedYear = selectedYear === year ? null : year;
  update();
}

function filterByYear(list) {
  if (selectedYear === null) return list;
  return list.filter((project) => project.year === selectedYear);
}

function update() {
  const queryFiltered = filterByQuery(projects);

  if (selectedYear !== null && !queryFiltered.some((p) => p.year === selectedYear)) {
    selectedYear = null;
  }

  renderProjects(filterByYear(queryFiltered), projectsContainer, 'h2');
  renderPieChart(queryFiltered);
}

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  update();
});

update();