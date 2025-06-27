CREATE DATABASE notes_app;
USE notes_app;

CREATE TABLE notes (
	id integer PRIMAY KEY AUTO_INCREMENT,
	title varchar(255) NOT NULL,
	contents TEXT NOT NULL,
	created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO notes (title, contents) VALUES
('First Note', 'This is the contents of the first note.'),
('Second Note', 'This is the contents of the second note.'),
('Third Note', 'This is the contents of the third note.'),
('Fourth Note', 'This is the contents of the fourth note.'),
('Fifth Note', 'This is the contents of the fifth note.');