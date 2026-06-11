import express from 'express';

const router = express.Router();

// ====================
// Controllers - Index
// ====================
import { indexPage } from './controllers/index.js';
import { testErrorPage } from './controllers/errors.js';

// =========================
// Controllers - Categories
// =========================
import {
    categoriesPages,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,

} from './controllers/categories.js';

// =======================
// Controllers - Projects
// =======================
import {
    projectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
    volunteerProject,
    removeVolunteerProject
} from './controllers/projects.js';

// ============================
// Controllers - Organizations
// ============================
import {
    organizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

// =================
// Middleware
// =================
import { categoryValidation } from './middleware/validators/categoryValidation.js';

// =================
// Controllers - Users  
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, showUsersPage, requireRole } from './controllers/users.js';


// =================
// Home
// =================
router.get('/', indexPage);

// =================
// Error Testing
// =================
router.get('/test-error', testErrorPage);

// =================
// Categories Routes
// =================
router.get('/categories', categoriesPages);
router.get('/category/:id', showCategoryDetailsPage);

// =================
// Categories Routes
// =================
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// ✅ Assign Categories
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);


// =================
// Organizations Routes
// =================
router.get('/organizations', organizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// ✅ Create Organization
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// ✅ Edit Organization
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);


// =================
// Projects Routes
// =================
router.get('/projects', projectsPage);
router.get('/project/:id', showProjectDetailsPage);

// ✅ Create Project
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// ✅ Edit Project
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// =================
// User Registration Routes
// =================
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

// Admin-only route example

// user used

router.get('/users', requireRole('admin'), showUsersPage);

// volunteer routes
router.post('/project/:id/volunteer', requireLogin, volunteerProject);
router.post('/project/:id/remove-volunteer', requireLogin, removeVolunteerProject);

export default router;
