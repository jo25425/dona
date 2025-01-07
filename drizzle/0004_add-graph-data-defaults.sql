-- Custom SQL migration file, put your code below! --
ALTER TABLE graph_data
    ALTER COLUMN id SET DEFAULT gen_random_uuid(),
ALTER COLUMN created_at SET DEFAULT NOW();