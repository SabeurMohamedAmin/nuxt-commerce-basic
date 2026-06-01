export default defineEventHandler(async (event) => {

  const database = useDb();
  const users = await database.query.users.findMany()
  return { users }
})
