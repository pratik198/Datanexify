// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { createClient } from '@supabase/supabase-js';
// import { SessionContextProvider } from '@supabase/auth-helpers-react'


// const supabase = createClient(
//   "https://pyucuqxbhewkkrmjbbqb.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dWN1cXhiaGV3a2tybWpiYnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMDgzMTAsImV4cCI6MjA0Nzc4NDMxMH0.yBgwlHoYNqW-UcN-EBDu7DxXlUx7-FlBfya6DuXAHEo"
// );

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <SessionContextProvider supabaseClient={supabase}>
//     <App />
//     </SessionContextProvider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();



import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';


const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);

reportWebVitals();
