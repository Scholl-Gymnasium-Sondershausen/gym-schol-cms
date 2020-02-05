'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findWithKey(ctx, b) {
    // This `User` global variable will always make a reference the User model defining in your `./api/xxx/models/User.settings.json`.
    //{ name: 'john', age: { $gte: 18 }}
    const { key } = ctx.params;
    console.log(key)
    return await strapi.query( 'staticSite' ).findOne({ key: key});
  }
};
