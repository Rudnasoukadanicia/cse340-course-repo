import { getAllOrganizations } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { getOrganizationById } from '../models/organizations.js';

const organizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Organizations';
    res.render('organizations', { title, organizations });
};

export { organizationsPage };

const showOrganizationDetailsPage = async (req, res) => {
    const id = req.params.id;
    const organization = await getOrganizationById(id);
    const projects = await getProjectsByOrganizationId(id);

    res.render('organization', { title: organization.name, organization, projects });
};

// Export any controller functions
export { showOrganizationDetailsPage };