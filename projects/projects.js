import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

if (projectsTitle) {
  projectsTitle.textContent = `${projects.length} Projects`;
}
