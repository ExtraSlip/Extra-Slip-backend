const { error, success } = require("../../handlers");
const { TwitterFeed } = require("../../models");

const index = async (req, res) => {
  try {
    const twitterFeeds = await TwitterFeed.findAll({});

    return success(res, {
      msg: "Twitter Feeds fetched successfully",
      data: twitterFeeds,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const addUpdate = async (req, res) => {
  try {
    let payload = req.body;
    if (payload.id) {
      await TwitterFeed.update(payload, {
        where: {
          id: payload.id,
        },
      });
    } else {
      await TwitterFeed.create(payload);
    }

    return success(res, {
      msg: "Twitter Feed saved successfully",
      data: [],
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong",
      error: [err?.message],
    });
  }
};

const deleteTwitterFeed = async (req, res) => {
  try {
    let id = req.params.id;
    await TwitterFeed.destroy({
      where: {
        id,
      },
    });
    return success(res, {
      msg: "Twitter Feed deleted successfully",
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
  addUpdate,
  deleteTwitterFeed,
};
