module.exports = (sequelize, DataTypes) => {
  /**
   * Products are entities that merchants preset as ready to be sold.
   *
   * @class products
   * @type {external:Model}
   * @extends {external:Model}
   * @memberof db
   * @property {number} id - Unique merchant ID
   * @property {string} name - Product UI representation
   * @property {number} merchant_id - Association to the `merchants` entity. Shows which merchants sells this product.
   * @property {number} price - How much does this product costs in USD
   * @property {string} status - Indicates if this product is available for selling. Possible values are: out_of_stock, in_stock, running_low. Default value is: out_of_stock.
   * @property {string} created_at - DateTime indicating when that product was created
   * @see {@link https://sequelize.org/master/class/lib/model.js~Model.html}
   *
   * @swagger
   * definition:
   *   DatabaseProduct:
   *     description: |
   *       `Products` are entities that `merchants` preset as ready to be sold.
   *     allOf:
   *     - type: object
   *       required:
   *       - id
   *       - name
   *       - merchant_id
   *       - price
   *       - status
   *       - created_at
   *       properties:
   *         id:
   *           type: number
   *           description: Unique merchant ID
   *           example: 34
   *         name:
   *           type: string
   *           description: Product UI representation
   *           example: Jeans
   *         merchant_id:
   *           type: number
   *           description: Association to the `merchants` entity. Shows which merchants sells this product.
   *           example: 14
   *         price:
   *           type: number
   *           description: How much does this product costs in USD
   *           example: 100.25
   *         status:
   *           type: string
   *           description: Indicates if this product is available for selling. Possible values are out_of_stock, in_stock, running_low. Default value is out_of_stock.
   *           example: in_stock
   *           default: out_of_stock
   *         created_at:
   *           type: string
   *           format: date-time
   *           readOnly: true
   *           description: DateTime indicating when that product was created
   *           example: 2020-04-30T00:00:00.000Z
   */
  const products = sequelize.define('products', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    merchant_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'merchants',
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(
          'out_of_stock',
          'in_stock',
          'running_low',
      ),
      defaultValue: 'out_of_stock',
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


  products.associate = ({merchants, order_items: orderItems}) => {
    products.belongsTo(merchants, {
      as: 'merchant',
      foreignKey: 'merchant_id',
    });

    products.hasMany(orderItems, {
      as: 'order_items',
      foreignKey: 'product_id',
    });
  };


  return products;
};
