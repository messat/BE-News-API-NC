const db = require("../db/connection");
const { queryArticleId, queryCommentId } = require("./checkExists-models");

exports.selectCommentsByArticleId = async (article_id, limit = 10, p) => {
  let commentQry =
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC";
  if (!isNaN(limit)) {
    commentQry += ` LIMIT ${limit}`;
  }
  if (!isNaN(p) && !isNaN(limit)) {
    p = (p - 1) * limit;
    commentQry += ` OFFSET ${p}`;
  }
  try {
    const checkArticleId = await queryArticleId(article_id);
    if (checkArticleId.length) {
      const { rows: commentsById } = await db.query(commentQry, [article_id]);
      return commentsById;
    } else {
      return Promise.reject({ status: 404, msg: "404 Route Not Found" });
    }
  } catch (err) {
    throw err;
  }
};

exports.deleteCommentById = async (comment_id) => {
  try {
    const checkCommentId = await queryCommentId(comment_id);
    if (checkCommentId.length) {
      await db.query(`DELETE FROM comments WHERE comment_id = $1`, [
        comment_id,
      ]);
    } else {
      return Promise.reject({ status: 404, msg: "404 Route Not Found" });
    }
  } catch (err) {
    throw err;
  }
};

exports.insertNewComment = async (article_id, username, body) => {
  try {
    const checkArticleId = await queryArticleId(article_id);
    if (!checkArticleId.length) {
      return Promise.reject({ status: 404, msg: "404 Route Not Found" });
    }
    const { rows: commentPost } = await db.query(
      `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`,
      [body, article_id, username]
    );
    return commentPost[0];
  } catch (err) {
    throw err;
  }
};

exports.updateComment = async (comment_id, inc_votes) => {
  if (comment_id) {
    const { rows: commentFilter } = await db.query(
      "SELECT * FROM comments WHERE comment_id = $1",
      [comment_id]
    );
    if (commentFilter.length) {
      if (typeof inc_votes === "number") {
        const { rows: updateVotes } = await db.query(
          `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
          [inc_votes, comment_id]
        );
        return updateVotes[0];
      } else {
        return Promise.reject({ status: 400, msg: "400 Bad Request" });
      }
    } else {
      return Promise.reject({ status: 404, msg: "404 Route Not Found" });
    }
  }
};
