import { Knowledge } from './knowledge';

export interface UserDto {
  firstName: string,
  lastName: string,
  email: string,
  accountLocked: boolean,
  enabled: boolean,
  roles: any[],
  comments: any[],
  knowledges: Knowledge[]
  }
