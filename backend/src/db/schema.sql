-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category_id);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    difficulty VARCHAR(20) NOT NULL,
    prompt TEXT NOT NULL,
    starter_code TEXT NOT NULL,
    solution TEXT NOT NULL,
    solution_explanation TEXT,
    tests JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_exercises_topic ON exercises(topic_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    result JSONB NOT NULL,
    feedback JSONB,
    passed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_exercise ON submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    solved_count INTEGER NOT NULL DEFAULT 0,
    total_attempts INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_topic ON progress(topic_id);

-- Streaks table
CREATE TABLE IF NOT EXISTS streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Solution views table (track when users view solutions)
CREATE TABLE IF NOT EXISTS solution_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_solution_views_user ON solution_views(user_id);
CREATE INDEX IF NOT EXISTS idx_solution_views_exercise ON solution_views(exercise_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories and topics
INSERT INTO categories (id, name, slug, description) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'JavaScript', 'javascript', 'Core JavaScript concepts and algorithms'),
    ('a0000000-0000-0000-0000-000000000002', 'React', 'react', 'React framework and ecosystem')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (category_id, name, slug, description) VALUES
    -- JavaScript topics
    ('a0000000-0000-0000-0000-000000000001', 'Variables & Data Types', 'variables', 'Variables, const, let, data types'),
    ('a0000000-0000-0000-0000-000000000001', 'Functions', 'functions', 'Function declarations, expressions, arrow functions'),
    ('a0000000-0000-0000-0000-000000000001', 'Arrays', 'arrays', 'Array methods, iteration, manipulation'),
    ('a0000000-0000-0000-0000-000000000001', 'Objects', 'objects', 'Object manipulation, methods, destructuring'),
    ('a0000000-0000-0000-0000-000000000001', 'Promises & Async', 'promises-async', 'Promises, async/await, error handling'),
    ('a0000000-0000-0000-0000-000000000001', 'DOM Manipulation', 'dom', 'DOM APIs, event handling'),
    ('a0000000-0000-0000-0000-000000000001', 'Algorithms', 'algorithms', 'Common algorithms and problem solving'),
    ('a0000000-0000-0000-0000-000000000001', 'Closures', 'closures', 'Closures and scope'),
    ('a0000000-0000-0000-0000-000000000001', 'Prototypes', 'prototypes', 'Prototypal inheritance'),

    -- React topics
    ('a0000000-0000-0000-0000-000000000002', 'JSX & Components', 'jsx-components', 'JSX syntax, component basics'),
    ('a0000000-0000-0000-0000-000000000002', 'State & Props', 'state-props', 'Component state and props'),
    ('a0000000-0000-0000-0000-000000000002', 'React Hooks', 'hooks', 'useState, useEffect, and core hooks'),
    ('a0000000-0000-0000-0000-000000000002', 'Custom Hooks', 'custom-hooks', 'Creating custom hooks'),
    ('a0000000-0000-0000-0000-000000000002', 'Context API', 'context', 'Context and global state'),
    ('a0000000-0000-0000-0000-000000000002', 'useReducer', 'use-reducer', 'Complex state with useReducer'),
    ('a0000000-0000-0000-0000-000000000002', 'Redux', 'redux', 'Redux state management'),
    ('a0000000-0000-0000-0000-000000000002', 'React Router', 'router', 'Routing and navigation'),
    ('a0000000-0000-0000-0000-000000000002', 'Performance', 'performance', 'React performance optimization')
ON CONFLICT (category_id, slug) DO NOTHING;
