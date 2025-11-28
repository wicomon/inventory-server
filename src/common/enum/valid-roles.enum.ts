import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles{
  promotor = 'Promotor',
  supervisor = 'Supervisor',
  coordinador = 'Coordinador',
  management = 'Management',
  // merchandiser = 'Merchandiser',
  trainer = 'Trainer',
  merchandiser = 'Merchandiser',
  webMaster = 'Web Master',
  admin = 'Admin',
}

registerEnumType( ValidRoles, {name: 'ValidRoles'} )