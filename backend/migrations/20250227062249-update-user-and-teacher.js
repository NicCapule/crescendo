"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("User", "user_first_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("User", "user_last_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn("Teacher", "teacher_first_name");
    await queryInterface.removeColumn("Teacher", "teacher_last_name");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("User", "user_first_name");
    await queryInterface.removeColumn("User", "user_last_name");

    await queryInterface.addColumn("Teacher", "teacher_first_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Teacher", "teacher_last_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
