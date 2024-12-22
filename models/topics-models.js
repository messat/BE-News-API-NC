const db = require("../db/connection");

exports.selectAllTopics = async () => {
  const { rows: allTopics } = await db.query("SELECT * FROM topics;");
  return allTopics;
};

exports.insertNewTopic = async (slug, description) => {
  try {
    if (typeof slug == "string" || typeof description == "string") {
      const { rows: newTopic } = await db.query(
        `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
        [slug, description]
      );
      return newTopic[0];
    }
  } catch (err) {
    throw err;
  }
};
