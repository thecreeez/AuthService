import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class Util {
  static generateToken() {
    return uuidv4();
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, "$2b$10$V0NQ4jN4tCgcT88PCDW9uO");
  }
}

export default Util;