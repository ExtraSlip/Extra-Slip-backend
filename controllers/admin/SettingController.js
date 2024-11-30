const { Op } = require("sequelize");
const { Settings, POSTURL } = require("../../constants/Constants");
const { error, success } = require("../../handlers");
const { Setting } = require("../../models");

const index = async (req, res) => {
  try {
    let query = {};
    let { keys } = req.query;
    if (keys) {
      query["key"] = {
        [Op.in]: keys.split(","),
      };
    }
    let settings = await Setting.findAll({
      where: query,
    });
    return success(res, {
      msg: "Settings fetched successfully",
      data: settings,
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
    let settings = [];
    payload.settings = JSON.parse(payload.settings);
    let allowedSettingsKeys = Object.values(Settings);
    console.log({ settings: payload.settings });
    let invalidKeys = "",
      invalidPostUrl;
    payload?.settings?.map((element) => {
      if (!allowedSettingsKeys.includes(element.key)) {
        invalidKeys += ", " + element.key;
      }
      if (element.key == Settings.POSTURL) {
        if (!Object.values(POSTURL).includes(element.value)) {
          invalidPostUrl =
            "Invalid post url key value allowed values are " +
            Object.values(POSTURL).join(", ");
        }
      }
    });
    if (invalidKeys || invalidPostUrl) {
      return error(res, {
        msg: invalidKeys ? "Invalid keys are " + invalidKeys : invalidPostUrl,
        error: [invalidKeys || invalidPostUrl],
      });
    }
    let alreadyExistsSettings = await Setting.findAll({ raw: true });
    let existingKeyValues = alreadyExistsSettings.reduce(
      (acc, setting, index) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {}
    );

    await Promise.all(
      payload?.settings?.map(async (element) => {
        if (element.key == Settings.SITEICON && req.files?.["siteIcon"]) {
          element.value = req.files["siteIcon"][0].path;
        }
        if (element.value) {
          if (existingKeyValues[element.key]) {
            await Setting.update(
              { value: element.value },
              { where: { key: element.key } }
            );
          } else {
            settings.push(element);
          }
        }
      })
    );
    if (settings.length > 0) {
      await Setting.bulkCreate(settings);
    }
    return success(res, {
      msg: "Setting created successfully",
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
};
