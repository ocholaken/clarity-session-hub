CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_ai boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own AI chat history" ON public.ai_chat_history;
CREATE POLICY "Users can read their own AI chat history" ON public.ai_chat_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create their own AI chat history" ON public.ai_chat_history;
CREATE POLICY "Users can create their own AI chat history" ON public.ai_chat_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.daily_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hour_slot integer NOT NULL UNIQUE CHECK (hour_slot BETWEEN 0 AND 23),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text
);

ALTER TABLE public.daily_guides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read daily guides" ON public.daily_guides;
CREATE POLICY "Anyone can read daily guides" ON public.daily_guides FOR SELECT USING (true);

INSERT INTO public.daily_guides (hour_slot, title, content, category) VALUES
(0, 'Midnight Anxiety', 'When the day is quiet, worries can sound louder than they did earlier. Place both feet on the floor, name the worry as a thought rather than a fact, and take five slow breaths with a longer exhale.

You do not need to solve tomorrow at midnight. Write one sentence about what can wait until morning, then choose a small comfort such as water, a softer light, or a calming audio track.', 'Anxiety support'),
(1, 'Sleep Hygiene', 'A steady sleep environment helps your body recognise when it is time to rest. Keep the room cool and dim, silence avoidable notifications, and give yourself a few minutes away from bright screens before bed.

If sleep does not come, avoid turning the bed into a place of frustration. Get up for a quiet activity in low light and return when you feel drowsy.', 'Sleep wellness'),
(2, 'Night Worries', 'Night-time worries often become a long list of imagined problems. Try a brief worry note: write the concern, one thing within your control, and a time tomorrow when you will revisit it.

Then bring attention back to the present through your senses. Notice the support beneath you, the temperature of the air, and three quiet sounds around you.', 'Anxiety support'),
(3, 'Insomnia Tips', 'If you are awake and tense, stop measuring the minutes. Relax your jaw, lower your shoulders, and breathe out slowly while allowing rest to count even if sleep has not arrived yet.

Keep tomorrow gentle where possible. Consistent wake times, morning light, and a small amount of daytime movement can support your sleep rhythm over time.', 'Sleep wellness'),
(4, 'Early Morning Calm', 'Before reaching for your phone, notice one physical sensation and take three unhurried breaths. Let the first few minutes of the day be an arrival rather than an immediate demand.

Choose one kind intention for the morning, such as moving slowly, asking for help, or completing one important task before checking everything else.', 'Mindfulness'),
(5, 'Dawn Mindfulness', 'Morning light can be a gentle cue to reconnect with the present. Stand near a window or step outside and notice the colours, sounds, and temperature without needing to label the experience as good or bad.

Pair this pause with a simple stretch or warm drink. Small rituals become useful anchors when the day feels uncertain.', 'Mindfulness'),
(6, 'Morning Routine', 'A predictable morning routine reduces the number of decisions you have to make while your energy is still gathering. Consider three anchors: water or breakfast, washing and dressing, and a short movement break.

Keep the routine realistic rather than perfect. A routine that can be repeated on ordinary days is more supportive than an ambitious plan that creates pressure.', 'Daily wellbeing'),
(7, 'Breakfast Mindfulness', 'Give one part of breakfast your full attention. Notice the smell, texture, temperature, and pace of eating, and let yourself take a few breaths between bites.

This is not about eating perfectly. It is a brief practice of receiving care and noticing what your body may need for the morning ahead.', 'Mindful living'),
(8, 'Work Focus', 'Before beginning work, identify the one outcome that would make this block meaningful. Put distracting tasks in a short list and work for a manageable period before taking a real pause.

Focus is easier when your expectations are clear and humane. Progress can mean completing a small step, asking a question, or deciding what not to do today.', 'Work wellbeing'),
(9, 'Morning Anxiety Reset', 'If anxiety rises during the morning, pause before rushing to fix it. Press your feet into the floor, exhale slowly, and describe the next action in simple words: open the document, send the message, or ask for clarification.

You can feel anxious and still move carefully. Reduce the task to its smallest visible step and let that be enough for now.', 'Anxiety support'),
(10, 'Work Stress Toolkit', 'Notice whether your stress is coming from volume, uncertainty, conflict, or a lack of recovery. Naming the source helps you choose a response, such as prioritising, clarifying expectations, setting a boundary, or taking a short break.

One clear conversation can prevent hours of guessing. Ask for the information or support you need in specific, respectful language.', 'Work wellbeing'),
(11, 'Productivity Without Burnout', 'Productivity is not the same as constant output. Alternate focused effort with brief pauses to stretch, drink water, look away from the screen, or check your breathing.

At the end of a work block, write down what is done and the next starting point. This gives your mind permission to stop carrying the whole list.', 'Burnout prevention'),
(12, 'Mindful Lunch', 'Let lunch be a genuine transition rather than another task completed beside a screen. Take a few minutes to notice your food and allow your attention to move away from work.

Ask yourself what would restore you this afternoon: nourishment, quiet, connection, fresh air, or a slower pace. A short reset can protect the energy you need later.', 'Mindful living'),
(13, 'Afternoon Reset', 'The afternoon is a useful moment to check in without judgement. Notice your energy, mood, and concentration, then choose one adjustment rather than criticising yourself for needing one.

Try water, movement, a lighter task, or five minutes of quiet. Supporting your current capacity is more effective than pretending it is unchanged.', 'Daily wellbeing'),
(14, 'Energy Dip Fix', 'An energy dip does not automatically mean you are failing. Check the basics first: food, water, sleep, movement, and a chance to pause.

Choose a two-minute action that helps your body re-engage, such as walking to a window or stretching your hands and shoulders. Then return to one small task.', 'Daily wellbeing'),
(15, 'Afternoon Anxiety', 'Afternoon anxiety can be amplified by accumulated decisions and unfinished tasks. Make a quick list, circle the one item that matters most, and postpone the rest with a clear note about when you will return.

Use a slow exhale to signal a little safety to your nervous system. You do not have to complete everything to make meaningful progress today.', 'Anxiety support'),
(16, 'Evening Wind-down Prep', 'Start easing out of work before the evening begins. Close open loops by writing tomorrow’s first step, tidy only the area you need, and make one choice that marks the transition.

Your mind may need a repeated signal that the day is changing. A walk, shower, music, or a change of clothes can become that signal.', 'Evening wellbeing'),
(17, 'Commute De-stress', 'Use the journey home as a buffer rather than another place to replay the day. Notice your surroundings, loosen your grip, and breathe out a little longer than you breathe in.

When you arrive, take one minute before moving into the next responsibility. Ask what pace would help you be present for the evening.', 'Stress relief'),
(18, 'Evening Reflection', 'Reflection works best when it is curious rather than harsh. Name one thing that was difficult, one thing you managed, and one need you want to honour tonight.

There is no requirement to turn the day into a lesson. Sometimes the kindest reflection is simply recognising that you made it through a demanding day.', 'Self-compassion'),
(19, 'Dinner Mindfulness', 'Use dinner as an opportunity to reconnect with nourishment and people, even if the meal is simple. Put away one distraction and notice the pace, flavour, and company available to you.

Conversation does not need to be profound. Sharing one ordinary detail about the day can create a small sense of belonging.', 'Mindful living'),
(20, 'Digital Detox', 'A short screen break can make room for your attention to settle. Choose one device-free window, move your phone out of reach, and replace scrolling with something that uses your senses.

You do not need to disconnect perfectly. Even ten intentional minutes can remind you that rest does not have to be earned through exhaustion.', 'Digital wellbeing'),
(21, 'Journaling', 'Try a three-line journal entry: I notice..., I feel..., and I need.... Keep the writing honest and brief; the goal is to create space for awareness, not produce a polished account.

If a thought keeps repeating, write one compassionate response beside it. Speak to yourself as you would to someone you care about.', 'Reflection'),
(22, 'Gratitude Practice', 'Gratitude does not require ignoring what hurts. Notice one small thing that offered comfort, steadiness, beauty, or connection today.

Be specific: the warm mug, the message you received, or the moment the light changed. Small details can help attention recognise that difficulty is not the only part of the day.', 'Positive wellbeing'),
(23, 'Sleep Preparation', 'Give your mind a gentle runway into sleep. Dim the lights, finish stimulating tasks, and choose a quiet activity that you can stop without pressure.

Release the expectation of perfect rest. Your job tonight is to create supportive conditions and let your body do what it knows how to do.', 'Sleep wellness')
ON CONFLICT (hour_slot) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, category = EXCLUDED.category;

GRANT SELECT ON public.daily_guides TO anon, authenticated;
GRANT SELECT, INSERT ON public.ai_chat_history TO authenticated;