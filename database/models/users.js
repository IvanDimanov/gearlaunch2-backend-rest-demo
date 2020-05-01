module.exports = (sequelize, DataTypes) => {
  /**
   * Users are the administrators that oversee trade. Users can also sell products
   * if they have a relation to a merchant entity.
   *
   * @class users
   * @type {external:Model}
   * @extends {external:Model}
   * @memberof db
   * @property {number} id - Unique user ID
   * @property {string} full_name - User names
   * @property {number} country_code - Association to the `country` entity. Shows user country address.
   * @property {string} created_at - DateTime indicating when that user was created
   * @see {@link https://sequelize.org/master/class/lib/model.js~Model.html}
   *
   * @swagger
   * definition:
   *   DatabaseUser:
   *     description: |
   *       `Users` are the administrators that oversee trade. `Users` can also sell `products`
   *       if they have a relation to a `merchant` entity.
   *     allOf:
   *     - type: object
   *       required:
   *       - id
   *       - full_name
   *       - country_code
   *       - created_at
   *       properties:
   *         id:
   *           type: number
   *           description: Unique user ID
   *           example: 34
   *         full_name:
   *           type: string
   *           description: User names
   *           example: John Smith
   *         country_code:
   *           type: number
   *           description: Association to the country entity. Shows user country address.
   *           example: 22
   *         created_at:
   *           type: string
   *           format: date-time
   *           readOnly: true
   *           description: DateTime indicating when that user was created
   *           example: 2020-04-30T00:00:00.000Z
   */
  const users = sequelize.define('users', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'countries',
        key: 'code',
      },
    },
    created_at: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: false,
    paranoid: false,

    scopes: {},

    indexes: [],
  });


  users.associate = ({countries, merchants, orders}) => {
    users.belongsTo(countries, {
      as: 'country',
      foreignKey: 'country_code',
    });

    users.hasOne(merchants, {
      as: 'merchant',
      foreignKey: 'admin_id',
    });

    users.hasMany(orders, {
      as: 'orders',
      foreignKey: 'user_id',
    });
  };


  return users;
};
