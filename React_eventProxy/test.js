/** react 兄弟页面传递消息 **/
/** sender **/
eventProxy.trigger('updatelist', data);


/** receiver **/
eventProxy.on('updatelist', (data) => {
    console.log("get triggered updatelist",data);
    this.initPkgList(data);
});