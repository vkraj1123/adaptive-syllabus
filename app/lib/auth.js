// Demo/local authentication layer. For production, replace with server-side hashed passwords and sessions.
export const USERS = [
  {id:"vk",name:"Vk",password:"000000"},
  {id:"demo",name:"Demo User",password:"01012000"}
];
export function authenticate(userId,password){const u=USERS.find(x=>x.id===userId);return u&&u.password===String(password)?u:null;}
