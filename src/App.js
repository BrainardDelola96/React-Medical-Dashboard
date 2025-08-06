import logo from './logo.svg';
import './App.css';
import main_logo from './assets/TestLogo.svg'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Register chart components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function App() {

const [patients, setPatients] = useState([]);
const [singlePatient, setSinglePatient] = useState(null);
const [selectedPatientId, setSelectedPatientId] = useState(null);

useEffect(() => {
  axios
    .get('https://fedskillstest.coalitiontechnologies.workers.dev', {
      headers: {
        Authorization: 'Basic ' + btoa('coalition:skills-test'),
      },
    })
    .then((res) => {
      setPatients(res.data);
      const defaultPatient = res.data[3] || res.data[0];
      setSinglePatient(defaultPatient);
      setSelectedPatientId(defaultPatient.id);
    })
    .catch((err) => console.error(err));
}, []);


 const monthMap = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};

const isInOctToMarRange = (monthIndex) => {
  return monthIndex >= 9 || monthIndex <= 2; // Oct (9) → Mar (2)
};

const systolicChartData = (() => {
  if (!singlePatient?.diagnosis_history) return null;

  const parsed = singlePatient.diagnosis_history
    .map((entry) => {
      const monthNum = monthMap[entry.month]; // e.g., "03" for March
      const dateString = `${entry.year}-${monthNum}-01`;
      const parsedDate = dayjs(dateString);
      return { ...entry, parsedDate };
    })
     .filter((entry) =>
      entry.parsedDate.isSameOrAfter(dayjs('2023-10-01')) &&
      entry.parsedDate.isSameOrBefore(dayjs('2024-03-31'))
    )
    .sort((a, b) => a.parsedDate - b.parsedDate);
      return {
    labels: parsed.map((entry) => entry.parsedDate.format('MMM, YYYY')),
    datasets: [
      {
        label: 'Systolic',
        data: parsed.map((entry) => entry.blood_pressure?.systolic?.value || 0),
        borderColor: 'rgb(194, 110, 180)',
        backgroundColor: '#E66FD2',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 10,
      },
      {
        label: 'Diastolic',
        data: parsed.map((entry) => entry.blood_pressure?.diastolic?.value || 0),
        borderColor: '#8C6FE6',
        backgroundColor: '#8C6FE6',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 10,
      },
    ],
  };
})();

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display:false,
    },
    title: {
      display: false,
      text: 'Curved Line Chart'
    }
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
};

const handleClick = (id) => {
  const selected = patients.find((p) => String(p.id) === String(id));
  console.log('Clicked ID:', id);
  console.log('Selected patient:', selected);

  if (selected) {
    setSinglePatient(selected);
    setSelectedPatientId(id);
  }
};

  return (
    <div className="App">
      <div className='wrapper'>
      <header className="App-header">
          <div className='main_logo'>
            <figure><img src={main_logo} alt="Tech Care" /></figure>
          </div>

          <nav>
            <ul>
              <li><a href="">Overview</a></li>
              <li><a href="">Patients</a></li>
              <li><a href="">Schedule</a></li>
              <li><a href="">Message</a></li>
              <li><a href="">Transactions</a></li>
            </ul>
          </nav>

          <div className='hero_side'>
            <figure><img src=""  alt=""/></figure>
            <h2>Dr. Jose Simmons<span>General Practitioner</span></h2>
            <a kref="" className='settings'></a>
            <a kref=""></a>
          </div>
      </header>

      <aside>
        <h2>Patients</h2>
        <ul>
          {patients.map((patient) => (
          <li key={patient.id}
        onClick={() => handleClick(patient.id)}
        className={selectedPatientId === patient.id ? 'selected' : ''}>
            <figure><img src={patient.profile_picture} alt={patient.name} /></figure>
            <h2>{patient.name}<span>{patient.gender},{patient.age}</span></h2>
          </li>
            ))}
        </ul>
      </aside>

    {singlePatient && (
      <div className='right_info'>
        <div className='right_info_container'>
            <figure><img src={singlePatient.profile_picture} alt={singlePatient.name}/></figure>
            <h2 className='name'>{singlePatient.name}</h2>
              <ul>
                <li><h3>Date Of Birth<span>{singlePatient.date_of_birth}</span></h3></li>
                <li><h3>Gender<span>{singlePatient.gender}</span></h3></li>
                <li><h3>Contact info.<span>{singlePatient.phone_number}</span></h3></li>
                <li><h3>Emergency Contacts<span>{singlePatient.emergency_contact}</span></h3></li>
                <li><h3>Insurance Providers<span>{singlePatient.insurance_type}</span></h3></li>
              </ul>
            <a href=''>Show All Information</a>
        </div>

        <div className='right_info_bottom'>
          <h2>Lab Result</h2>
          <ul>
            <li>Blood Test <a href=""></a></li>
            <li>CT Scans <a href=""></a></li>
            <li>Radiology Reports <a href=""></a></li>
            <li>X-Rays <a href=""></a></li>
            <li>Urine Test <a href=""></a></li>
          </ul>
        </div>
      </div>

      )}

      <main>
        <div className='chart'>

          <div className='chart_holder'> 

            <div className='chart_container'>
              <h2>Blood Pressure</h2>
              <div className="chart_wrapper">
                { systolicChartData && (
              <Line data={systolicChartData} options={options} />
              )}
              </div>
            </div>

          
              <div className='diag_results'>
               {singlePatient?.diagnosis_history?.[0]?.blood_pressure && (
                <ul>
                  <li>
                    <h2>
                      <small>Systolic</small>
                     {singlePatient.diagnosis_history[0].blood_pressure.systolic.value}
                      <span>{singlePatient.diagnosis_history[0].blood_pressure.systolic.levels}</span>
                    </h2>
                  </li>
                  <div className='diag_divider'></div>
                  <li>
                    <h2>
                      <small>Diastolic</small>
                      {singlePatient.diagnosis_history[0].blood_pressure.diastolic.value}
                      <span>{singlePatient.diagnosis_history[0].blood_pressure.diastolic.levels}</span>
                    </h2>
                  </li>
                </ul>
              )}
              </div>
         
          </div>

        {singlePatient?.diagnosis_history && (
          <div className='chart_boxes'>
            <section className='chart_box1'>
              <h3>Respiratory Rate
                <span>{singlePatient.diagnosis_history[0].respiratory_rate.value} Bpm</span>
                <small>{singlePatient.diagnosis_history[0].respiratory_rate.levels}</small></h3>
            </section>
            <section className='chart_box2'>
              <h3>Temparature
                <span>{singlePatient.diagnosis_history[0].temperature.value}</span>
                <small>{singlePatient.diagnosis_history[0].temperature.levels}</small></h3>
            </section>
            <section className='chart_box3'>
              <h3>Heart Rate
                <span>{singlePatient.diagnosis_history[0].heart_rate.value}</span>
                <small>{singlePatient.diagnosis_history[0].heart_rate.levels}</small></h3>
            </section>
          </div>
          )}

        </div>
        

        <div className='table_holder'>
          <h2>Diagnostic List</h2>
          
            <table cellspacing="0">
              <thead>
                <tr>
                  <th>Problem/Diagnosis</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                  {singlePatient?.diagnostic_list?.map((d, dIdx) => (
                <tr  key={dIdx}>
                  <td>{d.name}</td> 
                  <td>{d.description}</td> 
                    <td>{d.status}</td>
                </tr>
                ))}
              </tbody>
            </table>
         

          <div className='lab_record'>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>

        </div>

      </main>

      </div>
    </div>
  );
}

export default App;
