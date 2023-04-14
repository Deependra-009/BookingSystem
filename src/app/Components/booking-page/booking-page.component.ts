import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {

  /*********************************************************************
   * Initialize variables for number of total seats, rows, seats per row, 
   * last row seats, seat layout,number of reserved seats, and whether 
   * to show error message
   * *******************************************************************/
  totalSeats: number = 80;
  rows: number = 12;
  seatsPerRow: number = 8;
  lastRowSeats: number = 4;
  seatLayout: string[][] = [];
  reservedSeats: number = 0;
  ShowErrorMessage: boolean = false;

  /******************
   *  User Data
   * ****************/
  UserData: any = {
    FullName: '',
    PhoneNumber: '',
    SeatRequired: ''
  }

  /******************
   * Result Data
   * ****************/
  ResultData: any = {
    row:'',
    NoOfSeat:'',
    from: '',
    to: '',
    status:'',
    show:false
  }

  constructor(
  ) { }


  ngOnInit(): void {
  /****************************************
   * Firstly we initialize the seat layout
   * **************************************/
    this.initializeSeatLayout();
  }

  /************************
   * This function is used
   * to check Seat Value 
   * is valid or not
   ***********************/
  check() {
    const seatRequired = Number(this.UserData.SeatRequired);

    if (seatRequired > 7 || seatRequired < 1 || isNaN(seatRequired)) {
      this.ShowErrorMessage = true;
    }
    else {
      this.ShowErrorMessage = false
    }

  }

  /*********************************************
   * This function is to book a seat when user 
   * fill all details and click submit button
   **********************************************/
  submit() {
    const seatRequired = Number(this.UserData.SeatRequired);
    if (this.UserData.FullName == '' || this.UserData.PhoneNumber == '' || this.UserData.SeatRequired == '') {
      alert('All Fields Required!!!')
      return;
    }
    if (seatRequired > 7 || seatRequired < 1 || isNaN(seatRequired)) {
      this.ShowErrorMessage = true;
      return;
    }

    // We call a reservedSeats function to book a seat
    const booking_details: any[] = this.reserveSeats(this.UserData.SeatRequired);

    // Set the data which come from function to set the ResultData
    this.ResultData=booking_details;

    // This show value define that user click the submit button so,Show the result 
    // whether is failed or successfull 
    this.ResultData.show=true;
    

  }

  // Initialize the seat layout with available seats
  initializeSeatLayout() {
    for (let i = 0; i < this.rows - 1; i++) {
      let row: string[] = [];
      for (let j = 0; j < this.seatsPerRow; j++) {
        row.push('0'); // 0 means seat is Empty and 1 means seat is Occupied
      }
      this.seatLayout.push(row);
    }
    for (let i = 0; i < 1; i++) {
      let row: string[] = [];
      for (let j = 0; j < this.lastRowSeats; j++) {
        row.push('0');
      }
      this.seatLayout.push(row);
    }
  }


  // Reserve seats
  reserveSeats(numSeats: number) {

    for (let i = 0; i < this.rows; i++) {
      let row_array = this.seatLayout[i];
      let row_len = row_array.length;
      if (this.seatsPerRow - Number(row_array[row_len - 1]) - 1 < numSeats) continue;
      else {

        let bookign_details: any = this.checkSeats(row_array, numSeats);
        let start = bookign_details.from - 1;
        let end = bookign_details.to - 1;
        let book = bookign_details.status;

        if (book) {
          for (let i = start; i <= end; i++) {
            row_array[i] = '1';
          }
          row_array[row_len - 1] = "" + (Number(row_array[row_len - 1]) + numSeats);
          bookign_details = { row: i+1,NoOfSeat:numSeats, ...bookign_details };

          return bookign_details;

        }
      }
    }

    return {
      status: false
    };

  }

  checkSeats(row_array: any, numSeats: Number) {
    let start = -1;
    let end = -1;
    let book: Boolean = false;

    for (let j = 0; j < row_array.length - 1; j++) {
      start = -1;
      end = -1;
      if (row_array[j] == '0') {
        start = j;
        let k = start;
        let count = Number(numSeats);

        while (k < row_array.length - 1 && row_array[k] == '0' && count > 0) {
          count--;
          k++;
        }
        if (count == 0) {
          end = k - 1;
        }
        if (start != -1 && end != -1) {
          book = true;
          break;
        }
      }
    }
    return {
      from: start + 1,
      to: end + 1,
      status: book
    }

  }

}

