//Create a class that will be used to create a timer
export class Timer {
  timer: number;
  //Create a constructor that will be used to initialize the timer
  constructor() {
    //Initialize the timer
    this.timer = Date.now();
  }
  //Create a method that will be used to stop the timer
  elapsed() {
    //Stop the timer
    return Date.now() - this.timer;
  }
}
