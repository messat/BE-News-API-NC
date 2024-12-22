const db = require("../db/connection");
const { checkQueryExists, queryArticleId } = require("./checkExists-models");

exports.selectArticleById = async (article_id) => {
  try {
    const articleId = await db.query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.body,articles.votes,articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1 
        GROUP BY articles.article_id;`,
      [article_id]
    );
    const { rows: singleArticle } = articleId;
    if (!singleArticle.length) {
      return Promise.reject({ status: 404, msg: "404 Route Not Found" });
    }
    return singleArticle[0];
  } catch (err) {
    throw err;
  }
};

exports.selectAllArticles = async (
  topic,
  sort_by,
  order,
  arrOfKeysQuery,
  limit,
  p
) => {
  if (topic || sort_by || order || limit || p) {
    return checkQueryExists(topic, sort_by, order, arrOfKeysQuery, limit, p);
  } else {
    const { rows: allArticles } = await db.query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    );
    return allArticles;
  }
};

exports.updateVotesByArticleId = async (article_id, inc_votes) => {
  try {
    const checkArticleId = await queryArticleId(article_id);
    if (checkArticleId.length) {
      if (typeof inc_votes === "number") {
        const { rows: updateArticleVote } = await db.query(
          `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
          [inc_votes, article_id]
        );
        return updateArticleVote[0];
      } else {
        return Promise.reject({ status: 400, msg: "400 Bad Request" });
      }
    } else {
      return Promise.reject({ status: 404, msg: "404 Route Not Found" });
    }
  } catch (err) {
    throw err;
  }
};

exports.addNewArticle = async (author, title, body, topic, article_img_url) => {
  await db.query(
    `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ( $1, $2, $3,$4, $5) RETURNING *`,
    [title, topic, author, body, article_img_url]
  );
  const { rows: allArticles } = await db.query(
    "SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id"
  );
  const newArticleFinder = allArticles.filter(
    (article) => article.body === body
  );
  return newArticleFinder[0];
};

exports.deleteSingleArticle = async (article_id) => {
  try {
    const article = await queryArticleId(article_id);
    if (article.length) {
      await db.query(`DELETE FROM Comments WHERE article_id = $1`, [
        article_id,
      ]);
      await db.query(`DELETE FROM Articles WHERE article_id = $1`, [
        article_id,
      ]);
    }
  } catch (err) {
    throw err;
  }
};
