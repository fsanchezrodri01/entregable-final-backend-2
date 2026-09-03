export class UserDTO {
  constructor(user) {
    this.id = user._id?.toString() ?? user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
  }

  static fromList(users = []) {
    return users.map(user => new UserDTO(user));
  }
}

export default UserDTO;
