
exports.up = function(knex) {
    return knex.schema
        .createTable('user', table => {
            table.increments()
                .primary()
            table.string('username', 128)
                .notNullable()
                .unique()
            table.string('password', 256)
                .notNullable()
        })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user')
};
