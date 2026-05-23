import { getAllProjects } from '../models/projects.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';
import { getCategoryByProject } from '../models/categories.js';

const projectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Projects';
    res.render('projects', { title, projects })
};

export { projectsPage };

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', {
        title: "Upcoming Service Projects",
        projects
    });
};

export { showProjectsPage };

const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;

    const project = await getProjectDetails(id);
    const categories = await getCategoryByProject(id);
    res.render('project', {
        title: project.title,
        project,
        categories
    });
};
export {
    showProjectDetailsPage
};
