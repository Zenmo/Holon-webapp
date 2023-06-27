-- script to demote all users in production
-- the purpose is to prevent accidental edits in the CMS
-- which might invalidate the scenario cache or break something
UPDATE customuser_user SET is_superuser = FALSE WHERE TRUE;
DELETE FROM customuser_user_groups WHERE TRUE;
-- make everyone editor without publish permission
INSERT INTO customuser_user_groups (user_id, group_id)
	SELECT id, 2 FROM customuser_user;
