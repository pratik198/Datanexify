import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import "./App.css";

function App() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }


  // async function googleSignIn() {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //     options: {
  //       scopes: "https://www.googleapis.com/auth/calendar",
  //     },
  //   });

  //   if (error) {
  //     console.error("Error during Google Sign-In:", error.message);
  //     alert("Failed to log in. Please try again.");
  //   }
  // }
  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: "https://datanexify-iwis.vercel.app/auth/callback",
      },
    });

    if (error) {
      console.error("Error during Google Sign-In:", error.message);
      alert("Failed to log in. Please try again.");
    }
  }


  async function signOut() {
    await supabase.auth.signOut();
    setEvents([]);
  }


  async function createCalendarEvent() {
    if (!session) {
      console.error("User is not logged in.");
      return;
    }

    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const accessToken = session.provider_token;

    if (!accessToken) {
      console.error("No access token found. Ensure the OAuth flow is configured properly.");
      return;
    }

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("Event created successfully:", result);
        alert("Event is created. Check your Google Calendar.");
        setEvents([...events, event]);
        setShowModal(false);
      } else {
        console.error("Error creating calendar event:", result);
        alert(`Failed to create event: ${result.error.message}`);
      }
    } catch (error) {
      console.error("Network or API error:", error);
      alert("An error occurred while creating the calendar event.");
    }
  }


  // console.log(session)
  return (
    <div className="App">
      <header className="header">
        <h1>Welcome to My Event Calendar</h1>
        <p>Plan your events and sync them to Google Calendar</p>
      </header>

      <div className="container">
        {session ? (
          <>
            <h2 className="greeting">Hello, {session.user.email}</h2>


            <button
              className="create-event-btn"
              onClick={() => setShowModal(true)}
            >
              Create Calendar Event
            </button>


            {showModal && (
              <div className="modal">
                <div>
                  <h3>Create New Event</h3>
                  <p className="label">Start Your Event</p>
                  <DatePicker
                    selected={start}
                    onChange={setStart}
                    className="date-picker"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeSelect
                    timeIntervals={15}
                  />
                  <p className="label">End Your Event</p>
                  <DatePicker
                    selected={end}
                    onChange={setEnd}
                    className="date-picker"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeSelect
                    timeIntervals={15}
                  />
                  <p>Event Name</p>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                  <p>Event Description</p>
                  <input
                    type="text"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                  <button
                    className="create-event-btn"
                    onClick={createCalendarEvent}
                  >
                    Create Event
                  </button>
                  <button
                    className="close-modal-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <button className="sign-out-btn" onClick={signOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button className="sign-in-btn" onClick={googleSignIn}>
              Sign In With Google
            </button>
          </>
        )}


        {session && (
          <table className="event-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Event Description</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td>{event.summary}</td>
                  <td>{event.description}</td>
                  <td>{new Date(event.start.dateTime).toLocaleString()}</td>
                  <td>{new Date(event.end.dateTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
