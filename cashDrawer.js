const readline = require('readline');

class CashDrawer {
  constructor(faceValues) {
    this.store = {};
    this.faceValues = faceValues.sort((a, b) => b - a); 

    for (let value of this.faceValues) {
      this.store[value] = 0;
    }
  }

  deposit(bankNotes) {
    let totalAmount = 0;
    for (let note of bankNotes) {
      if (!this.store.hasOwnProperty(note) || note < 0) {
        throw new Error(`Invalid bank note of face value: ${note}`);
      }
      this.store[note]++;
      totalAmount += note;
    }
    return totalAmount;
  }

  peek() {
    return { ...this.store };
  }

  withdraw(amount) {
    if (amount <= 0) {
      throw new Error('The withdrawal amount must be greater than 0');
    }

    const result = [];
    let remainingAmount = amount;

    const tempStore = { ...this.store };

    for (let value of this.faceValues) {
      while (tempStore[value] > 0 && remainingAmount >= value) {
        remainingAmount -= value;
        tempStore[value]--;
        result.push(value);
      }
    }

    if (remainingAmount === 0) {
      this.store = { ...tempStore };
      return result;
    } else {
      throw new Error(`Cannot withdraw the specified amount: ${amount}`);
    }
  }
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const cashDrawer = new CashDrawer([5, 10, 25, 50, 100]);

const mainMenu = () => {
  console.log("\nCash Drawer Menu:");
  console.log("1. Deposit bank notes");
  console.log("2. Peek into cash drawer");
  console.log("3. Withdraw amount");
  console.log("4. Exit");
  rl.question("Choose an option: ", (option) => {
    switch (option) {
      case '1':
        rl.question("Enter bank notes to deposit (comma separated): ", (notes) => {
          const bankNotes = notes.split(',').map(Number);
          try {
            const totalAmount = cashDrawer.deposit(bankNotes);
            console.log(`Successfully deposited: ${totalAmount}`);
          } catch (error) {
            console.error(error.message);
          }
          mainMenu();
        });
        break;
      case '2':
        console.log("Current state of the cash drawer:", cashDrawer.peek());
        mainMenu();
        break;
      case '3':
        rl.question("Enter amount to withdraw: ", (amount) => {
          try {
            const withdrawnNotes = cashDrawer.withdraw(Number(amount));
            console.log(`Successfully withdrawn: ${withdrawnNotes}`);
          } catch (error) {
            console.error(error.message);
          }
          mainMenu();
        });
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log("Invalid option. Please try again.");
        mainMenu();
        break;
    }
  });
};


mainMenu();
