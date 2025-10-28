
INSERT INTO categories (name) VALUES
  ('Web Development'),
  ('Data Science'),
  ('Cybersecurity');

INSERT INTO posts (title, content, category_id) VALUES
	('Intro to Express.js', 'Express makes building REST APIs with Node.js simple and fast.', 1),
	('Setting Up HTTPS', 'Learn how to secure your site using HTTPS and SSL.', 3),
	('Getting Started with Pandas', 'Pandas is essential for data manipulation in Python.', 2),
	('Understanding CSS Grid', 'CSS Grid is a powerful layout system available in CSS.', 1),
	('OWASP Top 10 Explained', 'A breakdown of the most common web app vulnerabilities.', 3),
	('Intro to Machine Learning', 'This post covers ML basics including supervised learning.', 2),
	('Frontend Testing Strategies', 'Explore tools like Jest and Cypress for testing UIs.', 1),
	('Data Cleaning Techniques', 'Effective data cleaning is key to reliable insights.', 2),
	('Password Hashing Best Practices', 'Never store plain text passwords. Use bcrypt or Argon2.', 3),
	('Mastering React', 'React is a powerful JavaScript library for building user interfaces.', 1);

