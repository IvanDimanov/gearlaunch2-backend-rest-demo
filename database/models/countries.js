module.exports = (sequelize, DataTypes) => {
  /**
   * List of all countries that can be related to other entities such as users and merchants.
   *
   * @class countries
   * @type {external:Model}
   * @extends {external:Model}
   * @memberof db
   * @property {number} code - Unique country ID
   * @property {string} name - country name
   * @property {string} continent_name - On which continent this country is located
   * @see {@link https://sequelize.org/master/class/lib/model.js~Model.html}
   *
   * @swagger
   * definition:
   *   DatabaseCountry:
   *     description: |
   *       List of all `countries` that can be related to other entities such as `users` and `merchants`.
   *     allOf:
   *     - type: object
   *       required:
   *       - code
   *       - name
   *       - continent_name
   *       properties:
   *         code:
   *           type: number
   *           description: Unique country ID
   *           example: 34
   *         name:
   *           type: string
   *           description: country name
   *           example: Vanuatu
   *         continent_name:
   *           type: string
   *           description: On which continent this country is located
   *           example: Africa
   */
  const countries = sequelize.define('countries', {
    code: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    continent_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    paranoid: false,

    scopes: {},

    indexes: [
      {
        fields: ['code'],
        unique: true,
      },
      {
        fields: ['name'],
        unique: true,
      },
    ],
  });

  return countries;
};
