const { error, success } = require("../../handlers");
const { Category } = require("../../models");

const index = async (req, res) => {
  try {
    let categories = await Category.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          as: "parentCategory",
        },
      ],
      order: [["id", "desc"]],
    });
    return success(res, {
      msg: "Categories fetched successfully",
      data: categories,
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
    console.log(payload);
    if (req.file?.path) {
      payload["image"] = req.file?.path;
    }
    let category = await Category.create(payload);
    return success(res, {
      msg: "Category created successfully",
      data: [category],
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
    console.log(payload);
    if (req.file?.path) {
      payload["image"] = req.file?.path;
    }
    const category = await Category.findByPk(id);
    if (!category) {
      return error(res, {
        msg: "No data found!!",
      });
    }
    await Category.update(payload, {
      where: {
        id,
      },
    });
    return success(res, {
      msg: "Category updated successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    let id = req.params.id;
    const category = await Category.findByPk(id);
    if (!category) {
      return error(res, {
        msg: "No data found!!",
      });
    }
    const linkedWithAnotherCategory = await Category.findAll({
      where: {
        parentCategoryId: id,
      },
    });
    if (linkedWithAnotherCategory.length > 0) {
      return error(res, {
        msg: "This category already linked with another category!!",
      });
    }
    await category.destroy();
    return success(res, {
      msg: "Category deleted successfully",
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
  update,
  deleteCategory,
};
