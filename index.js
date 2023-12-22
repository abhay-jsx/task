const express = require("express");
const data = require('./data.json');
const slots = require('./slotTable.json');
const bookingTable = require('./bookingTable.json');
const bodyParser =  require("body-parser");

const app = express();


app.use(bodyParser.urlencoded({ extended: false }))


const isRoomAvailable =(roomId,date,slotId)=>{
    return !bookingTable.some(booking => booking.roomId == roomId && booking.date == date && booking.slotId == slotId);
} 


app.post('/get-rooms',(req,res)=>{
    const { date } = req.body;

    let unBookedRooms = [];
    data.forEach((room)=>{
        slots.forEach((slot)=>{
            if (isRoomAvailable(room.id,date,slot.id)) {
                unBookedRooms.push({
                    roomName: room.roomName,
                    slotId: slot.id,
                });
            }
        });
    })
    res.send(unBookedRooms);
});

app.post('/book-room',(req,res)=>{
    const { date , slotId, userId,roomId} = req.body;

    if (isRoomAvailable(roomId,date,slotId)) {
        bookingTable.push({
            id: bookingTable.length + 1,
            roomId,
            userId,
            date,
            slotId
        });
    
        res.send({ status: "Booking Confirmed" ,bookingTable});
    } else {
        res.send({ status: "Room not available for the selected date and slot" });
    }
});

app.post('/update-room',(req,res)=>{
    let { date, slotId, userId, roomId, bookingId } = req.body;
    if (isRoomAvailable(roomId,date,slotId)) {
        bookingTable.map((booking) => {
            if (booking.id == bookingId) {
                return {
                    id: bookingId,
                    roomId,
                    userId,
                    date,
                    slotId
                };
            } else {
                return booking;
            }
        });
        res.send({ status: "Booking Updated" ,bookingTable});
    } else {
        res.send({ status: "Room not available for the selected date and slot" });
    }

});

app.post('/delete-booking',(req,res)=>{
    const {bookingId} = req.body;

    bookingTable.filter((booking)=>{
       return booking.id != bookingId;
    })
    res.send("Booking Deleted");
});

app.listen(3000,()=>{
    console.log("server runing!!");
});