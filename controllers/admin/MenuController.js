const { Sequelize } = require("sequelize");
const { error, success } = require("../../handlers");
const { MenuList, ChildMenuList, MenuPermission } = require("../../models");




const add = async (req, res) => {
  try {
    let payload = req.body;

    let menu = await MenuList.create({
        name: payload.name,
        label: payload.label,
        menuPath: payload.menuPath || null,
        hasChild: payload.hasChild,
    });
    if(payload.hasChild){
        console.log(payload.children)
        payload.children.map(async(child) => {
            await ChildMenuList.create({
                parentId: menu.id,
                label: child.name,
                menuPath: child.menuPath,
            })
        })
    }

    return success(res, {
      msg: "Menu created successfully!!",
      data: [menu],
    });
  } catch (err) {
    return error(res, { msg: "Something went wrong!!", error: [err?.message] });
  }
};


const get = async (req, res) => {
  try {
    
    let menu = await MenuList.findAll();

    if (!menu) {
      return error(res, {
        msg: "Menu not found!!",
      });
    }
    return success(res, {
      msg: "Menu fetched successfully!!",
      data: menu,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

const getsidebar = async (req, res) => {
  try {
    let prepareMenu = []

    console.log('-=0-0as-d0a-sd', req.user.id)

    let menu = await MenuPermission.findAll({
      attributes:["menuId"],
      where:{
        userId: req.user.id
      }
    });

    await Promise.all(menu.map(async (item) => {
      let menuItem = await MenuList.findOne({
        where: {
          id: item.menuId
        },
        attributes: ['id', 'hasChild'] // Fetch only necessary attributes initially
      });
      
      // Check if menuItem exists and hasChild is false
      if (menuItem && !menuItem.hasChild) {
        // If hasChild is false, include menuPath in the attributes
        menuItem = await MenuList.findOne({
          where: {
            id: item.menuId
          },
          include: [{
            model: ChildMenuList,
            attributes: {exclude:['parentId']} // Include necessary attributes from ChildMenuList
          }]
        });
      } else {
        // If hasChild is true, do not include menuPath
        menuItem = await MenuList.findOne({
          where: {
            id: item.menuId
          },
          attributes: {exclude:['menuPath']}, // Exclude menuPath
          include: [{
            model: ChildMenuList,
            attributes: {exclude:['parentId']} // Include necessary attributes from ChildMenuList
          }]
        });
      }
      
      prepareMenu.push(menuItem);
    }));

    if (!menu) {
      return error(res, {
        msg: "Menu not found!!",
      });
    }
    return success(res, {
      msg: "Menu fetched successfully!!",
      data: prepareMenu,
    });
  } catch (err) {
    return error(res, {
      msg: "Something went wrong!!",
      error: [err?.message],
    });
  }
};

module.exports = {
  add,
  get,
  getsidebar
};