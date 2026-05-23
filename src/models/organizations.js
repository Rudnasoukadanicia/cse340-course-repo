import db from './db.js';

const getAllOrganizations = async () => {
  const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getOrganizationById = async (id) => {
  const sql = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        WHERE organization_id = $1
    `;

  const result = await db.query(sql, [id]);
  return result.rows[0];
};

export { getAllOrganizations }
export { getOrganizationById };
