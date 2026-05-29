import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory,
    getCategoryByProject,
    updateCategoryAssignments,
    createCategory,
    updateCategory,
    assignCategoryToProject
} from '../models/categories.js';


import { validationResult } from 'express-validator';



const categoriesPages = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const id = req.params.id;
    const category = await getCategoryById(id);
    const project = await getProjectsByCategory(id);

    res.render('category', { title: category.name_categories, category, projects: project });
}
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const categories = await getAllCategories();
    const assignedCategories = await getCategoryByProject(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};


const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'New Category' });
};

const processNewCategoryForm = async (req, res) => {
    const { name } = req.body;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        return res.redirect('/new-category');
    }

    await createCategory(name);

    res.redirect('/categories');
};

const showEditCategoryForm = async (req, res) => {
    const id = req.params.id;

    const category = await getCategoryById(id);

    res.render('edit-category', {
        title: "Edit Category",
        category
    });
};
const processEditCategoryForm = async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        return res.redirect(`/edit-category/${id}`);
    }

    await updateCategory(id, name);

    res.redirect('/categories');
};



export {
    categoriesPages,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};