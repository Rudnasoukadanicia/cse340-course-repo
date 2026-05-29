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

const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

  await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
  // First, remove existing category assignments for the project
  const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
  await db.query(deleteQuery, [projectId]);

  // Next, add the new category assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId);
  }
};
const createCategory = async (name) => {
  const query = `
    INSERT INTO categories (name_categories)
    VALUES ($1)
    RETURNING categories_id;
  `;

  const result = await db.query(query, [name]);
  return result.rows[0];
};
const updateCategory = async (id, name) => {
  const query = `
    UPDATE categories
    SET name_categories = $1
    WHERE categories_id = $2
    RETURNING categories_id;
  `;

  const result = await db.query(query, [name, id]);

  if (result.rows.length === 0) {
    throw new Error("Category not found");
  }

  return result.rows[0];
};

export { getAllCategories };
export { getCategoryById };
export { getProjectsByCategory };
export { getCategoryByProject };
export { createCategory };
export { updateCategory };
export { assignCategoryToProject };
export { updateCategoryAssignments };
