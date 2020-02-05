'use strict';
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {sanitizeEntity} = require( 'strapi-utils' );


module.exports = {
  async getRepresentationPlan( ctx ) {
    let returnObject = await strapi.config.functions.stundenplan24()
    ctx.send( JSON.stringify( returnObject ) );

  }
};
