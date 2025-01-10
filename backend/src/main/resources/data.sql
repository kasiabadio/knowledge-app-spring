

INSERT INTO _user (account_locked, date_of_birth, enabled, created_date, last_modified_date, email,
                   first_name, last_name, password) VALUES
                    (false, null, true, '2024-12-22 20:37:00.09',
                     '2024-12-22 20:37:00.09', 'admin@mail.com', 'Admin', 'Admin', '$2a$10$tjmMmaDtQzCieU1V7ng2QuVEH.2m4cxquK2rteLDGYD60R5yq6Q7y');

INSERT INTO role (created_date, last_modified_date, name) VALUES
    ('2024-12-22 20:27:36.154666', '2024-12-22 20:27:36.154666', 'USER');

INSERT INTO role (created_date, last_modified_date, name) VALUES
                ('2024-12-22 20:27:36.154666', '2024-12-22 20:27:36.154666', 'ADMIN');

INSERT INTO role (created_date, last_modified_date, name) VALUES
                ('2024-12-22 20:27:36.154666', '2024-12-22 20:27:36.154666', 'AUTHOR');

INSERT INTO _user_roles (roles_id_role, users_id_user) VALUES (1, 1);

INSERT INTO _user_roles (roles_id_role, users_id_user) VALUES (2, 1);

INSERT INTO _user_roles (roles_id_role, users_id_user) VALUES (3, 1);

INSERT INTO category (category_name) VALUES ('swimming');

INSERT INTO category (category_name) VALUES ('sport');

INSERT INTO category (category_name) VALUES ('christmas');

INSERT INTO category (category_name) VALUES ('cooking');

INSERT INTO knowledge (id_user, is_public_knowledge, created_date, last_modified_date, content, title) VALUES
            (1, true, '2024-12-22 20:27:36.154666', '2024-12-22 20:27:36.154666',
             'Lorem ipsum', 'Title Lorem ipsum');

INSERT INTO knowledge (id_user, is_public_knowledge, created_date, last_modified_date, content, title) VALUES
    (1, true, '2024-12-22 20:27:36.154666', '2024-12-22 20:27:36.154666',
     'Super post content', 'Super post title');

INSERT INTO knowledge (id_user, is_public_knowledge, created_date, last_modified_date, content, title) VALUES
    (1, true, '2024-12-22 20:27:36.154666', '2024-12-22 20:27:36.154666',
     'Hello world', 'Hello title');