-- Custom SQL migration file, put your code below! --
ALTER TABLE conversations RENAME COLUMN "include_in_feedback" TO "focus_in_feedback";