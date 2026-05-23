import db from './db.js';

const getAllCategories = async () => {
    const query = `
    SELECT categories_id, name_categories
    FROM public.categories;
  `;

    const result = await db.query(query);
    return result.rows;
};

const getCategoryById = async (id) => {
  const sql = `  
        SELECT categories_id, name_categories
        FROM public.categories
        WHERE categories_id = $1;
    `;
  
  const result = await db.query(sql, [id]);
  return result.rows[0];
};

const getProjectsByCategory = async (categoryId) => {
  const sql = `
        SELECT p.project_id, p.title
        FROM public.project p
        JOIN project_categories ON p.project_id = project_categories.project_id
        WHERE project_categories.categories_id = $1;
    `;

  const result = await db.query(sql, [categoryId]);
  return result.rows;
};

const getCategoryByProject = async (projectId) => {
  const sql = `
        SELECT c.categories_id, c.name_categories
        FROM public.categories c
        JOIN project_categories pc ON c.categories_id = pc.categories_id
        WHERE pc.project_id = $1;
    `;

  const result = await db.query(sql, [projectId]);
  return result.rows;
};

export { getAllCategories };
export { getCategoryById };
export { getProjectsByCategory };
export { getCategoryByProject };
