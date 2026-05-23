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
  const result = await db.query(query, [organizationId]);

  return result.rows;
};

export { getProjectsByOrganizationId };

const getUpcomingProjects = async (limit) => {
  const sql = `
        SELECT p.project_id, p.title, p.description, p.date_project, p.location_project,
               p.organization_id, o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date_project >= CURRENT_DATE
        ORDER BY p.date_project ASC
        LIMIT $1;
    `;

  const result = await db.query(sql, [limit]);
  return result.rows;
};

export { getUpcomingProjects };
  
const getProjectDetails = async (id) => {
  const sql = `
        SELECT p.project_id, p.title, p.description, p.date_project, p.location_project,
               p.organization_id, o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;

  const result = await db.query(sql, [id]);
  return result.rows[0];
};

export { getProjectDetails };
