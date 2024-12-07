import React, { useEffect, useRef, useState } from "react";
import enLocale from "@fullcalendar/core/locales/en-gb";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useCookies } from "react-cookie";

import {
  Avatar,
  Typography,
} from "@mui/material";

const Opportunitycalender = () => {
  const calendar = useRef(null);
  const [initialView, setInitialView] = useState("dayGridMonth");
  const [appointments, setAppointments] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateAppointments, setDateAppointments] = useState([]);
  const [modalDetails, setModalDetails] = useState(null);
  const [cookies, setCookie] = useCookies(["amr"]);
  useEffect(() => {
    async function fetchAppointments() {
      const userid = cookies.amr?.UserID || 'Role';
      try {
        const response = await fetch(
          `https://apiforcornershost.cubisysit.com/api/api-fetch-opportunityfollowup.php?UserID=${userid}`
        );
        const result = await response.json();
        if (result.code === 200) {
          const today = new Date().setHours(0, 0, 0, 0); // Current date without time
          const data = result.data.map((item) => {
            const startDate = new Date(item.NextFollowUpDate).setHours(0, 0, 0, 0);
            let backgroundColor = "#f0f0f0"; // Default color

            if (startDate < today) {
              backgroundColor = "#FF6347"; // Red for past dates
            } else if (startDate > today) {
              backgroundColor = "#32CD32"; // Green for future dates
            } else {
              backgroundColor = "#FFD700"; // Yellow for current date
            }

            return {
              title: item.CName,
              start: item.NextFollowUpDate,
              color: "#87CEEB",
              backgroundColor: backgroundColor, // Set the background color
              fid: item.fid,
            };
          });
          setAppointments(data);
        } else {
          console.error("Error fetching appointments:", result.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleResize() {
        setInitialView(setCalendarViewByWidth());
      }
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  function setCalendarViewByWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 600) {
      return "dayGridDay";
    } else if (screenWidth < 960) {
      return "dayGridWeek";
    } else {
      return "dayGridMonth";
    }
  }

  async function fetchAppointmentDetails(fid) {
    try {
      const response = await fetch(
        `https://proxy-forcorners.vercel.app/api/proxy/api-singel-oppocalender.php?fid=${fid}`
      );
      const result = await response.json();
      if (result.code === 200) {
        console.log(result.data, "data ayaa");
        setModalDetails(result.data[0]);
      } else {
        console.error("Error fetching appointment details:", result.message);
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  }

  function handleEventClick(clickInfo) {
    const formattedDate = new Date(clickInfo.event.start).toLocaleDateString();
    const eventsOnDate = appointments.filter(
      (app) => app.start === clickInfo.event.startStr
    );
    if (eventsOnDate.length > 0) {
      setClickedDate(formattedDate);
      setDateAppointments(eventsOnDate);
      setIsDateModalOpen(true);
      fetchAppointmentDetails(clickInfo.event.extendedProps.fid);
    }
  }

  return (
    <div>
      <style>
        {`
          .fc-button-custom {
            background-color: #9155fd !important;
            color: #fff !important;
            border-color: #9155fd !important;
          }
          .modal {
            display: ${isDateModalOpen ? "block" : "none"};
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            overflow: auto;
          }
          .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            border-radius: 10px;
            width: 60%;
            max-width: 500px;
            position: relative;
          }
          .close {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
          }
          .close:hover,
          .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
          }
          .fc {
            border-radius: 15px; /* Add border-radius to FullCalendar */
            overflow: hidden;
          }
          .fc-toolbar-title {
            font-size: 1.5em;
            color: #333;
          }
          .fc-dayGridMonth-view, .fc-dayGridWeek-view, .fc-dayGridDay-view {
            background-color: #f9f9f9;
          }
          .fc-button-toggleMonth:before, .fc-button-toggleWeek:before, .fc-button-toggleDay:before {
            font-family: 'FontAwesome';
            margin-right: 5px;
          }
          .fc-button-toggleMonth:before {
            content: '\\f073'; /* Calendar icon */
          }
          .fc-button-toggleWeek:before {
            content: '\\f133'; /* Calendar-week icon */
          }
          .fc-button-toggleDay:before {
            content: '\\f017'; /* Clock icon */
          }
          .legend {
            margin-top: 10px;
            padding: 10px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          .legend-item {
            display: inline-block;
            margin-right: 20px;
            font-weight: bold;
          }
          .red {
            color: #FF6347;
          }
          .green {
            color: #32CD32;
          }
          .yellow {
            color: #FFD700;
          }
        `}
      </style>
      <FullCalendar
        ref={calendar}
        fixedWeekCount={false}
        height={"auto"}
        locale={enLocale}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={{
          start: "prev today next",
          center: "title",
          end: "newAppointment",
        }}
        footerToolbar={{
          center: "toggleMonth toggleWeek toggleDay",
        }}
        customButtons={{
          // newAppointment: {
          //   text: "New Appointment",
          //   click: () => {
          //     // Handle new appointment creation
          //   },
          //   className: "fc-button-custom",
          // },
          toggleDay: {
            text: "Today",
            click: () => {
              calendar.current.getApi().changeView("dayGridDay");
            },
            className: "fc-button-custom",
          },
          toggleWeek: {
            text: "Week",
            click: () => {
              calendar.current.getApi().changeView("dayGridWeek");
            },
          },
          toggleMonth: {
            text: "Month",
            click: () => {
              calendar.current.getApi().changeView("dayGridMonth");
            },
          },
        }}
        // dateClick={(e) => handleDateClick(e)}
        events={appointments}
        datesSet={async (dateInfo) => {
          // await getEvents(dateInfo.startStr.split('T')[0], dateInfo.endStr.split('T')[0]);
        }}
        eventsSet={(events) => {
          console.log("Events set: ", events);
        }}
        eventClick={(e) => handleEventClick(e)}
      />
      {isDateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsDateModalOpen(false)}>
              &times;
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Avatar
                alt="Avatar"
                sx={{ width: 60, height: 60, margin: 2 }}
                src="/images/avatars/1.png"
              />
              <div style={{ textAlign: "center" }}>
                <Typography variant="body2">
                  <strong>Customer Name:</strong>{" "}
                  {modalDetails ? modalDetails.CName : "Loading..."}
                </Typography>

                {modalDetails && (
                  <div>
                    <Typography variant="body2">
                      <strong>Phone Number:</strong> {modalDetails.Mobile}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Next Follow-Up Date:</strong>{" "}
                      {modalDetails.NextFollowUpDate}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Opportunitycalender;
