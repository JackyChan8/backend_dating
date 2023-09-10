import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

export async function checkPassword(
  password: string,
  confirmPass: string,
  hash: string,
): Promise<boolean> {
  console.log('checkPassword: ', password, confirmPass, hash);
  // Checking the same passwords
  if (password === confirmPass) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
  return false;
}
