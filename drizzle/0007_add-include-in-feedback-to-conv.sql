-- Custom SQL migration file, put your code below! --
ALTER TABLE conversations ADD COLUMN "include_in_feedback" boolean DEFAULT true;