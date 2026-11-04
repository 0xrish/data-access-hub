import postgres from 'postgres';

const sql = postgres('postgresql://postgres.jzgbuzeavovwjwxyqcjg:ZJRg0LW8328mdFtg@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres', { ssl: 'require' });

async function run() {
  // Let's check columns of auth.users
  const cols = await sql`select column_name, data_type from information_schema.columns where table_schema='auth' and table_name='users';`;
  console.log('auth.users columns:', cols.map(c => c.column_name));

  // Let's check if there's any function or config with jwt
  const funcs = await sql`select routine_name from information_schema.routines where routine_schema='auth';`;
  console.log('auth functions:', funcs.map(f => f.routine_name));

  await sql.end();
}

run().catch(console.error);
