// SUPABASE_URL + SUPABASE_SERVICE_KEY bo'lsa haqiqiy baza, bo'lmasa xotiradagi (lokal sinov) baza
import memory from './memory.js';
import supabase from './supabase.js';

const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
console.log(`Baza: ${useSupabase ? 'Supabase' : "xotira (ma'lumotlar server o'chganda yo'qoladi)"}`);

export default useSupabase ? supabase : memory;
