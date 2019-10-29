import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { I18NService } from '@core';

@Component({
  selector: 'app-company-manage',
  templateUrl: './company-manage.component.html',
  styleUrls: ['../companyManage.less'],
})
export class CompanyManageComponent implements OnInit {


  current = 0; // 0 结构树 1 logo 2 名称 3 登录
  structureArr = [{
    id: 0,
    name: '四川超影公司一级四川超影公司一级四川超影公司一级四川超影公司一级四川超影公司一级',
    children: [
      {
        id: 10,
        name: '金川电厂二级',
        children: [
          {
            id: 20,
            name: '金川1部门三级',
            children: [
              {
                id: 30,
                name: '金川小组四级',
                children: [
                  // {
                  //   id: 30,
                  //   name: '金川小组五级',
                  //   children: [
                  //     {
                  //       id: 30,
                  //       name: '金川小组l6级',
                  //       children: [
                  //         {
                  //           id: 30,
                  //           name: '金川小组7级',
                  //           children: [
                  //             {
                  //               id: 30,
                  //               name: '金川小组8级',
                  //               children: [
                  //                 {
                  //                   id: 30,
                  //                   name: '金川小组9级',
                  //                   children: []
                  //                 },
                  //               ]
                  //             },
                  //           ]
                  //         },
                  //       ]
                  //     },
                  //   ]
                  // },
                ]
              },
            ]
          },
          {
            id: 21,
            name: '金川2部门三级',
            children: []
          },
        ]
      },
      {
        id: 11,
        name: '宁海电厂二级',
        children: []
      }
    ]
  }];
  drag_start_val = null; // 拖动的元素
  drag_enter_val = null; // 进入的容器
  select_val = null; // 动态绑定-选择的节点数据
  input_val: string; // 编辑时的输入框
  treeEditType: number; // 0 新增下级 1 新增平级 2 修改





  constructor(
    private i18n: I18NService,
    private msg: NzMessageService,
  ) { }

  ngOnInit() {



    this.setTableHeight();
    this.setTableWidth();
  }


  // 界面加载后滚动——高度
  setTableHeight() {
    setTimeout(() => {
      const tableElement = document.querySelectorAll('.table_content') as NodeListOf<HTMLElement>;
      const tableHeight = document.body.clientHeight - 200;
      tableElement[0].style.height = tableHeight + 'px';
    }, 500);
  }
  // 界面加载后滚动——宽度
  setTableWidth() {
    setTimeout(() => {
      const tableElement2 = document.querySelectorAll('.table_content_tree') as NodeListOf<HTMLElement>;
      const tableWidth2 = 300 * 9 + 300 * 3; // 与深度、广度有关系
      tableElement2[0].style.width = tableWidth2 + 'px';
    }, 500);
  }
  // 点击组织结构
  structureClick() {
    console.log('点击组织结构')
    this.setTableHeight();
  }


  // 开始拖动
  dragStart(event, e: MouseEvent) {
    e.stopPropagation();
    console.log('开始拖动:', event)
    const objElement = document.querySelectorAll(`.tree${event.id}`) as NodeListOf<HTMLElement>;
    objElement[0].style.opacity = "0.2";

    this.drag_start_val = event;

  }
  // 拖动结束
  dragEnd(event, e: MouseEvent) {
    e.stopPropagation();
    console.log('拖动结束：', event)
    const objElement = document.querySelectorAll(`.tree${event.id}`) as NodeListOf<HTMLElement>;
    objElement[0].style.opacity = '1';

  }

  allowDrop(event) {
    event.preventDefault();
  }
  // 鼠标释放
  drop(event) { // 在一个拖动过程中，释放鼠标键时触发此事件
    console.log('鼠标释放:', event)
    event.preventDefault();

    if (this.drag_enter_val) {
      const objElement = document.querySelectorAll(`.tree_a${this.drag_enter_val.id}`) as NodeListOf<HTMLElement>;
      objElement[0].style.backgroundColor = '';
      // 目标元素不是开始拖动的子元素
      const result1 = this.drag_start_val.id === this.drag_enter_val.id;
      const result2 = this.exist_JuniorNode(this.drag_start_val.children);
      if (result1 || result2) {
        console.log('目标元素是开始拖动的子元素:')
        return;
      }
      // 发送后端
      //  姓名：this.drag_start_val.name,
      // ID:this.drag_start_val.id
      // 父级ID：this.drag_enter_val.id
      // 创建新结构树：去重=>push // 向后端先post再get数据进行渲染


    }



  }
  // 对象进入其容器范围内
  dragenter(event) { // 
    console.log('对象进入其容器范围内:', event)
    const objElement = document.querySelectorAll(`.tree_a${event.id}`) as NodeListOf<HTMLElement>;
    objElement[0].style.backgroundColor = '#1890ff';
    this.drag_enter_val = event;

  }
  // 对象离开其容器范围内
  dragleave(event) {
    console.log('对象离开其容器范围内:', event)
    const objElement = document.querySelectorAll(`.tree_a${event.id}`) as NodeListOf<HTMLElement>;
    objElement[0].style.backgroundColor = '';

    this.drag_enter_val = null;
  }



  // 选中的节点
  selectedVal(value) {
    console.log('选中的节点', value);
    this.select_val = value;
  }


  // 新增
  addTreeNode(type) {
    if (this.input_val !== undefined) { // 存在编辑节点
      const msg0 = this.i18n.fanyi('systemManage.companyManage.addExist');
      this.msg.warning(msg0)
      return;
    }
    this.input_val = '';
    console.log('新增', type)
    this.addTreeNode_recursion(this.structureArr, type);
    this.treeEditType = type === 'junior' ? 0 : 1;
    // 新增根据节点显示高度
  }
  // 修改
  editNode() {
    console.log('修改');
    if (this.input_val !== undefined) { // 存在编辑节点
      const msg0 = this.i18n.fanyi('systemManage.companyManage.addExist');
      this.msg.warning(msg0)
      return;
    }
    this.input_val = this.select_val.name;
    this.treeEditType = 2;
    this.addTreeNode_recursion(this.structureArr, 'edit');

  }
  // 失去焦点保存input
  inputBlur(val) {
    console.log('修改编辑姓名:', this.input_val);
    console.log('修改编辑:', val);
    // 向后端发送请求——并刷新结构树
    if (this.treeEditType === 0) { // 下级

    } else if (this.treeEditType === 1) { // 平级

    } else if (this.treeEditType === 2) { // 编辑

    }
    this.input_val = undefined;
  }
  // 删除
  delNode() {
    console.log('删除')
  }

  // 结构树新增/修改——递归匹配节点
  addTreeNode_recursion(data, type) {
    data.forEach(item0 => {
      if (item0.id === this.select_val.id) {
        if (type === 'junior') {
          item0.children.push({ id: this.select_val.id, name: '', children: [] });
        } else if (type === 'level') {
          data.push({ id: this.select_val.id, name: '', children: [] });
        } else if (type === 'edit') {
          item0.name = '';
        }
      } else {
        this.addTreeNode_recursion(item0.children, type);
      }
    });
  }
  // 结构树匹配子节点
  exist_JuniorNode(data) {
    const result = data.some(item0 => {
      if (item0.id === this.drag_enter_val.id) {
        return true;
      } else {
        return this.exist_JuniorNode(item0.children);
      }
    });
    return result;
  }





}
