import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({
    unique: false,
    allowNull: false,
  })
  name: string;

  @Column({
    unique: true,
    allowNull: true,
    // defaultValue: null,
  })
  email: string;

  @Column({
    unique: true,
    allowNull: true,
    // defaultValue: null,
  })
  phone: string;

  @Column({
    unique: false,
    allowNull: false,
  })
  password: string;
}
