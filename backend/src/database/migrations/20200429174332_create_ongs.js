
exports.up = function(knex) {
  // O que deve ser feito na criação...
  return knex.schema.createTable('ongs', function(table) {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('whatsapp').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
  });
};

exports.down = function(knex) {
  // O que deve ser feito no rollback...
  return knex.schema.dropTable('ongs');
};
