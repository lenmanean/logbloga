-- Remove difficulty column from products table
-- Safe to remove as there are no active users and database is clean
-- Difficulty is now represented by level structure (Level 1 = Beginner, Level 2 = Intermediate, Level 3 = Advanced)

ALTER TABLE products DROP COLUMN IF EXISTS difficulty;
