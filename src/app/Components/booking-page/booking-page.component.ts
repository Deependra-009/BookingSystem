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
   * 
   * We increase seatsPerRow,lastRowSeats to 1 because in the last colum is used to store 
   * the count of booked seats in particular row
   * *******************************************************************/
  totalSeats: number = 80;
  rows: number = 12;
  seatsPerRow: number = 7+1;
  lastRowSeats: number = 3+1;
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

    // intialize the 11 row of length 8
    for (let i = 0; i < this.rows - 1; i++) {
      let row: string[] = [];
      for (let j = 0; j < this.seatsPerRow; j++) {
        row.push('0'); // 0 means seat is Empty and 1 means seat is Occupied
      }
      this.seatLayout.push(row);
    }

    // initialize the last row of length 4
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
      let row_array = this.seatLayout[i]; // get a particular row
      let row_len = row_array.length; // get a length of particular row

      // Last Column is used to store the count of booked seat in a particular row
      // So we can easily check the seatsRequired is available in this row
      if (this.seatsPerRow - Number(row_array[row_len - 1]) - 1 < numSeats) continue;
      else {

        // If required seats available in a particular row so we need to check continuos seat available or not
        let bookign_details: any = this.checkSeats(row_array, numSeats);
        let start = bookign_details.from - 1;
        let end = bookign_details.to - 1;
        let book = bookign_details.status;

        // If seats booked successfully so book is true otherwise book is false;
        // If book is false so go to next row
        if (book) {
          for (let i = start; i <= end; i++) {
            row_array[i] = '1';
          }

          // Set last column data.
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

  // Check seats function is if seat available so booked it 
  // otherwise not go to next row

  checkSeats(row_array: any, numSeats: Number) {
    let start = -1;
    let end = -1;
    let book: Boolean = false;


    // traverse in a whole row
    for (let j = 0; j < row_array.length - 1; j++) {
      start = -1;
      end = -1;

      // if we found 0 in a row so start from a particular index
      // and go to particularindex+No of seats

      if (row_array[j] == '0') {
        start = j;
        let k = start;
        let count = Number(numSeats);

        while (k < row_array.length - 1 && row_array[k] == '0' && count > 0) {
          count--;
          k++;
        }

        // If count is 0 it means require seat found so we can easily book that seats
        if (count == 0) {
          end = k - 1;
        }
        
        if (start != -1 && end != -1) {
          book = true;
          break;
        }
      }
    }

    // If the above loop end and reach here it means there is no contiguous seats 
    // available in this row so check in next row
    return {
      from: start + 1,
      to: end + 1,
      status: book
    }

  }

}

