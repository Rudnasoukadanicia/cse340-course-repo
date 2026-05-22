import express, { Router } from 'express';

import { indexPage } from './controllers/index.js';
import { categoriesPages } from './controllers/categories.js';
import { organizationsPage } from './controllers/organizations.js';
import { testErrorPage } from './controllers/errors.js';
import { projectsPage } from './controllers/projects.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';

import { showProjectDetailsPage } from './controllers/projects.js';

const router = express.Router();

router.get('/', indexPage);
router.get('/categories', categoriesPages);
router.get('/organizations', organizationsPage);
router.get('/test-error', testErrorPage);
router.get('/projects', projectsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);
router.get('/projects/:id', showProjectDetailsPage);
export default router;