import { body, validationResult } from 'express-validator';

import { getAllProjects, getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
import { getCategoryByProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

export { projectValidation };

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
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    // try {
    //     // Create the new project in the database
    //     const newProjectId = await createProject(title, description, location, date, organizationId);

    //     req.flash('success', 'New service project created successfully!');
    //     res.redirect(`/project/${newProjectId}`);
    // } catch (error) {
    //     console.error('Error creating new project:', error);
    //     req.flash('error', 'There was an error creating the service project.');
    //     res.redirect('/new-project');
    // }


    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    res.render('edit-project', {
        title: 'Edit Project',
        project,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const {
        title,
        description,
        date_project,
        location_project,
        organization_id
    } = req.body;

    await updateProject(
        projectId,
        title,
        description,
        date_project,
        location_project,
        organization_id
    );

    res.redirect(`/project/${projectId}`);
};

export { processNewProjectForm };
export { showNewProjectForm };
export { showEditProjectForm };
export { processEditProjectForm };