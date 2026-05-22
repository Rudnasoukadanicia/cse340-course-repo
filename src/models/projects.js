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

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location_project,
          date_project
        FROM project
        WHERE organization_id = $1
        ORDER BY date_project DESC;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

export { getProjectsByOrganizationId };

const getUpcomingProjects = async (limit) => {
  const sql = `
        SELECT p.project_id, p.title, p.description, p.date_project, p.location_project,
               p.organization_id, o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT ?
    `;

  const [rows] = await pool.execute(sql, [limit]);
  return rows;
};

export { getUpcomingProjects };
  
const getProjectDetails = async (id) => {
  const sql = `
        SELECT p.project_id, p.title, p.description, p.date_project, p.location_project,
               p.organization_id, o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_id = ?
    `;

  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

export { getProjectDetails };
