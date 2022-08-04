export default [{
  url: "/user/login",
  method: "post",
  response: () => {
    return {
      data: new Date().getTime() + ''
    }
  }
}, {
  url: "/user/logout",
  method: "get",
  response: () => {
    return {
      data: new Date().getTime() + ''
    }
  }
}, {
  url: "/user/logout",
  method: "post",
  response: () => {
    return {
      data: new Date().getTime() + ''
    }
  }
}, {
  url: "/user/refresh",
  method: "post",
  response: () => {
    return {
      data: new Date().getTime() + ''
    }
  }
}, {
  url: "/user/getUserInfo",
  method: "get",
  response: () => {
    return {
      data: {
        userInfo: {
          username: 'admin',
          name: 'avue',
          avatar: 'https://gitee.com/uploads/61/632261_smallweigit.jpg',
        },
        roles: 'admin',
        permission: [
          'sys_crud_btn_add',
          'sys_crud_btn_export',
          'sys_menu_btn_add',
          'sys_menu_btn_edit',
          'sys_menu_btn_del',
          'sys_role_btn1',
          'sys_role_btn2',
          'sys_role_btn3',
          'sys_role_btn4',
          'sys_role_btn5',
          'sys_role_btn6',
        ]
      }
    }
  }
}]