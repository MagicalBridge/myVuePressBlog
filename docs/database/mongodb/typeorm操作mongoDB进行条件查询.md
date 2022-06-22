---
sidebar: auto
---

# TypeORM操作mongoDB进行条件查询

## 场景描述：
在做wpm的项目过程中，提供给pc端使用的查询包列表的接口，这个接口支持模糊搜索。如果传入`packageName`, 就是条件查询，否则就是全量查询。


接口的代码实现：

```ts
  public async queryWpmPackageList(dto: QueryAllPkgOptionsDto): Promise<any> {
    try {
      // 从入参中解构出来必要信息
      const { pageNumber = PageEnum.PAGE_NUMBER, pageSize = PageEnum.PAGE_SIZE,packageName = null } = dto;
      const queryCondition : ObjectLiteral = [];
      let listRes = [];
      if (packageName) {
        queryCondition.push({
          packageName: {
            $regex: new RegExp(`${packageName}`,'i')
          },
        },{
          granteeRole: "register",
        });
        listRes = await this.wpmUserAuthRepository.findAndCount({
          where: {
            $and: queryCondition,
          },
          take: pageSize,
          skip: (pageNumber - 1) * pageSize,
          order: {
            createdAt: 'DESC',
          },
        });
      } else {
        queryCondition.push({
          granteeRole: "register",
        });
        listRes = await this.wpmUserAuthRepository.findAndCount({
          where: {
            $and: queryCondition,
          },
          take: pageSize,
          skip: pageSize * (pageNumber - 1),
          order: {
            createdAt: 'DESC',
          },
        });
      }

      const formateData = listRes[0].map((item) => {
        return pick(item, [
          'username',
          'packageName',
          'description',
          'createdAt',
        ]);
      });

      return {
        total: listRes[1],
        pageNumber,
        pageSize,
        data: formateData,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.OK);
    }
  }
```

从上面的代码中可以看出，条件查询的关键字就是where, 并且在where内部使用 `$and` 这个条件语句进行实现。并且条件语句是用过数组的形式传递进去的。

