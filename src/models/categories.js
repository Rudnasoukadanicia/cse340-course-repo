import db from './db.js';

const getAllCategories = async () => {
    const query = `
    SELECT categories_id, name_categories
    FROM public.categories;
  `;

    const result = await db.query(query);
    return result.rows;
};

export { getAllCategories };