import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dcowjhlxjzjfzazpcejs.supabase.co';
const supabaseKey = 'sb_publishable_Ab40YW0Nad4ivtZrVmtnSQ_GyoFcuIg';

export const supabase = createClient(supabaseUrl, supabaseKey);