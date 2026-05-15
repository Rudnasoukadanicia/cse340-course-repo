import db from './db.js';

const getAllProjects = async () => {
    const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.location_project,
      p.date_project,
      o.name AS organization_name
    FROM project p
    JOIN organization o
    ON p.organization_id = o.organization_id
    ORDER BY p.date_project DESC;
  `;

    const result = await db.query(query);
    return result.rows;
};

export { getAllProjects };