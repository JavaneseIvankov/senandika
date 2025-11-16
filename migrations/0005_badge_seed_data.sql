-- Badge Seed Data Migration
-- Inserts predefined badges for gamification system

-- Milestone Badges (Session-based)
INSERT INTO badge (code, name, description, icon) VALUES
  ('first_step', 'First Step', 'Completed your first reflection session', '🌱'),
  ('getting_started', 'Getting Started', 'Completed 5 reflection sessions', '🌿'),
  ('journaling_habit', 'Journaling Habit', 'Completed 10 reflection sessions', '🌳'),
  ('reflection_pro', 'Reflection Pro', 'Completed 50 reflection sessions', '🏆'),
  ('master_reflector', 'Master Reflector', 'Completed 100 reflection sessions', '👑');

-- Milestone Badges (Message-based)
INSERT INTO badge (code, name, description, icon) VALUES
  ('chatty', 'Chatty', 'Sent 50 messages', '💬'),
  ('conversationalist', 'Conversationalist', 'Sent 200 messages', '🗣️'),
  ('storyteller', 'Storyteller', 'Sent 500 messages', '📖');

-- Streak Badges
INSERT INTO badge (code, name, description, icon) VALUES
  ('consistent_starter', 'Consistent Starter', 'Maintained a 3-day streak', '🔥'),
  ('week_warrior', 'Week Warrior', 'Maintained a 7-day streak', '⚔️'),
  ('fortnight_fighter', 'Fortnight Fighter', 'Maintained a 14-day streak', '🛡️'),
  ('monthly_master', 'Monthly Master', 'Maintained a 30-day streak', '💪'),
  ('centurion', 'Centurion', 'Maintained a 100-day streak', '🏅'),
  ('year_champion', 'Year Champion', 'Maintained a 365-day streak', '🥇');

-- Time Pattern Badges
INSERT INTO badge (code, name, description, icon) VALUES
  ('night_owl', 'Night Owl', 'Completed 10 late-night sessions (22:00-02:00)', '🦉'),
  ('early_bird', 'Early Bird', 'Completed 10 early morning sessions (05:00-08:00)', '🐦'),
  ('weekend_warrior', 'Weekend Warrior', 'Completed 5 weekend sessions', '🎯');

-- Emotional Growth Badges
INSERT INTO badge (code, name, description, icon) VALUES
  ('stress_manager', 'Stress Manager', 'Completed 10 high-stress sessions successfully', '🧘'),
  ('emotion_explorer', 'Emotion Explorer', 'Tracked 15 unique emotions', '🎭'),
  ('calm_seeker', 'Calm Seeker', 'Maintained low stress levels in 5 consecutive sessions', '☮️');

-- Special Achievement Badges
INSERT INTO badge (code, name, description, icon) VALUES
  ('breakthrough_moment', 'Breakthrough Moment', 'Showed significant stress improvement over time', '✨'),
  ('deep_thinker', 'Deep Thinker', 'Averaged more than 15 messages per session', '🧠'),
  ('action_oriented', 'Action Oriented', 'Completed suggested actions from 10 sessions', '🎯');

-- Add more special badges
INSERT INTO badge (code, name, description, icon) VALUES
  ('morning_person', 'Morning Person', 'Completed 20 morning sessions', '☀️'),
  ('night_thinker', 'Night Thinker', 'Completed 20 night sessions', '🌙'),
  ('weekend_champion', 'Weekend Champion', 'Completed 15 weekend sessions', '🏆'),
  ('stress_warrior', 'Stress Warrior', 'Successfully handled 25 high-stress sessions', '⚡'),
  ('emotion_master', 'Emotion Master', 'Tracked 25 unique emotions', '🌈'),
  ('consistency_king', 'Consistency King', 'Maintained longest streak of 50+ days', '👑');
