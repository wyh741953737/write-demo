
    const arr = [{
        id: 0,
        parentId: null,
        name: '生物',
      },
      {
        id: 1,
        parentId: 0,
        name: '动物',
      },
      {
        id: 2,
        parentId: 0,
        name: '植物',
      },
      {
        id: 3,
        parentId: 0,
        name: '微生物',
      },
      {
        id: 4,
        parentId: 1,
        name: '哺乳动物',
      },
      {
        id: 5,
        parentId: 1,
        name: '卵生物',
      },
      {
        id: 6,
        parentId: 2,
        name: '种子植物',
      },
      {
        id: 7,
        parentId: 2,
        name: '厥类植物',
      },
      {
        id: 8,
        parentId: 4,
        name: '大象',
      },
      {
        id: 9,
        parentId: 4,
        name: '海豚'
      },
      {
        id: 10,
        parentId: 3,
        name: '满天星',
      },
      {
        id: 11,
        parentId: 3,
        name: '绿萝'
      }
    ]

    const arrtree = [{
      id: 0,
      parentId: null,
      name: '食物',
      children: [{
          id: 1,
          parentId: 0,
          name: '甜品',
          children: [{
              id: 3,
              parentId: 1,
              name: '巧克力',
            },
            {
              id: 4,
              parentId: 1,
              name: '蛋糕'
            },
          ]
        },
        {
          id: 2,
          parentId: 0,
          name: '辛辣',
          children: [

            {
              id: 5,
              parentId: 2,
              name: '满天星',
            },
            {
              id: 6,
              parentId: 2,
              name: '绿萝'
            }
          ]
        }
      ]
    }]

    function tree(arr) {
      if (!Array.isArray(arr) || arr.length < 1) return null;
      const [root] = arr.filter(item => item.parentId === null);
      const addChildren = (node, dataList) => {
        node.children = dataList
          .filter(data => data.parentId === node.id)
          .map(item => addChildren(item, dataList))
        return node;
      }
      return addChildren(root, arr);
    }
