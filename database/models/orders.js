module.exports = (sequelize, DataTypes) => {
  /**
   * Orders are collection of bought order items.
   *
   * @class orders
   * @type {external:Model}
   * @extends {external:Model}
   * @memberof db
   * @property {number} id - Unique order ID
   * @property {number} user_id - Association to the `users` entity. Shows which user bought this product.
   * @property {string} status - A free text field to indicate if the order is paid.
   * @property {string} created_at - DateTime indicating when that order was created
   * @see {@link https://sequelize.org/master/class/lib/model.js~Model.html}
   *
   * @swagger
   * definition:
   *   DatabaseOrder:
   *     description: |
   *       `Orders` are collection of bought `order items`.
   *     allOf:
   *     - type: object
   *       required:
   *       - id
   *       - user_id
   *       - status
   *       - created_at
   *       properties:
   *         id:
   *           type: number
   *           description: Unique order ID
   *           example: 34
   *         user_id:
   *           type: number
   *           description: Association to the `users` entity. Shows which user bought this product.
   *           example: 14
   *         status:
   *           type: string
   *           description: A free text field to indicate if the order is paid.
   *           example: in_progress
   *         created_at:
   *           type: string
   *           format: date-time
   *           readOnly: true
   *           description: DateTime indicating when that order was created
   *           example: 2020-04-30T00:00:00.000Z
   */
  const orders = sequelize.define('orders', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
      },
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
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


  orders.associate = ({users, order_items: orderItems}) => {
    orders.belongsTo(users, {
      as: 'user',
      foreignKey: 'user_id',
    });

    orders.hasMany(orderItems, {
      as: 'order_items',
      foreignKey: 'order_id',
    });
  };


  return orders;
};
