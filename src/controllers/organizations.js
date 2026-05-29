import { body, validationResult } from 'express-validator';

import { getAllOrganizations } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { getOrganizationById } from '../models/organizations.js';
import { createOrganization } from '../models/new-organizations.js';
import { updateOrganization } from '../models/organizations.js';

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters')
        .escape(),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters')
        .escape(),
    body('contactEmail')
        .trim()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];


const organizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const id = req.params.id;
    const organization = await getOrganizationById(id);
    const projects = await getProjectsByOrganizationId(id);

    res.render('organization', { title: organization.name, organization, projects });
};
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};


// const processNewOrganizationForm = async (req, res) => {
//     // Check for validation errors
//     const results = validationResult(req);
//     if (!results.isEmpty()) {
//         // Validation failed - loop through errors
//         results.array().forEach((error) => {
//             req.flash('error', error.msg);
//         });

//         // Redirect back to the new organization form
//         return res.redirect('/new-organization');
//     }

//     const { name, description, contactEmail } = req.body;
//     const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

//     const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
//     req.flash('success', 'Organization added successfully!');
//     res.redirect(`/organization/${organizationId}`);
// };

const processNewOrganizationForm = async (req, res) => {

    const results = validationResult(req);

    // ✅ DEBUG (tu peux l'enlever après)
    console.log("BODY:", req.body);
    console.log("ERRORS:", results.array());

    // Check for validation errors

    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        'placeholder-logo.png'
    );

    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};


const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationById(organizationId);

    res.render('edit-organization', {
        title: "Edit Organization",
        organizationDetails
    });
};

const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const { name, description, contactEmail, logoFilename } = req.body;

    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

    // Set a success flash message
    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions

export {
    organizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
};