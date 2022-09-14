class Cooker {
  cook() {
    console.log('做饭')
  }
}

// 真正执行命令
class Cleaner {
  clean() {
    console.log('保洁')
  }
}
// 调用者
class CookCommand {
  // receiver命令接收者
  constructor(receiver) {
    this.receiver = receiver;
  }
  excute() {
    this.receiver.cook();
  }
}

// 接收命令并执行
class CleanCommand {
  constructor(receiver) {
    this.receiver = receiver;
  }
  excute() {
    this.receiver.clean();
  }
}

// 发布命令的（使用者）
class Customer {
  constructor(command) {
    this.command = command;
  }
  clean() {
    this.command.excute();
  }
  cook() {
    this.command.excute();
  }
}

let cooker = new Cooker();
let cleaner = new Cleaner();
let cookCommand = new CookCommand(cooker);
let cleanCommand = new CleanCommand(cleaner);
let customer = new Customer(cookCommand);
customer.cook();