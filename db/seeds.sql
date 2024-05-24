use employee_db;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (id, title, salary, department_id)
VALUES
    (1, 'Sales Team Lead', 68817, 1),
    (2, 'Salesperson', 49255, 1),
    (3, 'Senior Software Engineer', 121019, 2),
    (4, 'Junior Software Engineer', 86197, 2),
    (5, 'Risk Manager', 160000, 3),
    (6, 'Junior Financial Analyst', 62000, 3),
    (7, 'Legal Team Lead', 96000, 4),
    (8, 'Lawyer', 73000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Gwyn', 'Cinder', 1, NULL),
    ('Priscilla', 'Cross', 2, 1),
    ('Andre', 'Astora', 3, NULL),
    ('Todd', 'Girsham', 4, 3),
    ('Nameless', 'King', 5, NULL),
    ('Siegward', 'Catarina', 6, 5),
    ('Sister', 'Friede', 7, NULL),
    ('Darkeater', 'Midir', 8, 7);
