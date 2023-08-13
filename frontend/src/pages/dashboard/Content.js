import React, { useState, useEffect } from 'react';
import "../../assets/css/style.css"
import StatisticsDataService from "../../services/statistics.service";
import { Bar, Pie } from 'react-chartjs-2';

import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);


const Content = () => {
  const [statistics, setStatistics] = useState({
    users: 0,
    responses: 0,
    forms: 0,
    recompenses: 0,
    usersWithAnswers: 0,
    usersWithoutAnswers: 0,
  });

  useEffect(() => {
    // Fetch data from the backend and update statistics state
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch the statistics data from your backend API
      const response = await StatisticsDataService.getStatistics();

      // Calculate the number of users with and without answers
      const usersWithAnswers = response.data.usersWithAnswers;
      const usersWithoutAnswers = response.data.users - usersWithAnswers;

      // Update the statistics state with the fetched data
      setStatistics({
        ...response.data,
        usersWithAnswers,
        usersWithoutAnswers,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

    // Prepare data for the bar chart
    const chartData = {
      labels: ['Users', 'Responses', 'Forms', 'Rewards'],
      datasets: [
        {
          label: 'Statistics',
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 205, 86, 1)'],
          borderWidth: 1,
          data: [statistics.users, statistics.responses, statistics.forms, statistics.recompenses]
        }
      ]
    };

  // Prepare data for the pie chart
  const pieChartData = {
    labels: ['Users with Answers', 'Users without Answers'],
    datasets: [
      {
        data: [statistics.usersWithAnswers, statistics.usersWithoutAnswers],
        backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
      },
    ],
  };

  return (
    <main>
      <div className="page-header">
        <h1>Dashboard</h1>
        <small>Home / Dashboard</small>
      </div>
      <div className="page-content">
        <div className="analytics">
          <div className="card">
            <div className="card-head">
              <h2>{statistics.users}</h2>
              <span className="las la-user-friends" />
            </div>
            <div className="card-progress">
              <small>Users in database</small>
              <div className="card-indicator">
                <div className="indicator one" style={{ width: `${statistics.users}%` }} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h2>{statistics.responses}</h2>
              <span className="las la-file" />

            </div>
            <div className="card-progress">
              <small>Responses</small>
              <div className="card-indicator">
                <div className="indicator two" style={{ width: `${statistics.responses}%` }} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h2>{statistics.forms}</h2>
              <span className="las la-clipboard-list" />
            </div>
            <div className="card-progress">
              <small>Forms</small>
              <div className="card-indicator">
                <div className="indicator three" style={{ width: `${statistics.forms}%` }} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h2>{statistics.recompenses}</h2>
              <span className="las la-gift" />
            </div>
            <div className="card-progress">
              <small>Rewards</small>
              <div className="card-indicator">
                <div className="indicator four" style={{ width: `${statistics.recompenses}%`}} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-content">
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
        <div className="chart-containerPie">
          <Pie data={pieChartData} />
        </div>
      </div>
      </div>
    </main>
  )
}

export default Content
