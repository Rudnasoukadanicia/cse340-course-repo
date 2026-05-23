import { getAllCategories } from '../models/categories.js';
import { getCategoryById } from '../models/categories.js';
import { getProjectsByCategory } from '../models/categories.js';

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

export { categoriesPages };
export { showCategoryDetailsPage };