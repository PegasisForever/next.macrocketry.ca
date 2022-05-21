export function accessOnlyAdmin({req: {user}}){
  return !!(user?.admin)
}