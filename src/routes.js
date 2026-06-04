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
    projectValidation
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
import { showUserRegistrationForm, processUserRegistrationForm } from './controllers/users.js';
import { showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard} from './controllers/users.js';
import { showUsersPage, requireRole} from './controllers/users.js';


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

// ✅ Assign Categories
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);


// =================
// Organizations Routes
// =================
router.get('/organizations', organizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// ✅ Create Organization
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// ✅ Edit Organization
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);


// =================
// Projects Routes
// =================
router.get('/projects', projectsPage);
router.get('/project/:id', showProjectDetailsPage);

// ✅ Create Project
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

// ✅ Edit Project
router.get('/edit-project', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

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

// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

//  route for new project page 
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project/:id', requireRole('admin'), projectValidation, processNewProjectForm);

// Route for new category page
router.get('/new-category', requireRole('admin'), showNewCategoryForm);

// Route to handle new category form submission
router.post('/new-category/:id', requireRole('admin'), categoryValidation, processNewCategoryForm);

// Route for edit organization page
router.get('/edit-organization', requireRole('admin'), showEditOrganizationForm);

// Route to handle edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Route for edit project page
router.get('/edit-project', requireRole('admin'), showEditProjectForm);

// Route to handle edit project form submission
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// route to handle edit category 
router.get('/edit-category', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// user used

router.get('/users', requireRole('admin'), showUsersPage);

export default router;
