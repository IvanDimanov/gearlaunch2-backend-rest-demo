module.exports = (sequelize, DataTypes) => {
  /**
   * Order items are the collection of all bought products in a specific order.
   *
   * @class order_items
   * @type {external:Model}
   * @extends {external:Model}
   * @memberof db
   * @property {number} id - Unique order item ID
   * @property {number} product_id - Association to the `products` entity. Shows which product was bought.
   * @property {number} order_id - Association to the `orders` entity. Shows which order bought the related product.
   * @property {number} quantity - Shows how much of the product was bought.
   * @see {@link https://sequelize.org/master/class/lib/model.js~Model.html}
   *
   * @swagger
   * definition:
   *   DatabaseOrderItem:
   *     description: |
   *       `Order` items are the collection of all bought `products` in a specific `order`.
   *     allOf:
   *     - type: object
   *       required:
   *       - id
   *       - product_id
   *       - order_id
   *       - quantity
   *       properties:
   *         id:
   *           type: number
   *           description: Unique order item ID
   *           example: 34
   *         product_id:
   *           type: number
   *           description: Association to the `products` entity. Shows which product was bought.
   *           example: 100
   *         order_id:
   *           type: number
   *           description: Association to the `orders` entity. Shows which order bought the related product.
   *           example: 200
   *         quantity:
   *           type: number
   *           description: Shows how much of the product was bought.
   *           example: 5
   */
  const orderItems = sequelize.define('order_items', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
      },
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
      },
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
    paranoid: false,

    scopes: {},

    indexes: [],
  });


  orderItems.associate = ({orders, products}) => {
    orderItems.belongsTo(orders, {
      as: 'order',
      foreignKey: 'order_id',
    });

    orderItems.belongsTo(products, {
      as: 'product',
      foreignKey: 'product_id',
    });
  };


  return orderItems;
};
