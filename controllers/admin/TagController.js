const { error, success } = require("../../handlers");
const { Tag } = require("../../models");

const index = async (req, res) => {
  try {
    let tags = await Tag.findAll({
      order: [["id", "desc"]],
    });
    return success(res, {
      msg: "tags fetched successfully",
      data: tags,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const add = async (req, res) => {
  try {
    let payload = req.body;
    if (req.file) {
      payload["image"] = "/uploads/" + req.file?.filename;
    }
    let tag = await Tag.create(payload);
    return success(res, {
      msg: "Tag created successfully",
      data: [tag],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const update = async (req, res) => {
  try {
    let id = req.params.id;
    let payload = req.body;
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return error(res, {
        msg: "No data found!!",
      });
    }
    if (req.file) {
      payload["image"] = "/uploads/" + req.file?.filename;
    }
    await Tag.update(payload, {
      where: {
        id,
      },
    });
    return success(res, {
      msg: "Tag updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deleteTag = async (req, res) => {
  try {
    let id = req.params.id;
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return error(res, {
        msg: "No data found!!",
      });
    }
    await tag.destroy();
    return success(res, {
      msg: "Tag deleted successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

module.exports = {
  index,
  add,
  deleteTag,
  update,
};
