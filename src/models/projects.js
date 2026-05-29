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
  
const createProject = async (title, description, location, date, organizationId) => {
  const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (
  projectId,
  title,
  description,
  date_project,
  location_project,
  organization_id
) => {
  const query = `
    UPDATE project
    SET 
      title = $1,
      description = $2,
      date_project = $3,
      location_project = $4,
      organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const result = await db.query(query, [
    title,
    description,
    date_project,
    location_project,
    organization_id,
    projectId
  ]);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  return result.rows[0];
};

export { createProject };
export { updateProject };
