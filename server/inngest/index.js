import { Inngest } from "inngest";
import User from "../models/user.js";
import Booking from "../models/booking.js";
import sendEmail from "../configs/nodeMailer.js";
import Show from "../models/show.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id : 'sync-user-from-clerk'},
    {event : 'clerk/user.created'},
    async({event})=>{
        const {id , first_name ,last_name,email_addresses ,image_url}=event.data
        const userData = {
            _id : id,
            email:email_addresses[0].email_address,
            name:first_name +' '+last_name,
            image:image_url
        }
        await User.create(userData)
    }
)

//Inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {id : 'delete-user-with-clerk'},
    {event : 'clerk/user.deleted'},
    async({event})=>{
        const {id}= event.data
        await User.findByIdAndDelete(id)
              
    }
)

//Inngest function to update user data in database 
const syncUserUpdation = inngest.createFunction(
    {id : 'update-user-with-clerk'},
    {event : 'clerk/user.updated'},
    async({event})=>{
         const {id , first_name ,last_name,email_addresses ,image_url}=event.data
          const userData = {
            _id : id,
            email:email_addresses[0].email_address,
            name:first_name +' '+last_name,
            image:image_url
        }
        await User.findByIdAndUpdate(id,userData)
              
    }
)

//to cancel and release seats



const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event,step }) => {
      const { bookingId } = event.data;
      const booking = await Booking.findById(bookingId)
        .populate({
          path: "show",
          populate: { path: "movie", model: "Movie" }, // Fix repeated 'path'
        }).populate("user");

      await sendEmail({
        to: booking.user.email,
        subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
        body: `<div style="font-family:Arial,sans-serif; line-height:1.5;">
                  <h2>Hi ${booking.user.name},</h2>
                  <p>Your booking is confirmed.</p>
                  <p>Enjoy the show!</p>
               </div>`,
      });

          console.log("Email sent successfully!");
        }
    );


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation,releaseSeatsAndDeleteBooking,sendBookingConfirmationEmail];