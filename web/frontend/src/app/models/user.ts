export interface User {
  idUser: number,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  email: string,
  password: string,
  accountLocked: boolean,
  enabled: boolean,
  createdDate: Date,
  lastModifiedDate: Date,
  roles: any[],
  comments: any[],
  knowledges: any[]
  }
