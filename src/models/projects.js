import db from './db.js';

const getAllProjects = async () => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.location_project,
      p.date_project,
      p.organization_id,
      o.name AS organization_name
    FROM project p
    JOIN organization o
    ON p.organization_id = o.organization_id
    ORDER BY p.date_project DESC;
  `;

  const result = await db.query(query);
  return result.rows;
};

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

const createProject = async (title, description, location_project, date_project, organizationId) => {
  const query = `
      INSERT INTO project (title, description, location_project, date_project, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location_project, date_project, organizationId];
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

const addVolunteer = async (userId, projectId) => {
  const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
  await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
  const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
  await db.query(query, [userId, projectId]);
};

const getUserVolunteerProjects = async (userId) => {
  const query = `
        SELECT p.project_id, p.title
        FROM project p
        JOIN volunteer v ON p.project_id = v.project_id
        WHERE v.user_id = $1;
    `;

  const result = await db.query(query, [userId]);
  return result.rows;
};

const isUserVolunteer = async (userId, projectId) => {
  const query = `
        SELECT * FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

  const result = await db.query(query, [userId, projectId]);
  return result.rows.length > 0;
};

const getCategoriesByProject = async (projectId) => {
  const query = `
        SELECT c.categories_id, c.name_categories
        FROM categories c
        JOIN project_categories pc ON c.categories_id = pc.categories_id
        WHERE pc.project_id = $1;
    `;

  const result = await db.query(query, [projectId]);
  return result.rows;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
  addVolunteer,
  removeVolunteer,
  getUserVolunteerProjects,
  isUserVolunteer,
  getCategoriesByProject
};
