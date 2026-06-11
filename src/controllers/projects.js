import { body, validationResult } from 'express-validator';

import {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    isUserVolunteer,
    getCategoriesByProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt()
        .withMessage('Organization must be a valid integer')
];

const projectsPage = async (req, res) => {
    const projects = await getAllProjects();

    res.render('projects', {
        title: 'Projects',
        projects
    });
};

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects
    });
};

const getSessionUserId = (req) => {
    return req.session?.user?.user_id || req.session?.user?.userId;
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProject(projectId);

    let isVolunteer = false;
    const userId = getSessionUserId(req);

    if (userId) {
        isVolunteer = await isUserVolunteer(userId, projectId);
    }

    res.render('project', {
        title: project.title,
        project,
        categories,
        isVolunteer
    });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();

    res.render('new-project', {
        title: 'Add New Service Project',
        organizations
    });
};

const processNewProjectForm = async (req, res) => {
    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    try {
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');

        return res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating project:', error);

        req.flash(
            'error',
            'There was an error creating the service project.'
        );

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

const volunteerProject = async (req, res) => {
    const userId = getSessionUserId(req);
    const projectId = req.params.id;

    if (!userId) {
        req.flash(
            'error',
            'Your session has expired. Please log in again.'
        );

        return res.redirect('/login');
    }

    await addVolunteer(userId, projectId);

    req.flash('success', 'You have joined the project.');

    res.redirect(`/project/${projectId}`);
};

const removeVolunteerProject = async (req, res) => {
    const userId = getSessionUserId(req);
    const projectId = req.params.id;

    if (!userId) {
        req.flash(
            'error',
            'Your session has expired. Please log in again.'
        );

        return res.redirect('/login');
    }

    await removeVolunteer(userId, projectId);

    req.flash('success', 'You have left the project.');

    res.redirect(`/project/${projectId}`);
};

export {
    projectValidation,
    projectsPage,
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    volunteerProject,
    removeVolunteerProject
};