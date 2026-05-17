--  Create the organization table

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
-- insert sample data into the organization table
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');
-- Create the project table with a foreign key reference to the organization table
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    location_project VARCHAR(100),
    date_project DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);
-- Insert sample data into the project table
INSERT INTO project
(organization_id, title, description, location_project, date_project)
VALUES


-- ORGANIZATION 1 (BrightFuture)
(1, 'Health Camp', 'Free medical services', 'Chicago', '2026-08-01'),
(1, 'Education Program', 'Teach children', 'Los Angeles', '2026-08-05'),
(1, 'Sports Event', 'Youth activities', 'San Diego', '2026-08-10'),
(1, 'Tech Workshop', 'Coding basics', 'San Jose', '2026-08-15'),
(1, 'Career Training', 'Job preparation', 'San Francisco', '2026-08-20');

-- ORGANIZATION 2 (GreenHarvest)
(2, 'Tree Planting', 'Plant trees in city parks', 'New York', '2026-06-01'),
(2, 'Urban Gardening', 'Community gardens', 'Boston', '2026-06-05'),
(2, 'Forest Cleanup', 'Remove waste', 'Denver', '2026-06-10'),
(2, 'Water Conservation', 'Save water awareness', 'Seattle', '2026-06-15'),
(2, 'Recycling Drive', 'Promote recycling', 'Chicago', '2026-06-20'),

-- ORGANIZATION 3 (UnityServe)
(3, 'Food Drive', 'Help families in need', 'Miami', '2026-07-01'),
(3, 'School Support', 'Provide school supplies', 'Dallas', '2026-07-05'),
(3, 'Clothing Donation', 'Donate clothes', 'Atlanta', '2026-07-10'),
(3, 'Community Cooking', 'Cook for homeless', 'Houston', '2026-07-12'),
(3, 'Elder Care', 'Assist elders', 'Phoenix', '2026-07-15'),


-- Create the categories table and the project_categories join table for the many-to-many relationship between projects and categories
CREATE TABLE categories (
  categories_id SERIAL PRIMARY KEY,
  name_categories VARCHAR(100) NOT NULL
);

CREATE TABLE project_categories (
  project_id INTEGER,
  categories_id INTEGER,

  PRIMARY KEY (project_id, categories_id),

  FOREIGN KEY (project_id)
    REFERENCES project(project_id),

  FOREIGN KEY (categories_id)
    REFERENCES categories(categories_id)
    
);
-- Insert sample data into the categories and project_categories tables
INSERT INTO categories (name_categories)
VALUES
('Environment'),
('Education'),
('Health');
-- Associate projects with categories in the project_categories table
INSERT INTO project_categories (project_id, categories_id)
VALUES
-- ORGANIZATION 1 (BrightFuture Builders)
(1, 3), -- Health Camp -> Health
(2, 2), -- Education Program -> Education
(3, 2), -- Sports Event -> Education (approximation)
(4, 2), -- Tech Workshop -> Education
(5, 2), -- Career Training -> Education

-- ORGANIZATION 2 (GreenHarvest Growers)
(6, 1), -- Tree Planting -> Environment
(7, 1), -- Urban Gardening -> Environment
(8, 1), -- Forest Cleanup -> Environment
(9, 1), -- Water Conservation -> Environment
(10, 1), -- Recycling Drive -> Environment

-- ORGANIZATION 3 (UnityServe Volunteers)
(11, 3), -- Food Drive -> Health / social support
(12, 2), -- School Support -> Education
(13, 3), -- Clothing Donation -> Social support (Health category)
(14, 3), -- Community Cooking -> Health
(15, 3); -- Elder Care -> Health
