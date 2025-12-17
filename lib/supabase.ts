import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmgyanogbyzslfzpqmei.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtZ3lhbm9nYnl6c2xmenBxbWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTQ4MjQsImV4cCI6MjA2Nzc3MDgyNH0.czHsY-rIV0WnPJ1eYXIi1CXey_BRCt5vvP5FzBqyCnc';

export const supabase = createClient(supabaseUrl, supabaseKey);
