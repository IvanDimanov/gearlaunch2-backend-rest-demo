module.exports = (sequelize, DataTypes) => {
  /**
   * Merchants are users who can sell products.
   *
   * @class merchants
   * @type {external:Model}
   * @extends {external:Model}
   * @memberof db
   * @property {string} id - Unique merchant ID
   * @property {string} merchant_name - How the user would like to be named as merchant
   * @property {string} admin_id - Association to the `users` entity. Shows which user uses this merchant entity.
   * @property {number} country_code - Association to the `country` entity. Shows user country address.
   * @property {string} created_at - DateTime indicating when that merchant was created
   * @see {@link https://sequelize.org/master/class/lib/model.js~Model.html}
   *
   * @swagger
   * definition:
   *   DatabaseMerchant:
   *     description: |
   *       `Merchants` are users who can sell `products`.
   *     allOf:
   *     - type: object
   *       required:
   *       - id
   *       - merchant_name
   *       - admin_id
   *       - country_code
   *       - created_at
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *           description: Unique merchant ID
   *           example: d628c599-6282-4e35-b05b-4a6990e678fa
   *         merchant_name:
   *           type: string
   *           description: How the user would like to be named as merchant
   *           example: Jamie Stone
   *         admin_id:
   *           type: string
   *           format: uuid
   *           description: Association to the `users` entity. Shows which user uses this merchant entity.
   *           example: d628c599-6282-4e35-b05b-4a6990e678fa
   *         country_code:
   *           type: number
   *           description: Association to the country entity. Shows user country address.
   *           example: 22
   *         created_at:
   *           type: string
   *           format: date-time
   *           readOnly: true
   *           description: DateTime indicating when that merchant was created
   *           example: 2020-04-30T00:00:00.000Z
   */
  const merchants = sequelize.define('merchants', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    merchant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
      },
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
      allowNull: false,
    },
  }, {
    timestamps: false,
    paranoid: false,

    scopes: {},

    indexes: [],
  });


  merchants.associate = ({countries, users, products}) => {
    merchants.belongsTo(countries, {
      as: 'country',
      foreignKey: 'country_code',
    });

    merchants.belongsTo(users, {
      as: 'user',
      foreignKey: 'admin_id',
    });

    merchants.hasMany(products, {
      as: 'products',
      foreignKey: 'merchant_id',
    });
  };


  return merchants;
};
