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
    processEditCategoryForm
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

// ✅ Create Category
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);

// ✅ Edit Category
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

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
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);


export default router;
