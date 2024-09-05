const pool = require("../../../config/db");
const moment = require("moment-timezone");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, phone, dob, created_at FROM goqii_users order by created_at desc"
    );

    return res
      .status(200)
      .json({ isError: false, data: users.rows, error: null });
  } catch (err) {
    return res.status(501).json({ isError: true, data: null, error: err });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      "SELECT id, name, email, phone, dob, created_at FROM goqii_users WHERE id = $1",
      [Number(id)]
    );

    if (user.rows.length > 0) {
      return res
        .status(200)
        .json({ isError: false, data: user.rows[0], error: null });
    } else {
      return res.status(501).json({
        isError: true,
        data: null,
        error: { message: `User does not exists!` },
      });
    }
  } catch (err) {
    return res.status(501).json({ isError: true, data: null, error: err });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, dob } = req.body;
    const localDate = moment.tz(dob, "Asia/Kolkata").format("yyyy-MM-DD");

    const userEmailExists = await pool.query(
      "SELECT id FROM goqii_users WHERE email = $1",
      [email]
    );

    const userPhoneExists = await pool.query(
      "SELECT id FROM goqii_users WHERE phone = $1",
      [phone]
    );

    if (userPhoneExists.rows.length > 0 && userEmailExists.rows.length > 0) {
      return res.status(501).json({
        isError: true,
        data: null,
        error: {
          message: `Email address and phone number are already in use!`,
        },
      });
    } else if (userEmailExists.rows.length > 0) {
      return res.status(501).json({
        isError: true,
        data: null,
        error: { message: `Email address already exists!` },
      });
    } else if (userPhoneExists.rows.length > 0) {
      return res.status(501).json({
        isError: true,
        data: null,
        error: { message: `Phone number already exists!` },
      });
    }

    await pool.query(
      "INSERT INTO goqii_users (name, email, phone, password, dob) VALUES ($1, $2, $3, $4, $5)",
      [name, email, phone, password, localDate]
    );

    return res.status(201).json({
      isError: false,
      data: { message: `User created successfully!` },
      error: null,
    });
  } catch (err) {
    return res.status(501).json({ isError: true, data: null, error: err });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query("SELECT id FROM goqii_users WHERE id = $1", [
      Number(id),
    ]);

    if (user.rows.length > 0) {
      const { name, email, phone, password, dob } = req.body;
      const localDate = moment.tz(dob, "Asia/Kolkata").format("yyyy-MM-DD");

      const userEmailExists = await pool.query(
        "SELECT id FROM goqii_users WHERE email = $1 AND id <> $2",
        [email, Number(id)]
      );

      const userPhoneExists = await pool.query(
        "SELECT id FROM goqii_users WHERE phone = $1 AND id <> $2",
        [phone, Number(id)]
      );

      if (userPhoneExists.rows.length > 0 && userEmailExists.rows.length > 0) {
        return res.status(501).json({
          isError: true,
          data: null,
          error: {
            message: `Email address and phone number are already in use!`,
          },
        });
      } else if (userEmailExists.rows.length > 0) {
        return res.status(501).json({
          isError: true,
          data: null,
          error: { message: `Email address already exists!` },
        });
      } else if (userPhoneExists.rows.length > 0) {
        return res.status(501).json({
          isError: true,
          data: null,
          error: { message: `Phone number already exists!` },
        });
      }

      await pool.query(
        "UPDATE goqii_users SET name = $1, email = $2, phone = $3, dob = $4, updated_at = $5 WHERE id = $6",
        [name, email, phone, localDate, new Date(), Number(id)]
      );

      return res.status(201).json({
        isError: false,
        data: { message: `User updated successfully!` },
        error: null,
      });
    } else {
      res.status(501).json({
        isError: true,
        data: null,
        error: { message: `User does not exists!` },
      });
    }
  } catch (err) {
    return res.status(501).json({ isError: true, data: null, error: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query("SELECT id FROM goqii_users WHERE id = $1", [
      Number(id),
    ]);

    if (user.rows.length > 0) {
      await pool.query("DELETE FROM goqii_users WHERE id = $1", [Number(id)]);

      res.status(200).json({
        isError: false,
        data: { message: `User deleted successfully!` },
        error: null,
      });
    } else {
      res.status(501).json({
        isError: true,
        data: null,
        error: { message: `User does not exists!` },
      });
    }
  } catch (err) {
    return res.status(501).json({ isError: true, data: null, error: err });
  }
};
