const { MenuList, ChildMenuList, MenuPermission } = require("../models");

const menuJson = [
  {
    name: "Dashboard",
    hasChild: 0,
    label: "Dashboard",
    menuPath: "/dashboard",
    subMenus: [],
  },
  {
    name: "Quiz",
    hasChild: 0,
    label: "Quiz",
    menuPath: "/quiz",
    subMenus: [],
  },
  {
    name: "Settings",
    hasChild: 0,
    label: "Settings",
    menuPath: "/settings",
    subMenus: [],
  },
  {
    name: "Poll",
    hasChild: 0,
    label: "Poll",
    menuPath: "/poll",
    subMenus: [],
  },
  {
    name: "Rating",
    hasChild: 1,
    label: "Rating",
    menuPath: null,
    subMenus: [
      {
        label: "Player Rating",
        menuPath: "/rating/players",
      },
      {
        label: "Match Rating",
        menuPath: "/rating/matches",
      },
      {
        label: "Team Rating",
        menuPath: "/rating/teams",
      },
    ],
  },
  {
    name: "Manage",
    hasChild: 1,
    label: "Manage",
    menuPath: null,
    subMenus: [
      {
        label: "Player",
        menuPath: "/manage/list/player",
      },
      {
        label: "Team",
        menuPath: "/manage/list/team",
      },
      {
        label: "Category",
        menuPath: "/manage/list/category",
      },
      {
        label: "Tags",
        menuPath: "/manage/list/tags",
      },
    ],
  },
  {
    name: "User Role",
    hasChild: 1,
    label: "User Role",
    menuPath: null,
    subMenus: [
      {
        label: "Admin",
        menuPath: "/users/admin",
      },
      {
        label: "Authors",
        menuPath: "/users/authors",
      },
      {
        label: "Freelancers",
        menuPath: "/users/freelancer",
      },
      {
        label: "Editors",
        menuPath: "/users/editors",
      },
      {
        label: "Affiliate",
        menuPath: "/users/affiliate",
      },
    ],
  },
  {
    name: "Post",
    hasChild: 1,
    label: "Post",
    menuPath: null,
    subMenus: [
      {
        label: "All Post",
        menuPath: "/post/manage",
      },
      {
        label: "Create Post",
        menuPath: "/post/newblog",
      },
    ],
  },
];
const menuSeeder = async (userId) => {
  try {
    await Promise.all(
      menuJson.map(async (item) => {
        const [menu, created] = await MenuList.findOrCreate({
          where: {
            name: item.name,
            label: item.label,
          },
          defaults: item,
        });
        await Promise.all(
          item.subMenus.map(async (subMenu) => {
            console.log(subMenu);
            await ChildMenuList.findOrCreate({
              where: {
                label: subMenu.label,
                menuPath: subMenu.menuPath,
              },
              defaults: {
                ...subMenu,
                parentId: menu.id,
              },
            });
          })
        );
        console.log(userId);
        await MenuPermission.findOrCreate({
          where: {
            menuId: menu.id,
            userId,
          },
          defaults: {
            menuId: menu.id,
            userId,
          },
        });
      })
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = menuSeeder;
